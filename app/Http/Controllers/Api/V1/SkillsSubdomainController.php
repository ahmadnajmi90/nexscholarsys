<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillsSubdomainRequest;
use App\Http\Requests\UpdateSkillsSubdomainRequest;
use App\Models\SkillsSubdomain;
use App\Services\SkillsSubdomainService;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 * name="Skills Subdomains",
 * description="API Endpoints for managing skills subdomains"
 * )
 */
class SkillsSubdomainController extends Controller
{
    public function __construct(
        private SkillsSubdomainService $skillsSubdomainService
    ) {}

    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     * path="/api/v1/skills/subdomains",
     * operationId="getSkillsSubdomainsList",
     * tags={"Skills Subdomains"},
     * summary="Get list of skills subdomains",
     * description="Returns a paginated list of skills subdomains, optionally filtered by skills_domain_id or search term.",
     * @OA\Parameter(
     * name="skills_domain_id",
     * in="query",
     * description="Filter subdomains by skills domain ID.",
     * required=false,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="A search term to filter subdomains by name.",
     * required=false,
     * @OA\Schema(type="string")
     * ),
     * @OA\Parameter(
     * name="with_domain",
     * in="query",
     * description="Include skills domain data in the response.",
     * required=false,
     * @OA\Schema(type="boolean", default=false)
     * ),
     * @OA\Parameter(
     * name="with_skills",
     * in="query",
     * description="Include skills data in the response.",
     * required=false,
     * @OA\Schema(type="boolean", default=false)
     * ),
     * @OA\Parameter(
     * name="sort_by",
     * in="query",
     * description="Sort field for the results.",
     * required=false,
     * @OA\Schema(type="string", default="id")
     * ),
     * @OA\Parameter(
     * name="sort_direction",
     * in="query",
     * description="Sort direction (asc or desc).",
     * required=false,
     * @OA\Schema(type="string", enum={"asc", "desc"}, default="asc")
     * ),
     * @OA\Parameter(
     * name="per_page",
     * in="query",
     * description="Number of items per page.",
     * required=false,
     * @OA\Schema(type="integer", default=15)
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * allOf={
     * @OA\Schema(ref="#/components/schemas/PaginatedResponse"),
     * @OA\Schema(
     * @OA\Property(
     * property="data",
     * type="array",
     * @OA\Items(ref="#/components/schemas/SkillsSubdomain")
     * )
     * )
     * }
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
     */
    public function index(Request $request)
    {
        $query = SkillsSubdomain::query();
        
        // Filter by domain if provided
        if ($request->has('skills_domain_id')) {
            $query->where('skills_domain_id', $request->skills_domain_id);
        }
        
        // Filter by name if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }
        
        // Sort by column (default: id)
        $sortBy = $request->input('sort_by', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);
        
        // Include domain and skills if requested
        if ($request->has('with_domain') && $request->with_domain) {
            $query->with('domain');
        }
        
        if ($request->has('with_skills') && $request->with_skills) {
            $query->with('skills');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $subdomains = $query->withCount('skills')->paginate($perPage);
        
        return response()->json($subdomains);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/skills/subdomains",
     * operationId="storeSkillsSubdomain",
     * tags={"Skills Subdomains"},
     * summary="Create a new skills subdomain",
     * description="Creates a new skills subdomain with the provided data.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "skills_domain_id"},
     * @OA\Property(property="name", type="string", example="Web Development", description="Name of the skills subdomain"),
     * @OA\Property(property="skills_domain_id", type="integer", example=1, description="ID of the skills domain this subdomain belongs to")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Skills subdomain created successfully",
     * @OA\JsonContent(ref="#/components/schemas/SkillsSubdomain")
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error",
     * @OA\JsonContent(ref="#/components/schemas/ValidationError")
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal server error",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
     */
    public function store(StoreSkillsSubdomainRequest $request)
    {
        try {
            $subdomain = $this->skillsSubdomainService->create($request->validated());
            
            return response()->json($subdomain, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the skills subdomain.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     * path="/api/v1/skills/subdomains/{id}",
     * operationId="showSkillsSubdomain",
     * tags={"Skills Subdomains"},
     * summary="Get a specific skills subdomain",
     * description="Returns detailed information about a specific skills subdomain.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Skills Subdomain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(ref="#/components/schemas/SkillsSubdomain")
     * ),
     * @OA\Response(
     * response=404,
     * description="Skills Subdomain not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
     */
    public function show(string $id)
    {
        $subdomain = SkillsSubdomain::with(['domain', 'skills'])->findOrFail($id);
        
        return response()->json($subdomain);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/skills/subdomains/{id}",
     * operationId="updateSkillsSubdomain",
     * tags={"Skills Subdomains"},
     * summary="Update a skills subdomain",
     * description="Updates an existing skills subdomain with the provided data.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Skills Subdomain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="Web Development", description="Name of the skills subdomain"),
     * @OA\Property(property="skills_domain_id", type="integer", example=1, description="ID of the skills domain this subdomain belongs to")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Skills subdomain updated successfully",
     * @OA\JsonContent(ref="#/components/schemas/SkillsSubdomain")
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error",
     * @OA\JsonContent(ref="#/components/schemas/ValidationError")
     * ),
     * @OA\Response(
     * response=404,
     * description="Skills Subdomain not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal server error",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
     */
    public function update(UpdateSkillsSubdomainRequest $request, string $id)
    {
        try {
            $subdomain = SkillsSubdomain::findOrFail($id);
            $updatedSubdomain = $this->skillsSubdomainService->update($subdomain, $request->validated());
            
            return response()->json($updatedSubdomain);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Skills Subdomain not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the skills subdomain.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     * path="/api/v1/skills/subdomains/{id}",
     * operationId="destroySkillsSubdomain",
     * tags={"Skills Subdomains"},
     * summary="Delete a skills subdomain",
     * description="Deletes a skills subdomain from the system.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Skills Subdomain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Skills subdomain deleted successfully",
     * @OA\JsonContent(ref="#/components/schemas/Success")
     * ),
     * @OA\Response(
     * response=404,
     * description="Skills Subdomain not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=409,
     * description="Conflict - Cannot delete skills subdomain",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal server error",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * )
     * )
     */
    public function destroy(string $id)
    {
        try {
            $subdomain = SkillsSubdomain::findOrFail($id);
            $this->skillsSubdomainService->delete($subdomain);
            
            return response()->json([
                'message' => 'Skills Subdomain deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Skills Subdomain not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the skills subdomain.'
            ], 500);
        }
    }
}