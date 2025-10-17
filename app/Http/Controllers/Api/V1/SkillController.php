<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillRequest;
use App\Http\Requests\UpdateSkillRequest;
use App\Models\Skill;
use App\Services\SkillService;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 * name="Skills",
 * description="API Endpoints for managing skills"
 * )
 */
class SkillController extends Controller
{
    public function __construct(
        private SkillService $skillService
    ) {}

    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     * path="/api/v1/skills",
     * operationId="getSkillsV1List",
     * tags={"Skills"},
     * summary="Get list of skills",
     * description="Returns a paginated list of skills, optionally filtered by skills_subdomain_id, skills_domain_id or search term.",
     * @OA\Parameter(
     * name="skills_subdomain_id",
     * in="query",
     * description="Filter skills by subdomain ID.",
     * required=false,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Parameter(
     * name="skills_domain_id",
     * in="query",
     * description="Filter skills by domain ID (through subdomain).",
     * required=false,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="A search term to filter skills by name.",
     * required=false,
     * @OA\Schema(type="string")
     * ),
     * @OA\Parameter(
     * name="with_hierarchy",
     * in="query",
     * description="Include full hierarchy (domain > subdomain) data in the response.",
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
     * @OA\Items(ref="#/components/schemas/Skill")
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
        $query = Skill::query();
        
        // Filter by subdomain if provided
        if ($request->has('skills_subdomain_id')) {
            $query->where('skills_subdomain_id', $request->skills_subdomain_id);
        }
        
        // Filter by domain through subdomain if provided
        if ($request->has('skills_domain_id')) {
            $query->whereHas('subdomain', function ($q) use ($request) {
                $q->where('skills_domain_id', $request->skills_domain_id);
            });
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
        
        // Include subdomain and domain if requested
        if ($request->has('with_hierarchy') && $request->with_hierarchy) {
            $query->with('subdomain.domain');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $skills = $query->withCount('users')->paginate($perPage);
        
        // Add full_name attribute to each skill if hierarchy is loaded
        if ($request->has('with_hierarchy') && $request->with_hierarchy) {
            $skills->getCollection()->transform(function ($skill) {
                $skill->full_name = $skill->full_name;
                return $skill;
            });
        }
        
        return response()->json($skills);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/skills",
     * operationId="storeSkill",
     * tags={"Skills"},
     * summary="Create a new skill",
     * description="Creates a new skill with the provided data.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "skills_subdomain_id"},
     * @OA\Property(property="name", type="string", example="React.js", description="Name of the skill"),
     * @OA\Property(property="description", type="string", example="JavaScript library for building user interfaces", description="Description of the skill"),
     * @OA\Property(property="skills_subdomain_id", type="integer", example=1, description="ID of the skills subdomain this skill belongs to")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Skill created successfully",
     * @OA\JsonContent(ref="#/components/schemas/Skill")
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
    public function store(StoreSkillRequest $request)
    {
        try {
            $skill = $this->skillService->create($request->validated());
            
            return response()->json($skill, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the skill.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     * path="/api/v1/skills/{id}",
     * operationId="showSkill",
     * tags={"Skills"},
     * summary="Get a specific skill",
     * description="Returns detailed information about a specific skill with full hierarchy.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Skill ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(ref="#/components/schemas/Skill")
     * ),
     * @OA\Response(
     * response=404,
     * description="Skill not found",
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
        $skill = Skill::with('subdomain.domain')->findOrFail($id);
        $skill->full_name = $skill->full_name;
        
        return response()->json($skill);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/skills/{id}",
     * operationId="updateSkill",
     * tags={"Skills"},
     * summary="Update a skill",
     * description="Updates an existing skill with the provided data.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Skill ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="React.js", description="Name of the skill"),
     * @OA\Property(property="description", type="string", example="JavaScript library for building user interfaces", description="Description of the skill"),
     * @OA\Property(property="skills_subdomain_id", type="integer", example=1, description="ID of the skills subdomain this skill belongs to")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Skill updated successfully",
     * @OA\JsonContent(ref="#/components/schemas/Skill")
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error",
     * @OA\JsonContent(ref="#/components/schemas/ValidationError")
     * ),
     * @OA\Response(
     * response=404,
     * description="Skill not found",
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
    public function update(UpdateSkillRequest $request, string $id)
    {
        try {
            $skill = Skill::findOrFail($id);
            $updatedSkill = $this->skillService->update($skill, $request->validated());
            
            return response()->json($updatedSkill);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Skill not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the skill.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     * path="/api/v1/skills/{id}",
     * operationId="destroySkill",
     * tags={"Skills"},
     * summary="Delete a skill",
     * description="Deletes a skill from the system.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Skill ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Skill deleted successfully",
     * @OA\JsonContent(ref="#/components/schemas/Success")
     * ),
     * @OA\Response(
     * response=404,
     * description="Skill not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=409,
     * description="Conflict - Cannot delete skill",
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
            $skill = Skill::findOrFail($id);
            $this->skillService->delete($skill);
            
            return response()->json([
                'message' => 'Skill deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Skill not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the skill.'
            ], 500);
        }
    }
}