<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFieldOfResearchRequest;
use App\Http\Requests\UpdateFieldOfResearchRequest;
use App\Http\Resources\FieldOfResearchResource;
use App\Models\FieldOfResearch;
use App\Services\FieldOfResearchService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * @OA\Tag(
 * name="Fields of Research",
 * description="API Endpoints for managing fields of research"
 * )
 */
class FieldOfResearchController extends Controller
{
    public function __construct(
        private FieldOfResearchService $fieldOfResearchService
    ) {}

    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     * path="/api/v1/fields-of-research",
     * operationId="getFieldsOfResearchList",
     * tags={"Fields of Research"},
     * summary="Get list of fields of research",
     * description="Returns a paginated list of fields of research, optionally filtered by search term.",
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="A search term to filter fields of research by name.",
     * required=false,
     * @OA\Schema(type="string")
     * ),
     * @OA\Parameter(
     * name="with_research_areas",
     * in="query",
     * description="Include research areas data in the response.",
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
     * @OA\Items(ref="#/components/schemas/FieldOfResearch")
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
        $query = FieldOfResearch::query();
        
        // Filter by name if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }
        
        // Sort by column (default: id)
        $sortBy = $request->input('sort_by', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);
        
        // Include research areas if requested
        if ($request->has('with_research_areas') && $request->with_research_areas) {
            $query->with('researchAreas');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $fields = $query->withCount('researchAreas')->paginate($perPage);
        
        return FieldOfResearchResource::collection($fields);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/fields-of-research",
     * operationId="storeFieldOfResearch",
     * tags={"Fields of Research"},
     * summary="Create a new field of research",
     * description="Creates a new field of research with the provided data.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name"},
     * @OA\Property(property="name", type="string", example="Information and Computing Sciences", description="Name of the field of research")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Field of research created successfully",
     * @OA\JsonContent(ref="#/components/schemas/FieldOfResearch")
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
    public function store(StoreFieldOfResearchRequest $request)
    {
        try {
            $field = $this->fieldOfResearchService->create($request->validated());
            
            return new FieldOfResearchResource($field);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the field of research.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     * path="/api/v1/fields-of-research/{id}",
     * operationId="showFieldOfResearch",
     * tags={"Fields of Research"},
     * summary="Get a specific field of research",
     * description="Returns detailed information about a specific field of research.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Field of Research ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(ref="#/components/schemas/FieldOfResearch")
     * ),
     * @OA\Response(
     * response=404,
     * description="Field of Research not found",
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
        $field = FieldOfResearch::with('researchAreas')->findOrFail($id);
        
        return new FieldOfResearchResource($field);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/fields-of-research/{id}",
     * operationId="updateFieldOfResearch",
     * tags={"Fields of Research"},
     * summary="Update a field of research",
     * description="Updates an existing field of research with the provided data.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Field of Research ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="Information and Computing Sciences", description="Name of the field of research")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Field of research updated successfully",
     * @OA\JsonContent(ref="#/components/schemas/FieldOfResearch")
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=404,
     * description="Field of Research not found",
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
    public function update(UpdateFieldOfResearchRequest $request, string $id)
    {
        try {
            $field = FieldOfResearch::findOrFail($id);
            $updatedField = $this->fieldOfResearchService->update($field, $request->validated());
            
            return new FieldOfResearchResource($updatedField);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Field of Research not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the field of research.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     * path="/api/v1/fields-of-research/{id}",
     * operationId="destroyFieldOfResearch",
     * tags={"Fields of Research"},
     * summary="Delete a field of research",
     * description="Deletes a field of research from the system.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Field of Research ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Field of research deleted successfully",
     * @OA\JsonContent(ref="#/components/schemas/Success")
     * ),
     * @OA\Response(
     * response=404,
     * description="Field of Research not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=409,
     * description="Conflict - Cannot delete field of research",
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
            $field = FieldOfResearch::findOrFail($id);
            $this->fieldOfResearchService->delete($field);
            
            return response()->json([
                'message' => 'Field of Research deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Field of Research not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the field of research.'
            ], 500);
        }
    }
}