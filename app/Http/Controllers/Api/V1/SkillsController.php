<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SkillsDomain;
use App\Models\SkillsSubdomain;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * @OA\Tag(
 * name="Skills Utility",
 * description="API Endpoints for skills taxonomy utilities and bulk operations"
 * )
 */
class SkillsController extends Controller
{
    /**
     * Get the complete skills taxonomy with hierarchical structure.
     * 
     * @OA\Get(
     * path="/api/v1/skills-taxonomy",
     * operationId="getSkillsTaxonomy",
     * tags={"Skills Utility"},
     * summary="Get complete skills taxonomy",
     * description="Returns the complete hierarchical skills taxonomy structure with domains, subdomains, and skills.",
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(
     * property="data",
     * type="array",
     * @OA\Items(
     * allOf={
     * @OA\Schema(ref="#/components/schemas/SkillsDomain"),
     * @OA\Schema(
     * @OA\Property(
     * property="subdomains",
     * type="array",
     * @OA\Items(
     * allOf={
     * @OA\Schema(ref="#/components/schemas/SkillsSubdomain"),
     * @OA\Schema(
     * @OA\Property(
     * property="skills",
     * type="array",
     * @OA\Items(ref="#/components/schemas/Skill")
     * )
     * )
     * }
     * )
     * )
     * )
     * }
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
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
     * 
     * @OA\Get(
     * path="/api/v1/skills-search",
     * operationId="searchSkills",
     * tags={"Skills Utility"},
     * summary="Search for skills",
     * description="Search for skills across the entire taxonomy by name. Returns matching skills with their hierarchy context.",
     * @OA\Parameter(
     * name="q",
     * in="query",
     * description="Search query string",
     * required=true,
     * @OA\Schema(type="string")
     * ),
     * @OA\Parameter(
     * name="limit",
     * in="query",
     * description="Maximum number of results to return",
     * required=false,
     * @OA\Schema(type="integer", default=50)
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Skill")),
     * @OA\Property(property="query", type="string", example="javascript"),
     * @OA\Property(property="count", type="integer", example=10)
     * )
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - query parameter required",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
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
     * 
     * @OA\Get(
     * path="/api/v1/skills-domains",
     * operationId="getAllSkillsDomains",
     * tags={"Skills Utility"},
     * summary="Get all skills domains",
     * description="Returns a flat list of all skills domains ordered by name.",
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(
     * property="data",
     * type="array",
     * @OA\Items(ref="#/components/schemas/SkillsDomain")
     * )
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
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
     * 
     * @OA\Get(
     * path="/api/v1/skills-domains/{domain}/subdomains",
     * operationId="getDomainSubdomains",
     * tags={"Skills Utility"},
     * summary="Get subdomains for a domain",
     * description="Returns all subdomains for a specific skills domain.",
     * @OA\Parameter(
     * name="domain",
     * in="path",
     * description="Skills Domain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/SkillsSubdomain")),
     * @OA\Property(property="domain", ref="#/components/schemas/SkillsDomain")
     * )
     * ),
     * @OA\Response(
     * response=404,
     * description="Domain not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
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
     * 
     * @OA\Get(
     * path="/api/v1/skills-subdomains/{subdomain}/skills",
     * operationId="getSubdomainSkills",
     * tags={"Skills Utility"},
     * summary="Get skills for a subdomain",
     * description="Returns all skills for a specific skills subdomain with domain context.",
     * @OA\Parameter(
     * name="subdomain",
     * in="path",
     * description="Skills Subdomain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Skill")),
     * @OA\Property(property="subdomain", ref="#/components/schemas/SkillsSubdomain"),
     * @OA\Property(property="domain", ref="#/components/schemas/SkillsDomain")
     * )
     * ),
     * @OA\Response(
     * response=404,
     * description="Subdomain not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
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
     * 
     * @OA\Get(
     * path="/api/v1/all-skills",
     * operationId="getAllSkillsFlat",
     * tags={"Skills Utility"},
     * summary="Get all skills in flat list",
     * description="Returns all skills as a flat list with full hierarchy context. Optionally filter by domain_id or subdomain_id.",
     * @OA\Parameter(
     * name="domain_id",
     * in="query",
     * description="Filter skills by domain ID",
     * required=false,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Parameter(
     * name="subdomain_id",
     * in="query",
     * description="Filter skills by subdomain ID",
     * required=false,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Skill")),
     * @OA\Property(property="count", type="integer", example=150)
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
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
     * 
     * @OA\Post(
     * path="/api/v1/skills/details",
     * operationId="getSkillDetailsMultiple",
     * tags={"Skills Utility"},
     * summary="Get details for multiple skills",
     * description="Returns detailed information about multiple skills by their IDs with full hierarchy context.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"skill_ids"},
     * @OA\Property(property="skill_ids", type="array", @OA\Items(type="integer"), example={1, 2, 3}, description="Array of skill IDs to retrieve")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(
     * property="data",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="name", type="string", example="React.js"),
     * @OA\Property(property="description", type="string", example="JavaScript library for building user interfaces"),
     * @OA\Property(property="full_name", type="string", example="Programming > Web Development > React.js"),
     * @OA\Property(
     * property="subdomain",
     * type="object",
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="name", type="string", example="Web Development"),
     * @OA\Property(
     * property="domain",
     * type="object",
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="name", type="string", example="Programming")
     * )
     * )
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation error",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
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
