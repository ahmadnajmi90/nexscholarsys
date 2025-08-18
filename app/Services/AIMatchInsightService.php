<?php

namespace App\Services;

use App\Models\Academician;
use App\Models\PostgraduateProgram;
use App\Models\User;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AIMatchInsightService
{
    protected $openaiCompletionService;

    public function __construct(OpenAICompletionService $openaiCompletionService)
    {
        $this->openaiCompletionService = $openaiCompletionService;
    }

    /**
     * Generate "Why this match" insight for a single student-supervisor pair within a program context.
     */
    public function generateSupervisorInsight(User $student, Academician $supervisor, PostgraduateProgram $program, array $researchOptionsLookup, ?string $providedCvPath = null, ?string $providedResearchText = null): string
    {
        try {
            $cacheKey = 'supervisor_insight_' . md5($student->id . '_' . $supervisor->id . '_' . $program->id);
            if (Cache::has($cacheKey)) {
                return Cache::get($cacheKey);
            }

            Log::info("AIMatchInsightService: Generating insight for student: {$student->id} and supervisor: {$supervisor->id}");

            // Check if user is an academician and we have provided data
            $isAcademician = $student->academician !== null;
            
            if ($isAcademician && ($providedCvPath || $providedResearchText)) {
                // For academicians with provided data, use that instead of their profile
                $studentType = 'student'; // Generic student type for academician searches
                $studentResearchText = $providedResearchText ?? '';
                
                $cvText = '';
                if ($providedCvPath && Storage::disk('public')->exists($providedCvPath)) {
                    try {
                        $cvText = app('App\\Services\\CVParserService')::getText($providedCvPath) ?? '';
                    } catch (\Throwable $t) {
                        Log::warning('AIMatchInsightService: CV parsing failed for academician: ' . $t->getMessage());
                    }
                }
                $studentProfileText = trim($cvText);
            } else {
                // For students or academicians without provided data, use their profile
                $studentType = $student->postgraduate ? 'postgraduate' : ($student->undergraduate ? 'undergraduate' : 'student');

                // Build student's profile text from CV + research interests (resolved IDs to text)
                $profileModel = $student->postgraduate ?? $student->undergraduate;
                $studentResearchIds = [];
                if ($student->postgraduate && !empty($student->postgraduate->field_of_research)) {
                    $studentResearchIds = is_array($student->postgraduate->field_of_research) ? $student->postgraduate->field_of_research : [];
                } elseif ($student->undergraduate && !empty($student->undergraduate->research_preference)) {
                    $studentResearchIds = is_array($student->undergraduate->research_preference) ? $student->undergraduate->research_preference : [];
                }
                $studentResearchText = implode(', ', array_filter(array_map(fn($id) => $researchOptionsLookup[$id] ?? null, $studentResearchIds)));

                $cvText = '';
                if ($profileModel && !empty($profileModel->CV_file) && Storage::disk('public')->exists($profileModel->CV_file) && class_exists('App\\Services\\CVParserService')) {
                    $cvText = app('App\\Services\\CVParserService')::getText($profileModel->CV_file) ?? '';
                }
                $studentProfileText = trim($cvText);
            }

            // Resolve supervisor expertise IDs to text
            $supervisorExpertiseIds = is_array($supervisor->research_expertise ?? null) ? $supervisor->research_expertise : [];
            $supervisorExpertiseText = implode(', ', array_filter(array_map(fn($id) => $researchOptionsLookup[$id] ?? null, $supervisorExpertiseIds)));

            $promptData = [
                'match_type' => 'student_to_supervisor_for_program',
                'student_profile_summary' => $studentProfileText,
                'student_type' => $studentType,
                'student_research_interests' => $studentResearchText,
                'student_bio' => $profileModel->bio ?? '',
                'supervisor_name' => $supervisor->full_name ?? 'Supervisor',
                'supervisor_expertise' => $supervisorExpertiseText,
                'supervisor_bio' => $supervisor->bio ?? '',
                'supervisor_position' => $supervisor->current_position ?? '',
                'supervisor_department' => $supervisor->department ?? '',
                'supervisor_supervision_style' => is_array($supervisor->style_of_supervision ?? null) ? implode(', ', $supervisor->style_of_supervision) : ($supervisor->style_of_supervision ?? ''),
                'program_name' => $program->name,
                'program_university' => $program->university->full_name ?? 'Unknown'
            ];
            Log::info('Data sent for justification prompt:', $promptData);

            $insightResponse = $this->openaiCompletionService->generateMatchInsight($promptData);
            Log::info('AIMatchInsightService: Raw insight response received: ' . (string) $insightResponse);

            if (empty($insightResponse)) {
                Log::warning('AIMatchInsightService: OpenAI service returned an empty or null response.');
                return 'No insight available for this match type.';
            }

            Cache::put($cacheKey, $insightResponse, now()->addMinutes(60));
            return $insightResponse;
        } catch (\Exception $e) {
            Log::error('Error in generateSupervisorInsight for supervisor ' . $supervisor->id . ': ' . $e->getMessage());
            return 'No insights available due to an error.';
        }
    }

    /**
     * Generate insights for a list of student matches (postgraduates and undergraduates)
     *
     * @param array $students Array of student data with match scores
     * @param string $query The search query
     * @param int $academicianId The academician's ID performing the search
     * @return array The student data with AI insights added
     */
    public function generateStudentInsights(array $students, string $query, int $academicianId): array
    {
        $academician = Academician::find($academicianId);
        
        if (!$academician) {
            // If academician not found, return students without insights
            Log::error("Academician not found for generating student insights", [
                'academician_id' => $academicianId
            ]);
            
            foreach ($students as &$student) {
                $student['ai_insights'] = "No insights available at this time.";
            }
            
            return $students;
        }
        
        // Get academician data for the prompt
        $academicianData = $academician->toArray();
        
        // Process each student
        foreach ($students as &$student) {
            // Check cache first to avoid generating the same insights multiple times
            $cacheKey = 'student_insight_' . md5($student['id'] . '_' . $student['student_type'] . '_' . $query . '_' . $academicianId);
            
            if (Cache::has($cacheKey)) {
                $student['ai_insights'] = Cache::get($cacheKey);
                continue;
            }
            
            // Generate personalized insight
            $insight = $this->generateStudentInsight($student, $query, $academicianId, $academicianData);
            
            // Store the insight
            $student['ai_insights'] = $insight;
            
            // Cache the insight
            Cache::put($cacheKey, $insight, now()->addMinutes(30));
        }
        
        return $students;
    }
    
    /**
     * Generate insight for a single student match
     *
     * @param array $student The student data
     * @param string $query The search query
     * @param int $academicianId The academician's ID performing the search
     * @param array|null $academicianData Optional academician data to avoid duplicate queries
     * @return string The generated insight
     */
    public function generateStudentInsight(array $student, string $query, int $academicianId, ?array $academicianData = null): string
    {
        try {
            // Get academician data if not provided
            if (!$academicianData) {
                $academician = Academician::find($academicianId);
                if (!$academician) {
                    return "No insights available at this time.";
                }
                $academicianData = $academician->toArray();
            }
            
            // Determine the student type and research field
            $studentType = $student['student_type'] ?? '';
            $researchField = '';
            
            if ($studentType === 'postgraduate' && !empty($student['field_of_research'])) {
                $researchField = json_encode($student['field_of_research']);
            } elseif ($studentType === 'undergraduate' && !empty($student['research_preference'])) {
                $researchField = json_encode($student['research_preference']);
            }
            
            // Determine academician's research expertise
            $academicianExpertise = json_encode($academicianData['research_expertise'] ?? []);
            
            // Generate the insight using GPT-4o
            $insightResponse = $this->openaiCompletionService->generateMatchInsight([
                'match_type' => 'academician_to_student',
                'query' => $query,
                'student' => [
                    'name' => $student['full_name'] ?? 'Unknown',
                    'type' => $studentType,
                    'research_field' => $researchField,
                    'bio' => $student['bio'] ?? '',
                    'current_status' => isset($student['current_postgraduate_status']) 
                        ? $student['current_postgraduate_status'] 
                        : (isset($student['current_undergraduate_status']) 
                            ? $student['current_undergraduate_status'] 
                            : '')
                ],
                'academician' => [
                    'name' => $academicianData['full_name'] ?? 'Unknown',
                    'position' => $academicianData['current_position'] ?? '',
                    'department' => $academicianData['department'] ?? '',
                    'research_expertise' => $academicianExpertise,
                    'supervision_style' => json_encode($academicianData['style_of_supervision'] ?? [])
                ],
                'match_score' => $student['match_score'] ?? 0.5
            ]);
            
            return $insightResponse ?: "No insight generated.";
            
        } catch (\Exception $e) {
            Log::error("Error generating student insight", [
                'error' => $e->getMessage(),
                'student_id' => $student['id'] ?? 'unknown',
                'student_type' => $student['student_type'] ?? 'unknown'
            ]);
            
            return "No insights available at this time.";
        }
    }
    
    /**
     * Generate insights for collaborator matches (only academicians now)
     *
     * @param array $collaborators Array of potential collaborators (only academicians)
     * @param string $query The search query
     * @param int $academicianId The academician's ID performing the search
     * @return array The collaborators data with AI insights added
     */
    public function generateCollaboratorInsights(array $collaborators, string $query, int $academicianId): array
    {
        $academician = Academician::find($academicianId);
        
        if (!$academician) {
            // If academician not found, return collaborators without insights
            Log::error("Academician not found for generating collaborator insights", [
                'academician_id' => $academicianId
            ]);
            
            foreach ($collaborators as &$collaborator) {
                $collaborator['ai_insights'] = "No insights available at this time.";
            }
            
            return $collaborators;
        }
        
        // Get academician data for the prompt
        $academicianData = $academician->toArray();
        
        // Process each collaborator (all are academicians now)
        foreach ($collaborators as &$collaborator) {
            $collaboratorId = $collaborator['id'] ?? 0;
            
            // Check cache first
            $cacheKey = 'collaborator_insight_' . md5($collaboratorId . '_academician_' . $query . '_' . $academicianId);
            
            if (Cache::has($cacheKey)) {
                $collaborator['ai_insights'] = Cache::get($cacheKey);
                continue;
            }
            
            // Generate academician collaborator insight
            $insight = $this->generateAcademicianCollaboratorInsight($collaborator, $query, $academicianId, $academicianData);
            
            // Store and cache the insight
            $collaborator['ai_insights'] = $insight;
            Cache::put($cacheKey, $insight, now()->addMinutes(30));
        }
        
        return $collaborators;
    }
    
    /**
     * Generate insight for a potential academician collaborator
     *
     * @param array $collaborator The academician collaborator data
     * @param string $query The search query
     * @param int $academicianId The academician's ID performing the search
     * @param array|null $searcherData Optional academician data to avoid duplicate queries
     * @return string The generated insight
     */
    protected function generateAcademicianCollaboratorInsight(array $collaborator, string $query, int $academicianId, ?array $searcherData = null): string
    {
        try {
            // Get searcher academician data if not provided
            if (!$searcherData) {
                $searcher = Academician::find($academicianId);
                if (!$searcher) {
                    return "No insights available at this time.";
                }
                $searcherData = $searcher->toArray();
            }
            
            // Skip if trying to generate insight for the same academician
            if ($collaborator['id'] == $academicianId) {
                return "This is your own profile.";
            }
            
            // Extract relevant data for both academicians
            $searcherExpertise = json_encode($searcherData['research_expertise'] ?? []);
            $collaboratorExpertise = json_encode($collaborator['research_expertise'] ?? []);
            
            // Fetch publication data for the collaborator academician
            $collaboratorPublications = $this->getAcademicianPublications($collaborator['id']);
            $collaboratorPublicationData = $this->formatPublicationsForInsight($collaboratorPublications);
            
            // Generate the insight using GPT-4o
            $insightResponse = $this->openaiCompletionService->generateMatchInsight([
                'match_type' => 'academician_to_academician',
                'query' => $query,
                'searcher' => [
                    'name' => $searcherData['full_name'] ?? 'Unknown',
                    'position' => $searcherData['current_position'] ?? '',
                    'department' => $searcherData['department'] ?? '',
                    'research_expertise' => $searcherExpertise
                ],
                'collaborator' => [
                    'name' => $collaborator['full_name'] ?? 'Unknown',
                    'position' => $collaborator['current_position'] ?? '',
                    'department' => $collaborator['department'] ?? '',
                    'research_expertise' => $collaboratorExpertise,
                    'bio' => $collaborator['bio'] ?? '',
                    'publications' => $collaboratorPublicationData
                ],
                'match_score' => $collaborator['match_score'] ?? 0.5
            ]);
            
            return $insightResponse ?: "No insight generated.";
            
        } catch (\Exception $e) {
            Log::error("Error generating academician collaborator insight", [
                'error' => $e->getMessage(),
                'collaborator_id' => $collaborator['id'] ?? 'unknown'
            ]);
            
            return "No insights available at this time.";
        }
    }
    
    /**
     * Fetch publications for an academician
     *
     * @param int $academicianId The academician's ID
     * @return \Illuminate\Database\Eloquent\Collection Collection of publications
     */
    protected function getAcademicianPublications(int $academicianId): \Illuminate\Database\Eloquent\Collection
    {
        // Look up the academician by ID to get the academician_id (unique identifier)
        $academician = Academician::find($academicianId);
        
        if (!$academician) {
            return collect();
        }
        
        // Retrieve publications using the academician_id (unique identifier)
        // Limit to recent and most cited publications for relevance
        return \App\Models\Publication::where('academician_id', $academician->academician_id)
            ->orderBy('year', 'desc') // Order by most recent first
            ->limit(10) // Limit to the 10 most recent publications
            ->get();
    }
    
    /**
     * Format publications data for inclusion in LLM prompt
     *
     * @param \Illuminate\Database\Eloquent\Collection $publications Collection of publications
     * @return string Formatted publications data
     */
    protected function formatPublicationsForInsight(\Illuminate\Database\Eloquent\Collection $publications): string
    {
        if ($publications->isEmpty()) {
            return "No publications data available.";
        }
        
        // Start with a header
        $formattedData = "Recent Publications:\n";
        
        // Track the number of publications we're including
        $count = 0;
        $maxPublications = 5; // Limit to 5 most recent publications to avoid token limits
        
        foreach ($publications as $publication) {
            if ($count >= $maxPublications) {
                break;
            }
            
            // Format each publication with key details
            $formattedData .= "- " . $publication->title;
            
            // Add year if available
            if (!empty($publication->year)) {
                $formattedData .= " (" . $publication->year . ")";
            }
            
            // Add citation count if available
            if (!empty($publication->citations) && $publication->citations > 0) {
                $formattedData .= ", Citations: " . $publication->citations;
            }
            
            // Add a brief abstract excerpt if available (limited to avoid token bloat)
            if (!empty($publication->abstract)) {
                $abstractExcerpt = Str::limit($publication->abstract, 100); // Limit abstract to 100 chars
                $formattedData .= "\n  Abstract: " . $abstractExcerpt;
            }
            
            $formattedData .= "\n";
            $count++;
        }
        
        // Add publication count if there are more than we displayed
        if ($publications->count() > $maxPublications) {
            $formattedData .= "(" . ($publications->count() - $maxPublications) . " more publications not shown)\n";
        }
        
        return $formattedData;
    }
} 