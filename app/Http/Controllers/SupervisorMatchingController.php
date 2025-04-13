<?php

namespace App\Http\Controllers;

use App\Models\Academician;
use App\Models\FieldOfResearch;
use App\Models\UniversityList;
use App\Models\FacultyList;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class SupervisorMatchingController extends Controller
{
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
        
        // Get verified academicians who are available as supervisors
        $academicians = Academician::where('verified', 1)
            ->where('availability_as_supervisor', 1)
            ->get();
            
        // Get all research options for context in the match
        $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
        $researchOptions = [];
        foreach ($fieldOfResearches as $field) {
            foreach ($field->researchAreas as $area) {
                foreach ($area->nicheDomains as $domain) {
                    $researchOptions[] = [
                        'id' => "{$field->id}-{$area->id}-{$domain->id}",
                        'field_of_research_name' => $field->name,
                        'research_area_name' => $area->name,
                        'niche_domain_name' => $domain->name,
                    ];
                }
            }
        }
        
        // Transform academicians for matching algorithm
        $academiciansData = $academicians->map(function ($academician) use ($researchOptions) {
            $researchExpertise = [];
            
            // Map research expertise IDs to their full names
            if (is_array($academician->research_expertise)) {
                foreach ($academician->research_expertise as $expertiseId) {
                    $match = collect($researchOptions)->firstWhere('id', $expertiseId);
                    if ($match) {
                        $researchExpertise[] = "{$match['field_of_research_name']} - {$match['research_area_name']} - {$match['niche_domain_name']}";
                    }
                }
            }
            
            return [
                'id' => $academician->id,
                'academician_id' => $academician->academician_id,
                'name' => $academician->full_name,
                'position' => $academician->current_position,
                'department' => $academician->department,
                'university' => $academician->university,
                'bio' => $academician->bio,
                'research_expertise' => $researchExpertise,
                'style_of_supervision' => $academician->style_of_supervision,
                'url' => $academician->url,
                'profile_picture' => $academician->profile_picture,
                'background_image' => $academician->background_image,
                'verified' => $academician->verified,
            ];
        });
        
        // Cache key for this search query
        $cacheKey = 'supervisor_match_' . md5($searchQuery);
        
        // Try to get cached results
        if (Cache::has($cacheKey)) {
            return response()->json(Cache::get($cacheKey));
        }
        
        // Perform RAG algorithm to match supervisors to the query
        // This is where you would integrate with an AI service
        // For now, we'll do a basic keyword matching approach
        $matchedSupervisors = [];
        
        foreach ($academiciansData as $academician) {
            $matchScore = 0;
            $matchReason = [];
            
            // Check if query matches research expertise
            foreach ($academician['research_expertise'] as $expertise) {
                if (stripos($expertise, $searchQuery) !== false) {
                    $matchScore += 2;
                    $matchReason[] = "Research expertise in '$expertise' matches your interest in '$searchQuery'.";
                }
            }
            
            // Check if query matches bio
            if (stripos($academician['bio'], $searchQuery) !== false) {
                $matchScore += 1;
                $matchReason[] = "Biography mentions keywords related to '$searchQuery'.";
            }
            
            // Only include academicians with some match
            if ($matchScore > 0) {
                // Generate AI insights based on the match
                $aiInsights = "This supervisor has expertise that aligns with your interest in $searchQuery. " . 
                    implode(' ', $matchReason);
                
                $matchedSupervisors[] = [
                    'academician' => $academician,
                    'match_score' => $matchScore,
                    'ai_insights' => $aiInsights
                ];
            }
        }
        
        // Sort by match score (highest first)
        usort($matchedSupervisors, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });
        
        // Limit to top 10 matches
        $matchedSupervisors = array_slice($matchedSupervisors, 0, 10);
        
        // Format response
        $response = [
            'query' => $searchQuery,
            'matches' => $matchedSupervisors,
            'total' => count($matchedSupervisors)
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
        $cacheKey = 'supervisor_insight_' . md5($academicianId . '_' . $searchQuery);
        
        // Try to get cached insight
        if (Cache::has($cacheKey)) {
            return response()->json(['insight' => Cache::get($cacheKey)]);
        }
        
        // Get research options
        $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
        $researchOptions = [];
        foreach ($fieldOfResearches as $field) {
            foreach ($field->researchAreas as $area) {
                foreach ($area->nicheDomains as $domain) {
                    $researchOptions[] = [
                        'id' => "{$field->id}-{$area->id}-{$domain->id}",
                        'field_of_research_name' => $field->name,
                        'research_area_name' => $area->name,
                        'niche_domain_name' => $domain->name,
                    ];
                }
            }
        }
        
        // Map research expertise to full names
        $researchExpertise = [];
        if (is_array($academician->research_expertise)) {
            foreach ($academician->research_expertise as $expertiseId) {
                $match = collect($researchOptions)->firstWhere('id', $expertiseId);
                if ($match) {
                    $researchExpertise[] = "{$match['field_of_research_name']} - {$match['research_area_name']} - {$match['niche_domain_name']}";
                }
            }
        }
        
        // Generate insight based on the match between the academician and the query
        // This is a placeholder - in production, you would integrate with an AI service
        $insight = "Dr. {$academician->full_name} has expertise in " . implode(', ', $researchExpertise) . 
            " which aligns with your interest in {$searchQuery}. " .
            ($academician->style_of_supervision 
                ? "Their {$academician->style_of_supervision} supervision style means " . $this->describeSupervisorStyle($academician->style_of_supervision) 
                : "");
            
        // Cache the insight (for 1 day)
        Cache::put($cacheKey, $insight, 86400);
        
        return response()->json(['insight' => $insight]);
    }
    
    /**
     * Describe a supervisor's style in natural language.
     *
     * @param string $style
     * @return string
     */
    private function describeSupervisorStyle($style)
    {
        $descriptions = [
            'Independent' => 'they prefer students who can work autonomously with minimal guidance.',
            'Collaborative' => 'they work closely with students as partners in the research process.',
            'Structured' => 'they provide clear objectives, regular meetings, and defined milestones.',
            'Hands-off' => 'they focus on limited intervention, allowing for student-driven research.',
            'Hands-on' => 'they offer close guidance and detailed feedback at every stage of your research.'
        ];
        
        return $descriptions[$style] ?? 'they have a unique approach to supervision.';
    }
} 