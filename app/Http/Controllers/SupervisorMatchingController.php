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
     * Search for supervisors based on research interests.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:3|max:200',
        ]);

        $searchQuery = $request->input('query');
        
        // Cache key for this search query
        $cacheKey = 'supervisor_match_semantic_' . md5($searchQuery);
        
        // Clear cache during development/testing
        // Cache::forget($cacheKey);
        
        // Try to get cached results
        if (Cache::has($cacheKey)) {
            return response()->json(Cache::get($cacheKey));
        }
        
        // Find similar academicians using semantic search
        $academicians = $this->semanticSearchService->findSimilarAcademicians(
            $searchQuery,
            20,     // Get up to 20 matches
            0.3     // Lower threshold to capture more matches (was 0.5)
        );
        
        // Generate AI insights for each match
        $academicians = $this->semanticSearchService->generateAcademicianInsights($academicians, $searchQuery);
        
        // Convert to the expected format for the frontend
        $matches = [];
        foreach ($academicians as $academician) {
            $matches[] = [
                'academician' => $academician,
                'match_score' => $academician['match_score'],
                'ai_insights' => $academician['ai_insights']
            ];
        }
        
        // Format response
        $response = [
            'query' => $searchQuery,
            'matches' => $matches,
            'total' => count($matches)
        ];
        
        // Cache the results (for 30 minutes)
        Cache::put($cacheKey, $response, 1800);
        
        return response()->json($response);
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
        
        if (empty($academicians)) {
            return response()->json(['insight' => "This supervisor has expertise that may be relevant to your interest in {$searchQuery}."]);
        }
        
        $insight = $academicians[0]['ai_insights'];
            
        // Cache the insight (for 1 day)
        Cache::put($cacheKey, $insight, 86400);
        
        return response()->json(['insight' => $insight]);
    }
} 