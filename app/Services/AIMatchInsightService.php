<?php

namespace App\Services;

use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class AIMatchInsightService
{
    protected $openaiCompletionService;

    public function __construct(OpenAICompletionService $openaiCompletionService)
    {
        $this->openaiCompletionService = $openaiCompletionService;
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
     * Generate insights for collaborator matches (both academicians and students)
     *
     * @param array $collaborators Array of potential collaborators (mixed academicians and students)
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
        
        // Process each collaborator
        foreach ($collaborators as &$collaborator) {
            $collaboratorType = $collaborator['result_type'] ?? 'unknown';
            $collaboratorId = $collaborator['id'] ?? 0;
            
            // Check cache first
            $cacheKey = 'collaborator_insight_' . md5($collaboratorId . '_' . $collaboratorType . '_' . $query . '_' . $academicianId);
            
            if (Cache::has($cacheKey)) {
                $collaborator['ai_insights'] = Cache::get($cacheKey);
                continue;
            }
            
            // Generate appropriate insight based on collaborator type
            if ($collaboratorType === 'academician') {
                $insight = $this->generateAcademicianCollaboratorInsight($collaborator, $query, $academicianId, $academicianData);
            } else {
                // For students (postgraduate or undergraduate)
                $insight = $this->generateStudentInsight($collaborator, $query, $academicianId, $academicianData);
            }
            
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
                    'bio' => $collaborator['bio'] ?? ''
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
} 