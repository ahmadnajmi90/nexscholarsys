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
    
    public function __construct(SemanticSearchService $semanticSearchService, AIMatchInsightService $aiMatchInsightService)
    {
        $this->semanticSearchService = $semanticSearchService;
        $this->aiMatchInsightService = $aiMatchInsightService;
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
        $users = User::select('id', 'unique_id', 'email')->get();
        
        // Get skills for profile display
        $skills = Skill::all();
        
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
        if ($searchType === 'students' || $searchType === 'collaborators') {
            if (!BouncerFacade::is($user)->an('academician') || !$user->academician) {
                return response()->json(['error' => 'You must be an academician to search for students or collaborators'], 403);
            }
        }
        
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
        
        // Check if the query is highly specific (for adjusting threshold)
        $isSpecificQuery = $this->isSpecificQuery($searchQuery);
        
        // Determine the appropriate threshold based on query specificity
        $threshold = 0.3; // Default threshold - changed from 0.5 to 0.3 to match SupervisorMatchingController
        
        if ($isSpecificQuery) {
            // Raise threshold for very specific queries to get more relevant results
            $threshold = 0.5; // Changed from 0.6 to 0.5
            Log::info("Using higher threshold for specific query");
        } else if ($isVagueQuery) {
            // Lower threshold for vague queries
            $threshold = 0.3; // Changed from 0.4 to 0.3
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
        
        // Convert to the expected format for the frontend
        $matches = [];
        foreach ($paginatedAcademicians as $academician) {
            $matches[] = [
                'academician' => $academician,
                'score' => $academician['match_score'], // Make sure score is accessible
                'ai_insights' => $academician['ai_insights'],
                'result_type' => 'academician'
            ];
        }
        
        // Format response
        return [
            'query' => $searchQuery,
            'searchType' => 'supervisor',
            'matches' => $matches,
            'total' => $totalResults,
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
        
        // Convert to the expected format for the frontend
        $matches = [];
        foreach ($paginatedStudents as $student) {
            $matches[] = [
                'student' => $student,
                'score' => $student['match_score'],
                'ai_insights' => $student['ai_insights'],
                'result_type' => $student['student_type'] // 'postgraduate' or 'undergraduate'
            ];
        }
        
        // Format response
        return [
            'query' => $searchQuery,
            'searchType' => 'students',
            'matches' => $matches,
            'total' => $totalResults,
            'profile_used' => true, // Always use academician profile
            'current_page' => $page,
            'per_page' => $perPage,
            'has_more' => $hasMore
        ];
    }
    
    /**
     * Search for collaborators (other academicians and students)
     */
    protected function searchForCollaborators($searchQuery, $threshold, $page, $perPage, $academicianId)
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
        
        // Search for other academicians
        $academicians = $this->semanticSearchService->findSimilarAcademicians(
            $searchQuery,
            50,           // Increased to 50 academician matches (was 30)
            $threshold,   // Use the adaptive threshold
            null,         // No student ID for this search
            null,         // No student type for this search
            null,         // Use default Qdrant setting
            $academicianId // Pass academician ID for personalized matching
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
        
        // Generate AI insights for each match in the current page
        $paginatedResults = $this->aiMatchInsightService->generateCollaboratorInsights(
            $paginatedResults,
            $searchQuery,
            $academicianId
        );
        
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
            
            $matches[] = $match;
        }
        
        // Format response
        return [
            'query' => $searchQuery,
            'searchType' => 'collaborators',
            'matches' => $matches,
            'total' => $totalResults,
            'profile_used' => true, // Always use academician profile
            'current_page' => $page,
            'per_page' => $perPage,
            'has_more' => $hasMore
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
        
        // Patterns that indicate a specific, detailed query
        $specificPatterns = [
            'machine learning for', 
            'deep learning in',
            'artificial intelligence for',
            'data science in',
            'research on',
            'expertise in',
            'specialized in', 
            'applications of',
            'implementation of',
            'methodology for',
            'framework for',
            'approach to',
            'technique for',
            'analysis of',
            'modeling of',
            'design of'
        ];
        
        // Check if the query contains specific patterns
        foreach ($specificPatterns as $pattern) {
            if (strpos($query, $pattern) !== false) {
                Log::info("Query contains specific pattern: {$pattern}");
                return true;
            }
        }
        
        // Check if query is long and detailed (over 5 words, over 30 chars)
        if (str_word_count($query) > 5 && strlen($query) > 30) {
            Log::info("Query is long and detailed, treating as specific");
            return true;
        }
        
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