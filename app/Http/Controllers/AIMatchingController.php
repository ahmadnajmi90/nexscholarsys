<?php

namespace App\Http\Controllers;

use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use App\Models\FieldOfResearch;
use App\Models\UniversityList;
use App\Models\FacultyList;
use App\Models\User;
use App\Models\Skill;
use App\Services\SemanticSearchService;
use App\Services\AIMatchInsightService;
use App\Services\ProfileComparisonService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Log;

class AIMatchingController extends Controller
{
    protected $semanticSearchService;
    protected $aiMatchInsightService;
    protected $profileComparisonService;
    
    public function __construct(
        SemanticSearchService $semanticSearchService, 
        AIMatchInsightService $aiMatchInsightService,
        ProfileComparisonService $profileComparisonService
    ) {
        $this->semanticSearchService = $semanticSearchService;
        $this->aiMatchInsightService = $aiMatchInsightService;
        $this->profileComparisonService = $profileComparisonService;
    }

    /**
     * Display the AI matching page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Load field of research data with its relationships for hierarchical display
        $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
        $researchOptions = [];
        
        // Format research options for frontend select components
        foreach ($fieldOfResearches as $field) {
            foreach ($field->researchAreas as $area) {
                foreach ($area->nicheDomains as $domain) {
                    $researchOptions[] = [
                        'field_of_research_id' => $field->id,
                        'field_of_research_name' => $field->name,
                        'research_area_id' => $area->id,
                        'research_area_name' => $area->name,
                        'niche_domain_id' => $domain->id,
                        'niche_domain_name' => $domain->name,
                        'combined_id' => $field->id . '-' . $area->id . '-' . $domain->id
                    ];
                }
            }
        }
        
        // Get universities for filtering
        $universities = UniversityList::select('id', 'short_name', 'full_name')->get();
        
        // Get faculties for filtering
        $faculties = FacultyList::select('id', 'name', 'university_id')->get();
        
        // Get users for email lookup
        $users = User::with(['sentRequests', 'receivedRequests'])->get();
        
        // Get skills for profile display
        $skills = Skill::with('subdomain.domain')->get();
        
        return Inertia::render('AIMatching/Index', [
            'universities' => $universities,
            'faculties' => $faculties,
            'researchOptions' => $researchOptions,
            'users' => $users,
            'skills' => $skills,
        ]);
    }

    /**
     * Semantic search across supervisors, students, or collaborators
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2|max:200',
            'page' => 'nullable|integer|min:1',
            'searchType' => 'required|string|in:supervisor,students,collaborators',
        ]);
        
        $searchQuery = $request->input('query');
        $page = $request->input('page', 1);
        $searchType = $request->input('searchType');
        $perPage = 9; // Number of results per page
        
        // Get the current user for personalized results
        $user = Auth::user();
        
        // Check permissions for different search types
        if ($searchType === 'students') {
            if (!BouncerFacade::is($user)->an('academician') || !$user->academician) {
                return response()->json(['error' => 'You must be an academician to search for students'], 403);
            }
        }
        
        // For collaborator search, we need to ensure the user is authenticated but don't restrict by role
        // This allows students (postgraduates and undergraduates) to also search for academician collaborators
        
        // For supervisor search, we need student information
        $studentId = null;
        $studentType = null;
        
        // For student or collaborator search, we need academician information
        $academicianId = null;
        
        // Determine current user role for personalized matching
        if ($searchType === 'supervisor' && (BouncerFacade::is($user)->a('postgraduate') || BouncerFacade::is($user)->an('undergraduate'))) {
            if (BouncerFacade::is($user)->an('undergraduate') && $user->undergraduate) {
                $studentId = $user->undergraduate->id;
                $studentType = 'undergraduate';
            } elseif (BouncerFacade::is($user)->a('postgraduate') && $user->postgraduate) {
                $studentId = $user->postgraduate->id;
                $studentType = 'postgraduate';
            }
        } else if (($searchType === 'students' || $searchType === 'collaborators') && BouncerFacade::is($user)->an('academician')) {
            if ($user->academician) {
                $academicianId = $user->academician->id;
            }
        }
        
        // Generate a cache key for this specific search
        $cacheKey = 'ai_matching_' . md5($searchQuery . '_' . $searchType . '_' . $page . '_' . $academicianId . '_' . $studentId . '_' . $studentType);
        
        // Check cache first
        if (Cache::has($cacheKey)) {
            return response()->json(Cache::get($cacheKey));
        }
        
        // Check if the query is vague
        $isVagueQuery = $this->isVagueQuery($searchQuery);
        
        // Check if the query is highly specific (but we're now much more selective about what's considered "specific")
        $isSpecificQuery = $this->isSpecificQuery($searchQuery);
        
        // Determine the appropriate threshold - using a more forgiving approach that works better with semantic search
        $threshold = 0.35; // Default moderate threshold for most queries
        
        if ($isSpecificQuery) {
            // Only apply a slightly higher threshold for the rare truly specific technical patterns
            // Threshold is only marginally higher than default to avoid penalizing natural language
            $threshold = 0.4;
            Log::info("Using slightly higher threshold for truly specific technical query");
        } else if ($isVagueQuery) {
            // Use a more lenient threshold for vague queries
            $threshold = 0.25;
            Log::info("Using lower threshold for vague query");
        }
        
        // Add detailed logging for debug purposes
        Log::info("AI matching search parameters", [
            'query' => $searchQuery,
            'search_type' => $searchType,
            'page' => $page,
            'is_vague_query' => $isVagueQuery,
            'is_specific_query' => $isSpecificQuery,
            'threshold' => $threshold,
            'limit' => 50, // Increased limit to support pagination
            'student_id' => $studentId,
            'student_type' => $studentType,
            'academician_id' => $academicianId,
            'will_use_student_profile' => ($isVagueQuery && $studentId !== null),
            'cache_key' => $cacheKey,
            'use_qdrant' => config('services.qdrant.use_for_request', false)
        ]);
        
        // Determine which search method to use based on searchType
        if ($searchType === 'supervisor') {
            $results = $this->searchForSupervisors($searchQuery, $threshold, $page, $perPage, $studentId, $studentType);
        } else if ($searchType === 'students') {
            $results = $this->searchForStudents($searchQuery, $threshold, $page, $perPage, $academicianId);
        } else if ($searchType === 'collaborators') {
            $results = $this->searchForCollaborators($searchQuery, $threshold, $page, $perPage, $academicianId);
        } else {
            return response()->json(['error' => 'Invalid search type'], 400);
        }
        
        // Cache the results (for 30 minutes)
        Cache::put($cacheKey, $results, now()->addMinutes(30));
        
        return response()->json($results);
    }
    
    /**
     * Search for supervisors (academicians)
     */
    protected function searchForSupervisors($searchQuery, $threshold, $page, $perPage, $studentId, $studentType)
    {
        // Check if we should use Qdrant for this request
        $useQdrant = config('services.qdrant.use_for_request', false);
        
        // Find similar academicians using semantic search - get more results to support pagination
        $academicians = $this->semanticSearchService->findSimilarAcademicians(
            $searchQuery,
            50,                  // Get up to 50 matches to support pagination
            $threshold,          // Adaptive threshold based on query type
            $studentId,          // Pass student ID for personalized search
            $studentType,        // Pass student type for personalized search
            $useQdrant           // Explicitly pass the Qdrant flag
        );
        
        // Total results count for pagination
        $totalResults = count($academicians);
        
        Log::info("Supervisor search results count", [
            'query' => $searchQuery,
            'total_matches_found' => $totalResults
        ]);
        
        // Calculate pagination
        $offset = ($page - 1) * $perPage;
        $paginatedAcademicians = array_slice($academicians, $offset, $perPage);
        $hasMore = ($offset + $perPage) < $totalResults;
        
        // Generate AI insights for each match in the current page
        $paginatedAcademicians = $this->semanticSearchService->generateAcademicianInsights(
            $paginatedAcademicians, 
            $searchQuery,
            $studentId,
            $studentType
        );
        
        // Get current user profile for comparison
        $currentUserProfile = null;
        $currentUserType = null;
        if ($studentId && $studentType) {
            if ($studentType === 'postgraduate') {
                $currentUserProfile = Postgraduate::find($studentId);
                $currentUserType = 'postgraduate';
            } elseif ($studentType === 'undergraduate') {
                $currentUserProfile = Undergraduate::find($studentId);
                $currentUserType = 'undergraduate';
            }
        }
        
        // Convert to the expected format for the frontend
        $matches = [];
        foreach ($paginatedAcademicians as $academician) {
            $matchData = [
                'academician' => $academician,
                'score' => $academician['match_score'], // Make sure score is accessible
                'ai_insights' => $academician['ai_insights'],
                'result_type' => 'academician'
            ];
            
            // Add comparison data if we have current user profile
            if ($currentUserProfile) {
                try {
                    $comparison = $this->profileComparisonService->calculateFullComparison(
                        $currentUserProfile->toArray(),
                        $academician,
                        $currentUserType,
                        'academician'
                    );
                    $matchData['comparison'] = $comparison;
                } catch (\Exception $e) {
                    Log::warning('Failed to calculate comparison', [
                        'error' => $e->getMessage(),
                        'student_id' => $studentId
                    ]);
                }
            }
            
            $matches[] = $matchData;
        }
        
        // Format response
        return [
            'query' => $searchQuery,
            'searchType' => 'supervisor',
            'matches' => $matches,
            'total' => $totalResults,
            'total_count' => $totalResults, // Add total_count for frontend consistency
            'profile_used' => ($studentId !== null),
            'current_page' => $page,
            'per_page' => $perPage,
            'has_more' => $hasMore
        ];
    }
    
