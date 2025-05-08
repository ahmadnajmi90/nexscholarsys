<?php

namespace App\Http\Controllers;

use App\Models\Academician;
use App\Models\FieldOfResearch;
use App\Models\UniversityList;
use App\Models\FacultyList;
use App\Models\User;
use App\Services\SemanticSearchService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Log;

class SupervisorMatchingController extends Controller
{
    protected $semanticSearchService;
    
    public function __construct(SemanticSearchService $semanticSearchService)
    {
        $this->semanticSearchService = $semanticSearchService;
    }

    /**
     * Display the supervisor matching page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
        $researchOptions = [];
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
                    ];
                }
            }
        }
        
        return Inertia::render('Supervisor/FindSupervisor', [
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
            'users' => User::all(),
            'researchOptions' => $researchOptions,
        ]);
    }

    /**
     * Semantic supervisor search
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2|max:200',
            'page' => 'nullable|integer|min:1',
        ]);
        
        $searchQuery = $request->input('query');
        $page = $request->input('page', 1);
        $perPage = 9; // Number of results per page
        
        // Get the current user for personalized results
        $user = Auth::user();
        $studentId = null;
        $studentType = null;
        
        // Determine user type for student-specific matching
        if (BouncerFacade::is($user)->an('undergraduate') && $user->undergraduate) {
            $studentId = $user->undergraduate->id;
            $studentType = 'undergraduate';
        } elseif (BouncerFacade::is($user)->an('postgraduate') && $user->postgraduate) {
            $studentId = $user->postgraduate->id;
            $studentType = 'postgraduate';
        }
        
        // For debugging non-personalized search, allow override
        if ($request->has('no_student')) {
            $studentId = null;
            $studentType = null;
            
            Log::info("Search without student profile (explicit override)", [
                'query' => $searchQuery,
            ]);
        }
        
        // Cache key for this search query + student
        $baseKey = 'supervisor_match_semantic_' . md5($searchQuery . '_' . $studentId . '_' . $studentType);
        $cacheKey = $baseKey . '_page_' . $page;
        
        // Clear cache for debugging if needed
        if ($request->has('nocache')) {
            // Clear base and all potential page caches
            Cache::forget($baseKey);
            for ($i = 1; $i <= 10; $i++) {
                Cache::forget($baseKey . '_page_' . $i);
            }
            Log::info("Cache cleared for query due to nocache parameter", ['query' => $searchQuery]);
        }
        
        // Try to get cached results
        if (Cache::has($cacheKey)) {
            Log::info("Using cached results for query", ['query' => $searchQuery, 'page' => $page]);
            return response()->json(Cache::get($cacheKey));
        }
        
        // Determine if this is a vague query
        $isVagueQuery = $this->isVagueQuery($searchQuery);
        
        // Use an appropriate threshold based on query type
        // 1. Student profile with vague query: 0.3 (lowest, most permissive)
        // 2. Academic field query: 0.3 (still quite permissive)
        // 3. Default for specific queries: 0.3
        $threshold = 0.3; // Default threshold
        
        if ($isVagueQuery && $studentId !== null) {
            // Use lowest threshold for vague queries with student profile
            $threshold = 0.3;
            Log::info("Using low threshold for vague query with student profile");
        }
        
        Log::info("Search parameters", [
            'query' => $searchQuery,
            'page' => $page,
            'is_vague_query' => $isVagueQuery,
            'threshold' => $threshold,
            'limit' => 50, // Increased limit to support pagination
            'student_id' => $studentId,
            'student_type' => $studentType,
            'will_use_student_profile' => ($isVagueQuery && $studentId !== null)
        ]);
        
        // Find similar academicians using semantic search - get more results to support pagination
        $academicians = $this->semanticSearchService->findSimilarAcademicians(
            $searchQuery,
            50,                  // Get up to 50 matches to support pagination
            $threshold,          // Adaptive threshold based on query type
            $studentId,          // Pass student ID for personalized search
            $studentType         // Pass student type for personalized search
        );
        
        // Total results count for pagination
        $totalResults = count($academicians);
        
        Log::info("Search results count", [
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
                'ai_insights' => $academician['ai_insights']
            ];
        }
        
        // Format response
        $response = [
            'query' => $searchQuery,
            'matches' => $matches,
            'total' => $totalResults,
            'profile_used' => ($studentId !== null),
            'current_page' => $page,
            'per_page' => $perPage,
            'has_more' => $hasMore
        ];
        
        // Cache the results (for 30 minutes)
        Cache::put($cacheKey, $response, 1800);
        
        return response()->json($response);
    }
    
    /**
     * Determines if a query is vague and should use student profile instead
     *
     * @param string $query The search query
     * @return bool True if query is vague
     */
    protected function isVagueQuery(string $query): bool
    {
        $query = strtolower(trim($query));
        
        // List of vague queries that indicate the student wants to use their profile
        $vagueQueries = [
            'find supervisor for me',
            'find me a supervisor',
            'find supervisor suitable for me', 
            'supervisor for me',
            'for me',
            'supervisor suitable for me', // Exact match for the test case
            'suitable for me',
            'match me',
            'recommend',
            'recommend supervisor',
            'based on my profile',
            'my research',
            'my interests',
            'my profile'
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
     * Get AI-generated insights for a specific academician based on a query.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInsights(Request $request)
    {
        $request->validate([
            'academician_id' => 'required|string',
            'query' => 'required|string|min:3|max:200',
        ]);
        
        $academicianId = $request->input('academician_id');
        $searchQuery = $request->input('query');
        
        // Get the academician
        $academician = Academician::where('academician_id', $academicianId)->first();
        
        if (!$academician) {
            return response()->json(['error' => 'Academician not found'], 404);
        }
        
        // Cache key for this specific insight
        $cacheKey = 'supervisor_insight_semantic_' . md5($academicianId . '_' . $searchQuery);
        
        // Try to get cached insight
        if (Cache::has($cacheKey)) {
            return response()->json(['insight' => Cache::get($cacheKey)]);
        }
        
        // Generate semantic insight
        $academicianArray = $academician->toArray();
        $academicians = $this->semanticSearchService->generateAcademicianInsights([$academicianArray], $searchQuery);
        
        if (empty($academicians) || empty($academicians[0]['ai_insights'])) {
            // Rather than providing a hardcoded fallback, let's generate a dynamic one
            $expertise = $academician->research_expertise ?? [];
            $expertiseText = is_array($expertise) 
                ? implode(", ", array_slice($expertise, 0, 3)) 
                : $expertise;
                
            if (empty($expertiseText)) {
                $expertiseText = $academician->field_of_study ?? 'academia';
            }
            
            $insight = "Dr. {$academician->full_name} has expertise in {$expertiseText}. " .
                      "You can learn more about how their research aligns with your interest " .
                      "in {$searchQuery} by reviewing their full profile and publications.";
                      
            // Cache this fallback insight for a shorter time (1 hour)
            Cache::put($cacheKey, $insight, 3600);
            
            return response()->json(['insight' => $insight]);
        }
        
        $insight = $academicians[0]['ai_insights'];
            
        // Cache the insight (for 1 day)
        Cache::put($cacheKey, $insight, 86400);
        
        return response()->json(['insight' => $insight]);
    }

    /**
     * Clear the cache for supervisor insights.
     * This will force regeneration of AI insights with proper research field names.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearInsightsCache()
    {
        // Clear all supervisor insights cache
        Cache::flush();
        
        return response()->json([
            'success' => true,
            'message' => "Cleared all cached supervisor insights. New insights will show proper research field names."
        ]);
    }

    /**
     * Diagnostic endpoint to check embedding quality and academician data.
     * This helps debug search issues when specific queries don't return results.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function diagnostics()
    {
        // Get counts
        $totalAcademicians = Academician::count();
        $withEmbeddings = Academician::where('has_embedding', true)->count();
        $withResearchExpertise = Academician::whereNotNull('research_expertise')
            ->where('research_expertise', '!=', '[]')
            ->where('research_expertise', '!=', 'null')
            ->count();
            
        // Get sample academicians
        $sampleEmbeddingExists = Academician::where('has_embedding', true)
            ->limit(3)
            ->get(['id', 'academician_id', 'full_name', 'research_expertise', 'field_of_study']);
            
        $sampleEmbeddingMissing = Academician::where(function($q) {
                $q->where('has_embedding', false)
                  ->orWhereNull('has_embedding');
            })
            ->limit(3)
            ->get(['id', 'academician_id', 'full_name', 'research_expertise', 'field_of_study']);
            
        // Check if any embedding exists
        $embeddingCount = count($sampleEmbeddingExists);
        $hasVector = false;
        $vectorSize = 0;
        
        if ($embeddingCount > 0) {
            $firstAcademician = Academician::where('has_embedding', true)->first();
            if ($firstAcademician) {
                $vector = $firstAcademician->embedding_vector;
                if (is_string($vector)) {
                    $vector = json_decode($vector, true);
                }
                $hasVector = !empty($vector) && is_array($vector);
                $vectorSize = $hasVector ? count($vector) : 0;
            }
        }
        
        // Return diagnostic data
        return response()->json([
            'counts' => [
                'total_academicians' => $totalAcademicians,
                'with_embeddings' => $withEmbeddings,
                'with_research_expertise' => $withResearchExpertise
            ],
            'embedding_stats' => [
                'has_vector' => $hasVector,
                'vector_size' => $vectorSize
            ],
            'samples' => [
                'with_embeddings' => $sampleEmbeddingExists,
                'without_embeddings' => $sampleEmbeddingMissing
            ],
            'recommendations' => [
                'needs_embedding_generation' => ($withEmbeddings < $totalAcademicians * 0.8),
                'suggested_command' => 'php artisan embeddings:generate-academician --force'
            ]
        ]);
    }
} 