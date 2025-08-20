<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNicheDomainRequest;
use App\Http\Requests\UpdateNicheDomainRequest;
use App\Http\Resources\NicheDomainResource;
use App\Models\NicheDomain;
use App\Services\NicheDomainService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * @OA\Tag(
 * name="Niche Domains",
 * description="API Endpoints for managing niche domains"
 * )
 */
class NicheDomainController extends Controller
{
    public function __construct(
        private NicheDomainService $nicheDomainService
    ) {}

    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     * path="/api/v1/niche-domains",
     * operationId="getNicheDomainsList",
     * tags={"Niche Domains"},
     * summary="Get list of niche domains",
     * description="Returns a paginated list of niche domains, optionally filtered by research_area_id or search term.",
     * @OA\Parameter(
     * name="research_area_id",
     * in="query",
     * description="Filter niche domains by research area ID.",
     * required=false,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="A search term to filter niche domains by name.",
     * required=false,
     * @OA\Schema(type="string")
     * ),
     * @OA\Parameter(
     * name="with_area",
     * in="query",
     * description="Include research area data in the response.",
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
     * @OA\Items(ref="#/components/schemas/NicheDomain")
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
        $query = NicheDomain::query();
        
        // Filter by research_area_id if provided
        if ($request->has('research_area_id')) {
            $query->where('research_area_id', $request->research_area_id);
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
        
        // Include research area if requested
        if ($request->has('with_area') && $request->with_area) {
            $query->with('researchArea');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $domains = $query->paginate($perPage);
        
        return NicheDomainResource::collection($domains);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/niche-domains",
     * operationId="storeNicheDomain",
     * tags={"Niche Domains"},
     * summary="Create a new niche domain",
     * description="Creates a new niche domain with the provided data.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "research_area_id"},
     * @OA\Property(property="name", type="string", example="Machine Learning", description="Name of the niche domain"),
     * @OA\Property(property="research_area_id", type="integer", example=1, description="ID of the research area this domain belongs to")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Niche domain created successfully",
     * @OA\JsonContent(ref="#/components/schemas/NicheDomain")
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error",
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
    public function store(StoreNicheDomainRequest $request)
    {
        try {
            $domain = $this->nicheDomainService->create($request->validated());
            
            return new NicheDomainResource($domain);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the niche domain.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     * path="/api/v1/niche-domains/{id}",
     * operationId="showNicheDomain",
     * tags={"Niche Domains"},
     * summary="Get a specific niche domain",
     * description="Returns detailed information about a specific niche domain.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Niche Domain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(ref="#/components/schemas/NicheDomain")
     * ),
     * @OA\Response(
     * response=404,
     * description="Niche Domain not found",
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
        $domain = NicheDomain::with('researchArea')->findOrFail($id);
        
        return new NicheDomainResource($domain);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/niche-domains/{id}",
     * operationId="updateNicheDomain",
     * tags={"Niche Domains"},
     * summary="Update a niche domain",
     * description="Updates an existing niche domain with the provided data.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Niche Domain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="Machine Learning", description="Name of the niche domain"),
     * @OA\Property(property="research_area_id", type="integer", example=1, description="ID of the research area this domain belongs to")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Niche domain updated successfully",
     * @OA\JsonContent(ref="#/components/schemas/NicheDomain")
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=404,
     * description="Niche Domain not found",
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
    public function update(UpdateNicheDomainRequest $request, string $id)
    {
        try {
            $domain = NicheDomain::findOrFail($id);
            $updatedDomain = $this->nicheDomainService->update($domain, $request->validated());
            
            return new NicheDomainResource($updatedDomain);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Niche Domain not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the niche domain.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     * path="/api/v1/niche-domains/{id}",
     * operationId="destroyNicheDomain",
     * tags={"Niche Domains"},
     * summary="Delete a niche domain",
     * description="Deletes a niche domain from the system.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Niche Domain ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Niche domain deleted successfully",
     * @OA\JsonContent(ref="#/components/schemas/Success")
     * ),
     * @OA\Response(
     * response=404,
     * description="Niche Domain not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=409,
     * description="Conflict - Cannot delete niche domain",
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
            $domain = NicheDomain::findOrFail($id);
            $this->nicheDomainService->delete($domain);
            
            return response()->json([
                'message' => 'Niche Domain deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Niche Domain not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the niche domain.'
            ], 500);
        }
    }
}