    /**
     * Search for students (postgraduates and undergraduates)
     */
    protected function searchForStudents($searchQuery, $threshold, $page, $perPage, $academicianId)
    {
        // Get academician's profile for personalized matching
        $academician = Academician::find($academicianId);
        
        if (!$academician) {
            return [
                'error' => 'Academician profile not found',
                'matches' => [],
                'total' => 0,
                'current_page' => $page,
                'per_page' => $perPage,
                'has_more' => false
            ];
        }
        
        // Search for students using semanticSearchService
        $students = $this->semanticSearchService->findSimilarStudents(
            $searchQuery,
            50,          // Get up to 50 matches to support pagination
            $threshold,  // Use the adaptive threshold
            $academicianId,  // Pass academician ID for personalized matching
            true         // Include both postgraduates and undergraduates
        );
        
        // Total results count for pagination
        $totalResults = count($students);
        
        Log::info("Student search results count", [
            'query' => $searchQuery,
            'total_matches_found' => $totalResults
        ]);
        
        // Calculate pagination
        $offset = ($page - 1) * $perPage;
        $paginatedStudents = array_slice($students, $offset, $perPage);
        $hasMore = ($offset + $perPage) < $totalResults;
        
        // Generate AI insights for each match in the current page
        $paginatedStudents = $this->aiMatchInsightService->generateStudentInsights(
            $paginatedStudents,
            $searchQuery,
            $academicianId
        );
        
        // Get current academician profile for comparison
        $currentAcademician = $academician;
        
        // Convert to the expected format for the frontend
        $matches = [];
        foreach ($paginatedStudents as $student) {
            $matchData = [
                'student' => $student,
                'score' => $student['match_score'],
                'ai_insights' => $student['ai_insights'],
                'result_type' => $student['student_type'] // 'postgraduate' or 'undergraduate'
            ];
            
            // Add comparison data
            if ($currentAcademician) {
                try {
                    $comparison = $this->profileComparisonService->calculateFullComparison(
                        $currentAcademician->toArray(),
                        $student,
                        'academician',
                        $student['student_type']
                    );
                    $matchData['comparison'] = $comparison;
                } catch (\Exception $e) {
                    Log::warning('Failed to calculate comparison', [
                        'error' => $e->getMessage(),
                        'academician_id' => $academicianId
                    ]);
                }
            }
            
            $matches[] = $matchData;
        }
        
        // Format response
        return [
            'query' => $searchQuery,
            'searchType' => 'students',
            'matches' => $matches,
            'total' => $totalResults,
            'total_count' => $totalResults, // Add total_count for frontend consistency
            'profile_used' => true, // Always use academician profile
            'current_page' => $page,
            'per_page' => $perPage,
            'has_more' => $hasMore
        ];
    }
    
