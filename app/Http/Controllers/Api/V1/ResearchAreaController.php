<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResearchAreaRequest;
use App\Http\Requests\UpdateResearchAreaRequest;
use App\Http\Resources\ResearchAreaResource;
use App\Models\ResearchArea;
use App\Services\ResearchAreaService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * @OA\Tag(
 * name="Research Areas",
 * description="API Endpoints for managing research areas"
 * )
 */
class ResearchAreaController extends Controller
{
    public function __construct(
        private ResearchAreaService $researchAreaService
    ) {}

    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     * path="/api/v1/research-areas",
     * operationId="getResearchAreasList",
     * tags={"Research Areas"},
     * summary="Get list of research areas",
     * description="Returns a paginated list of research areas, optionally filtered by field_of_research_id or search term.",
     * @OA\Parameter(
     * name="field_of_research_id",
     * in="query",
     * description="Filter research areas by field of research ID.",
     * required=false,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="A search term to filter research areas by name.",
     * required=false,
     * @OA\Schema(type="string")
     * ),
     * @OA\Parameter(
     * name="with_field",
     * in="query",
     * description="Include field of research data in the response.",
     * required=false,
     * @OA\Schema(type="boolean", default=false)
     * ),
     * @OA\Parameter(
     * name="with_domains",
     * in="query",
     * description="Include niche domains data in the response.",
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
     * @OA\Items(ref="#/components/schemas/ResearchArea")
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
        $query = ResearchArea::query();
        
        // Filter by field_of_research_id if provided
        if ($request->has('field_of_research_id')) {
            $query->where('field_of_research_id', $request->field_of_research_id);
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
        
        // Include related data if requested
        if ($request->has('with_field') && $request->with_field) {
            $query->with('fieldOfResearch');
        }
        
        if ($request->has('with_domains') && $request->with_domains) {
            $query->with('nicheDomains');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $areas = $query->withCount('nicheDomains')->paginate($perPage);
        
        return ResearchAreaResource::collection($areas);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/research-areas",
     * operationId="storeResearchArea",
     * tags={"Research Areas"},
     * summary="Create a new research area",
     * description="Creates a new research area with the provided data.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "field_of_research_id"},
     * @OA\Property(property="name", type="string", example="Artificial Intelligence and Image Processing", description="Name of the research area"),
     * @OA\Property(property="field_of_research_id", type="integer", example=1, description="ID of the field of research this area belongs to")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Research area created successfully",
     * @OA\JsonContent(ref="#/components/schemas/ResearchArea")
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
    public function store(StoreResearchAreaRequest $request)
    {
        try {
            $area = $this->researchAreaService->create($request->validated());
            
            return new ResearchAreaResource($area);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the research area.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     * path="/api/v1/research-areas/{id}",
     * operationId="showResearchArea",
     * tags={"Research Areas"},
     * summary="Get a specific research area",
     * description="Returns detailed information about a specific research area.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Research Area ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(ref="#/components/schemas/ResearchArea")
     * ),
     * @OA\Response(
     * response=404,
     * description="Research Area not found",
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
        $area = ResearchArea::with(['fieldOfResearch', 'nicheDomains'])->findOrFail($id);
        
        return new ResearchAreaResource($area);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/research-areas/{id}",
     * operationId="updateResearchArea",
     * tags={"Research Areas"},
     * summary="Update a research area",
     * description="Updates an existing research area with the provided data.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Research Area ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="Artificial Intelligence and Image Processing", description="Name of the research area"),
     * @OA\Property(property="field_of_research_id", type="integer", example=1, description="ID of the field of research this area belongs to")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Research area updated successfully",
     * @OA\JsonContent(ref="#/components/schemas/ResearchArea")
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=404,
     * description="Research Area not found",
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
    public function update(UpdateResearchAreaRequest $request, string $id)
    {
        try {
            $area = ResearchArea::findOrFail($id);
            $updatedArea = $this->researchAreaService->update($area, $request->validated());
            
            return new ResearchAreaResource($updatedArea);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Research Area not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the research area.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     * path="/api/v1/research-areas/{id}",
     * operationId="destroyResearchArea",
     * tags={"Research Areas"},
     * summary="Delete a research area",
     * description="Deletes a research area from the system.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Research Area ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Research area deleted successfully",
     * @OA\JsonContent(ref="#/components/schemas/Success")
     * ),
     * @OA\Response(
     * response=404,
     * description="Research Area not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=409,
     * description="Conflict - Cannot delete research area",
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
            $area = ResearchArea::findOrFail($id);
            $this->researchAreaService->delete($area);
            
            return response()->json([
                'message' => 'Research Area deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Research Area not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the research area.'
            ], 500);
        }
    }
}