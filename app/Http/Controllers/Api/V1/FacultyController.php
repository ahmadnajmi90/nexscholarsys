<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFacultyRequest;
use App\Http\Requests\UpdateFacultyRequest;
use App\Http\Resources\FacultyResource;
use App\Models\FacultyList;
use App\Services\FacultyService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * @OA\Tag(
 * name="Faculties",
 * description="API Endpoints for managing faculties"
 * )
 */
class FacultyController extends Controller
{
    public function __construct(
        private FacultyService $facultyService
    ) {}

    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     * path="/api/v1/faculties",
     * operationId="getFacultiesList",
     * tags={"Faculties"},
     * summary="Get list of faculties",
     * description="Returns a paginated list of faculties, optionally filtered by university_id or search term.",
     * @OA\Parameter(
     * name="university_id",
     * in="query",
     * description="Filter faculties by university ID.",
     * required=false,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="A search term to filter faculties by name.",
     * required=false,
     * @OA\Schema(type="string")
     * ),
     * @OA\Parameter(
     * name="with_university",
     * in="query",
     * description="Include university data in the response.",
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
     * @OA\Items(ref="#/components/schemas/Faculty")
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
        $query = FacultyList::query();
        
        // Filter by university_id if provided
        if ($request->has('university_id')) {
            $query->where('university_id', $request->university_id);
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
        
        // Include university data if requested
        if ($request->has('with_university') && $request->with_university) {
            $query->with('university');
        }
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $faculties = $query->withCount(['academicians', 'postgraduates', 'undergraduates'])->paginate($perPage);
        
        return FacultyResource::collection($faculties);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/faculties",
     * operationId="storeFaculty",
     * tags={"Faculties"},
     * summary="Create a new faculty",
     * description="Creates a new faculty with the provided data.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "university_id"},
     * @OA\Property(property="name", type="string", example="Faculty of Computer Science and Information Technology", description="Name of the faculty"),
     * @OA\Property(property="university_id", type="integer", example=1, description="ID of the university this faculty belongs to")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Faculty created successfully",
     * @OA\JsonContent(ref="#/components/schemas/Faculty")
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
    public function store(StoreFacultyRequest $request)
    {
        try {
            $faculty = $this->facultyService->create($request->validated());
            
            return new FacultyResource($faculty);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the faculty.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     * path="/api/v1/faculties/{id}",
     * operationId="showFaculty",
     * tags={"Faculties"},
     * summary="Get a specific faculty",
     * description="Returns detailed information about a specific faculty.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Faculty ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(ref="#/components/schemas/Faculty")
     * ),
     * @OA\Response(
     * response=404,
     * description="Faculty not found",
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
        $faculty = FacultyList::with('university')
            ->withCount(['academicians', 'postgraduates', 'undergraduates'])
            ->findOrFail($id);
        
        return new FacultyResource($faculty);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/faculties/{id}",
     * operationId="updateFaculty",
     * tags={"Faculties"},
     * summary="Update a faculty",
     * description="Updates an existing faculty with the provided data.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Faculty ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="Faculty of Computer Science and Information Technology", description="Name of the faculty"),
     * @OA\Property(property="university_id", type="integer", example=1, description="ID of the university this faculty belongs to")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Faculty updated successfully",
     * @OA\JsonContent(ref="#/components/schemas/Faculty")
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=404,
     * description="Faculty not found",
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
    public function update(UpdateFacultyRequest $request, string $id)
    {
        try {
            $faculty = FacultyList::findOrFail($id);
            $updatedFaculty = $this->facultyService->update($faculty, $request->validated());
            
            return new FacultyResource($updatedFaculty);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Faculty not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the faculty.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     * path="/api/v1/faculties/{id}",
     * operationId="destroyFaculty",
     * tags={"Faculties"},
     * summary="Delete a faculty",
     * description="Deletes a faculty from the system.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Faculty ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Faculty deleted successfully",
     * @OA\JsonContent(ref="#/components/schemas/Success")
     * ),
     * @OA\Response(
     * response=404,
     * description="Faculty not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=409,
     * description="Conflict - Cannot delete faculty",
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
            $faculty = FacultyList::findOrFail($id);
            $this->facultyService->delete($faculty);
            
            return response()->json([
                'message' => 'Faculty deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Faculty not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the faculty.'
            ], 500);
        }
    }
}