    /**
     * Search for collaborators (academicians only)
     */
    protected function searchForCollaborators($searchQuery, $threshold, $page, $perPage, $academicianId = null)
    {
        // Get the current user
        $user = Auth::user();
        $usePersonalization = false;
        
        // If an academician ID is provided and valid, use it for personalized matching
        if ($academicianId) {
            $academician = Academician::find($academicianId);
            
            if ($academician) {
                $usePersonalization = true;
            }
        }
        
        // Search for academicians
        $academicians = $this->semanticSearchService->findSimilarAcademicians(
            $searchQuery,
            50,           // Get up to 50 academician matches to support pagination
            $threshold,   // Use the adaptive threshold
            null,         // No student ID for this search
            null,         // No student type for this search
            null,         // Use default Qdrant setting
            $usePersonalization ? $academicianId : null // Only pass academician ID if personalization is enabled
        );
        
        // Process academicians - no need to combine with students anymore
        $combinedResults = [];
        
        // Process academicians
        foreach ($academicians as $item) {
            $item['result_type'] = 'academician';
            $combinedResults[] = $item;
        }
        
        // Sort by match score
        usort($combinedResults, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });
        
        // Total results count for pagination
        $totalResults = count($combinedResults);
        
        Log::info("Collaborator search results count", [
            'query' => $searchQuery,
            'total_matches_found' => $totalResults,
            'academicians_count' => count($academicians)
        ]);
        
