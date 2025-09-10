<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SkillsDomain;
use App\Models\SkillsSubdomain;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SkillsController extends Controller
{
    /**
     * Get the complete skills taxonomy with hierarchical structure.
     */
    public function getTaxonomy()
    {
        $domains = SkillsDomain::with(['subdomains.skills'])
            ->orderBy('name')
            ->get();
            
        return response()->json([
            'data' => $domains
        ]);
    }
    
    /**
     * Search for skills across the taxonomy.
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $limit = $request->get('limit', 50);
        
        if (empty($query)) {
            return response()->json([
                'data' => [],
                'message' => 'Query parameter q is required'
            ], 400);
        }
        
        $skills = Skill::whereNotNull('skills_subdomain_id')
            ->where('name', 'LIKE', "%{$query}%")
            ->with(['subdomain.domain'])
            ->limit($limit)
            ->get()
            ->map(function ($skill) {
                return [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'description' => $skill->description,
                    'full_name' => $skill->full_name,
                    'subdomain' => $skill->subdomain ? [
                        'id' => $skill->subdomain->id,
                        'name' => $skill->subdomain->name,
                    ] : null,
                    'domain' => $skill->subdomain && $skill->subdomain->domain ? [
                        'id' => $skill->subdomain->domain->id,
                        'name' => $skill->subdomain->domain->name,
                    ] : null,
                ];
            });
            
        return response()->json([
            'data' => $skills,
            'query' => $query,
            'count' => $skills->count()
        ]);
    }
    
    /**
     * Get all skills domains.
     */
    public function getDomains()
    {
        $domains = SkillsDomain::orderBy('name')->get();
        
        return response()->json([
            'data' => $domains
        ]);
    }
    
    /**
     * Get subdomains for a specific domain.
     */
    public function getSubdomains(SkillsDomain $domain)
    {
        $subdomains = $domain->subdomains()->orderBy('name')->get();
        
        return response()->json([
            'data' => $subdomains,
            'domain' => $domain
        ]);
    }
    
    /**
     * Get skills for a specific subdomain.
     */
    public function getSkills(SkillsSubdomain $subdomain)
    {
        $skills = $subdomain->skills()->orderBy('name')->get();
        
        return response()->json([
            'data' => $skills,
            'subdomain' => $subdomain,
            'domain' => $subdomain->domain
        ]);
    }
    
    /**
     * Get all skills (flat list) with optional filtering.
     */
    public function getAllSkills(Request $request)
    {
        $query = Skill::whereNotNull('skills_subdomain_id')
            ->with(['subdomain.domain']);
            
        // Optional domain filter
        if ($request->has('domain_id')) {
            $query->whereHas('subdomain.domain', function ($q) use ($request) {
                $q->where('id', $request->get('domain_id'));
            });
        }
        
        // Optional subdomain filter
        if ($request->has('subdomain_id')) {
            $query->where('skills_subdomain_id', $request->get('subdomain_id'));
        }
        
        $skills = $query->orderBy('name')->get()->map(function ($skill) {
            return [
                'id' => $skill->id,
                'name' => $skill->name,
                'description' => $skill->description,
                'full_name' => $skill->full_name,
                'subdomain_id' => $skill->skills_subdomain_id,
                'subdomain_name' => $skill->subdomain->name ?? null,
                'domain_id' => $skill->subdomain->domain->id ?? null,
                'domain_name' => $skill->subdomain->domain->name ?? null,
            ];
        });
        
        return response()->json([
            'data' => $skills,
            'count' => $skills->count()
        ]);
    }
    
    /**
     * Get skill details for multiple skill IDs.
     */
    public function getSkillDetails(Request $request)
    {
        $request->validate([
            'skill_ids' => 'required|array',
            'skill_ids.*' => 'integer|exists:skills,id'
        ]);
        
        $skills = Skill::whereIn('id', $request->skill_ids)
            ->with(['subdomain.domain'])
            ->get()
            ->map(function ($skill) {
                return [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'description' => $skill->description,
                    'full_name' => $skill->full_name,
                    'subdomain' => [
                        'id' => $skill->subdomain->id,
                        'name' => $skill->subdomain->name,
                        'domain' => [
                            'id' => $skill->subdomain->domain->id,
                            'name' => $skill->subdomain->domain->name,
                        ]
                    ]
                ];
            });
        
        return response()->json([
            'data' => $skills
        ]);
    }
}
