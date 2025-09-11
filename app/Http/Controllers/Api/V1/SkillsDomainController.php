<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSkillsDomainRequest;
use App\Http\Requests\UpdateSkillsDomainRequest;
use App\Models\SkillsDomain;
use App\Services\SkillsDomainService;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 * name="Skills Domains",
 * description="API Endpoints for managing skills domains"
 * )
 */
class SkillsDomainController extends Controller
{
    public function __construct(
        private SkillsDomainService $skillsDomainService
    ) {}

    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     * path="/api/v1/skills/domains",
     * operationId="getSkillsDomainsV1List",
     * tags={"Skills Domains"},
     * summary="Get list of skills domains",
     * description="Returns a paginated list of skills domains, optionally filtered by search term.",
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="A search term to filter skills domains by name.",
     * required=false,
     * @OA\Schema(type="string")
     * ),
     * @OA\Parameter(
     * name="with_subdomains",
     * in="query",
     * description="Include subdomains data in the response.",
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
     * description="Successful operation"
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated"
     * )
     * )
     */
    public function index(Request $request)
    {
        $query = SkillsDomain::query();
        
        // Filter by name if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }
        
        // Sort by column (default: id)
        $sortBy = $request->input('sort_by', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);
        
        // Include subdomains if requested
        if ($request->has('with_subdomains') && $request->with_subdomains) {
            $query->with('subdomains');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $domains = $query->withCount('subdomains')->paginate($perPage);
        
        return response()->json($domains);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/skills/domains",
     * operationId="storeSkillsDomain",
     * tags={"Skills Domains"},
     * summary="Create a new skills domain",
     * description="Creates a new skills domain with the provided data.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name"},
     * @OA\Property(property="name", type="string", example="Technology & Information Technology", description="Name of the skills domain")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Skills domain created successfully"
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error"
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated"
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal server error"
     * )
     * )
     */
    public function store(StoreSkillsDomainRequest $request)
    {
        try {
            $domain = $this->skillsDomainService->create($request->validated());
            
            return response()->json($domain, 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the skills domain.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     * path="/api/v1/skills/domains/{id}",
     * operationId="showSkillsDomain",
     * tags={"Skills Domains"},
     * summary="Get a specific skills domain",
     * description="Returns detailed information about a specific skills domain.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Skills Domain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation"
     * ),
     * @OA\Response(
     * response=404,
     * description="Skills Domain not found"
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated"
     * )
     * )
     */
    public function show(string $id)
    {
        $domain = SkillsDomain::with('subdomains')->findOrFail($id);
        
        return response()->json($domain);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/skills/domains/{id}",
     * operationId="updateSkillsDomain",
     * tags={"Skills Domains"},
     * summary="Update a skills domain",
     * description="Updates an existing skills domain with the provided data.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Skills Domain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="Technology & Information Technology", description="Name of the skills domain")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Skills domain updated successfully"
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error"
     * ),
     * @OA\Response(
     * response=404,
     * description="Skills Domain not found"
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated"
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal server error"
     * )
     * )
     */
    public function update(UpdateSkillsDomainRequest $request, string $id)
    {
        try {
            $domain = SkillsDomain::findOrFail($id);
            $updatedDomain = $this->skillsDomainService->update($domain, $request->validated());
            
            return response()->json($updatedDomain);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Skills Domain not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the skills domain.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     * path="/api/v1/skills/domains/{id}",
     * operationId="destroySkillsDomain",
     * tags={"Skills Domains"},
     * summary="Delete a skills domain",
     * description="Deletes a skills domain from the system.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Skills Domain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Skills domain deleted successfully"
     * ),
     * @OA\Response(
     * response=404,
     * description="Skills Domain not found"
     * ),
     * @OA\Response(
     * response=409,
     * description="Conflict - Cannot delete skills domain"
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated"
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal server error"
     * )
     * )
     */
    public function destroy(string $id)
    {
        try {
            $domain = SkillsDomain::findOrFail($id);
            $this->skillsDomainService->delete($domain);
            
            return response()->json([
                'message' => 'Skills Domain deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Skills Domain not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the skills domain.'
            ], 500);
        }
    }
}