        // Calculate pagination
        $offset = ($page - 1) * $perPage;
        $paginatedResults = array_slice($combinedResults, $offset, $perPage);
        $hasMore = ($offset + $perPage) < $totalResults;
        
        // Get current academician profile for comparison
        $currentAcademician = $usePersonalization && $academicianId 
            ? Academician::find($academicianId) 
            : null;
        
        // Generate AI insights for each match in the current page
        // If the user is an academician, generate personalized insights
        if ($usePersonalization && $academicianId) {
            $paginatedResults = $this->aiMatchInsightService->generateCollaboratorInsights(
                $paginatedResults,
                $searchQuery,
                $academicianId
            );
        } else {
            // For non-academician users (students), generate generic insights
            // or use a simplified version that doesn't require an academician profile
            foreach ($paginatedResults as &$result) {
                // Use the academician's bio and research expertise to generate a simple insight
                // Check if research_expertise is already an array or needs to be decoded
                $expertise = $result['research_expertise'] ?? [];
                if (is_string($expertise)) {
                    $expertise = json_decode($expertise, true) ?? [];
                }
                
                $result['ai_insights'] = "This academician specializes in " . 
                    implode(", ", $expertise) . 
                    ". Consider reaching out to discuss potential collaboration opportunities.";
            }
        }
        
        // Convert to the expected format for the frontend
        $matches = [];
        foreach ($paginatedResults as $result) {
            $match = [
                'score' => $result['match_score'],
                'ai_insights' => $result['ai_insights'],
                'result_type' => $result['result_type']
            ];
            
            // Add the appropriate profile data based on result type
            // Only academicians are processed now
            $match['academician'] = $result;
            
            // Add comparison data if we have current academician profile
            if ($currentAcademician) {
                try {
                    $comparison = $this->profileComparisonService->calculateFullComparison(
                        $currentAcademician->toArray(),
                        $result,
                        'academician',
                        'academician'
                    );
                    $match['comparison'] = $comparison;
                } catch (\Exception $e) {
                    Log::warning('Failed to calculate comparison for collaborator', [
                        'error' => $e->getMessage(),
                        'academician_id' => $academicianId
                    ]);
                }
            }
            
            $matches[] = $match;
        }
        
        // Format response
        return [
            'query' => $searchQuery,
            'searchType' => 'collaborators',
            'matches' => $matches,
            'total' => $totalResults,
            'total_count' => $totalResults, // Add total_count for frontend consistency
            'profile_used' => $usePersonalization, // Indicate if personalization was used
            'current_page' => $page,
            'per_page' => $perPage,
            'has_more' => $hasMore,
            'user_type' => $user->roles->first()->name ?? 'unknown' // Include user type for frontend reference
        ];
    }
    
    /**
     * Determines if a query is vague and should use profile instead
     *
     * @param string $query The search query
     * @return bool True if query is vague
     */
    protected function isVagueQuery(string $query): bool
    {
        $query = strtolower(trim($query));
        
        // List of vague queries that indicate the user wants to use their profile
        $vagueQueries = [
            'find supervisor for me',
            'find me a supervisor',
            'find supervisor suitable for me', 
            'supervisor for me',
            'for me',
            'supervisor suitable for me',
            'suitable for me',
            'match me',
            'recommend',
            'recommend supervisor',
            'based on my profile',
            'my research',
            'my interests',
            'my profile',
            'find students for me',
            'find me students',
            'students suitable for me',
            'students for me',
            'find collaborators for me',
            'find me collaborators',
            'collaborators suitable for me',
            'collaborators for me',
        ];
        
        // Common academic fields that shouldn't be treated as vague (even if short)
        $academicFields = [
            'education',
            'biology',
            'chemistry',
            'physics',
            'mathematics',
            'math',
            'computer science',
            'engineering',
            'medicine',
            'psychology',
            'sociology',
            'history',
            'economics',
            'law',
            'business',
            'arts',
            'literature',
            'language',
            'linguistics',
            'philosophy',
            'theology',
            'agriculture',
            'science',
            'technology',
            'health',
            'nursing',
            'ai',
            'ml',
            'data science'
        ];
        
        // Check for exact matches with academic fields
        if (in_array($query, $academicFields)) {
            Log::info("Query matched common academic field: {$query}, not treating as vague");
            return false;
        }
        
        foreach ($vagueQueries as $vague) {
            if (strpos($query, $vague) !== false) {
                Log::info("Query contains vague pattern: {$vague}");
                return true;
            }
        }
        
        // Also consider very short queries as vague, but exclude common academic fields
        if (str_word_count($query) <= 2 && strlen($query) < 15) {
            // Check if the query contains any academic field terms before classifying as vague
            foreach ($academicFields as $field) {
                if (strpos($query, $field) !== false) {
                    Log::info("Short query contains academic field: {$field}, not treating as vague");
                    return false;
                }
            }
            
            Log::info("Query is short and doesn't contain academic fields: {$query}, treating as vague");
            return true;
        }
        
        return false;
    }
    
    /**
     * Determines if a query is specific enough to use a higher threshold
     *
     * @param string $query The search query
     * @return bool True if query is specific
     */
    protected function isSpecificQuery(string $query): bool
    {
        $query = strtolower(trim($query));
        
        // We'll focus only on truly specific technical search patterns
        // NOT treating natural language or longer queries as "specific"
        $specificPatterns = [
            'expertise in exact',
            'specialized only in',
            'specific expertise in',
            'specific research on'
        ];
        
        // Check if the query contains truly specific patterns
        foreach ($specificPatterns as $pattern) {
            if (strpos($query, $pattern) !== false) {
                Log::info("Query contains highly specific pattern: {$pattern}");
                return true;
            }
        }
        
        // No longer treating long queries or natural language as "specific"
        // This was counterintuitive for semantic search, as natural language
        // should not be penalized with higher thresholds
        
        return false;
    }
    
    /**
     * Get AI-generated insights for a specific profile based on a query.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInsights(Request $request)
    {
        $request->validate([
            'profile_id' => 'required|string',
            'profile_type' => 'required|string|in:academician,postgraduate,undergraduate',
            'query' => 'required|string|min:3|max:200',
        ]);
        
        $profileId = $request->input('profile_id');
        $profileType = $request->input('profile_type');
        $searchQuery = $request->input('query');
        
        // Get the current user for personalized results
        $user = Auth::user();
        $requesterId = null;
        $requesterType = null;
        
        if (BouncerFacade::is($user)->an('academician') && $user->academician) {
            $requesterId = $user->academician->id;
            $requesterType = 'academician';
        } else if (BouncerFacade::is($user)->an('postgraduate') && $user->postgraduate) {
            $requesterId = $user->postgraduate->id;
            $requesterType = 'postgraduate';
        } else if (BouncerFacade::is($user)->an('undergraduate') && $user->undergraduate) {
            $requesterId = $user->undergraduate->id;
            $requesterType = 'undergraduate';
        }
        
        // Cache key for this specific insight
        $cacheKey = 'ai_matching_insight_' . md5($profileId . '_' . $profileType . '_' . $searchQuery . '_' . $requesterId . '_' . $requesterType);
        
        // Try to get cached insight
        if (Cache::has($cacheKey)) {
            return response()->json(['insight' => Cache::get($cacheKey)]);
        }
        
        // Get the profile
        $profile = null;
        switch ($profileType) {
            case 'academician':
                $profile = Academician::where('academician_id', $profileId)->first();
                break;
            case 'postgraduate':
                $profile = Postgraduate::where('postgraduate_id', $profileId)->first();
                break;
            case 'undergraduate':
                $profile = Undergraduate::where('undergraduate_id', $profileId)->first();
                break;
        }
        
        if (!$profile) {
            return response()->json(['error' => 'Profile not found'], 404);
        }
        
        // Generate semantic insight
        $insight = '';
        
        if ($profileType === 'academician') {
            $profileArray = $profile->toArray();
            $profiles = $this->semanticSearchService->generateAcademicianInsights([$profileArray], $searchQuery);
            if (!empty($profiles) && isset($profiles[0]['ai_insights'])) {
                $insight = $profiles[0]['ai_insights'];
            }
        } else {
            // For students, use the aiMatchInsightService
            $profileArray = $profile->toArray();
            $profileArray['student_type'] = $profileType;
            $profiles = $this->aiMatchInsightService->generateStudentInsight($profileArray, $searchQuery, $requesterId);
            if (!empty($profiles) && isset($profiles['ai_insights'])) {
                $insight = $profiles['ai_insights'];
            }
        }
        
        if (empty($insight)) {
            $insight = "No detailed insights are available for this profile based on your search query.";
        }
        
        // Cache the result
        Cache::put($cacheKey, $insight, now()->addMinutes(30));
        
        return response()->json(['insight' => $insight]);
    }
    
    /**
     * Clear the AI insights cache for debugging purposes.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearInsightsCache()
    {
        // Only allow admins to clear the cache
        if (!BouncerFacade::allows('debug_features', Auth::user())) {
            return response()->json(['message' => 'Not authorized'], 403);
        }
        
        // Use cache tags to clear related cache entries if available
        if (Cache::getStore() instanceof \Illuminate\Cache\TaggableStore) {
            Cache::tags(['ai_matching', 'ai_insights'])->flush();
            return response()->json(['message' => 'Cleared all AI matching cache entries']);
        }
        
        // For non-taggable cache stores, clear specific patterns
        // Note: This is less efficient and may not clear all entries
        $cachePrefixes = [
            'ai_matching_',
            'student_insight_', 
            'supervisor_insight_',
            'collaborator_insight_'
        ];
        
        $cleared = 0;
        foreach ($cachePrefixes as $prefix) {
            // The actual keys can't be enumerated in some drivers, so we'll 
            // rely on the cache forget operation for known keys
            Cache::forget($prefix . '*');
            $cleared++;
        }
        
        return response()->json(['message' => "Cleared AI matching cache entries with {$cleared} patterns"]);
    }
    
    /**
     * Show diagnostic information about the matching system (admin only).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function diagnostics()
    {
        // Only allow admins to view diagnostics
        if (!BouncerFacade::allows('debug_features', Auth::user())) {
            return response()->json(['message' => 'Not authorized'], 403);
        }
        
        $diagnosticInfo = [
            'cache_keys' => ['Cannot enumerate cache keys in this environment'],
            'qdrant_status' => [
                'enabled' => config('services.qdrant.enabled', false),
                'rollout_percentage' => config('services.qdrant.rollout_percentage', 0),
                'url' => config('services.qdrant.url', 'not_configured'),
                'collections' => [
                    'academicians' => config('services.qdrant.academicians_collection', 'not_set'),
                    'students' => config('services.qdrant.students_collection', 'not_set')
                ]
            ],
            'embedding_config' => [
                'model' => config('services.openai.embedding_model', 'not_set'),
                'vector_size' => config('services.qdrant.vector_size', 1536)
            ]
        ];
        
        return response()->json($diagnosticInfo);
    }
}