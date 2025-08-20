<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUniversityRequest;
use App\Http\Requests\UpdateUniversityRequest;
use App\Http\Resources\UniversityResource;
use App\Models\UniversityList;
use App\Services\UniversityService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * @OA\Tag(
 * name="Universities",
 * description="API Endpoints for managing universities"
 * )
 */
class UniversityController extends Controller
{
    public function __construct(
        private UniversityService $universityService
    ) {}

    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     * path="/api/v1/universities",
     * operationId="getUniversitiesList",
     * tags={"Universities"},
     * summary="Get list of universities",
     * description="Returns a paginated list of universities, optionally filtered by search term or country.",
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="A search term to filter universities by full or short name.",
     * required=false,
     * @OA\Schema(type="string")
     * ),
     * @OA\Parameter(
     * name="country",
     * in="query",
     * description="Filter universities by country.",
     * required=false,
     * @OA\Schema(type="string")
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
     * @OA\Items(ref="#/components/schemas/University")
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
        $query = UniversityList::query();
        
        // Filter by name if provided
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('full_name', 'like', "%{$search}%")
                  ->orWhere('short_name', 'like', "%{$search}%");
        }
        
        // Filter by country if provided
        if ($request->has('country')) {
            $query->where('country', $request->country);
        }
        
        // Sort by column (default: id)
        $sortBy = $request->input('sort_by', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);
        
        // Paginate results
        $perPage = $request->input('per_page', 15);
        $universities = $query->withCount('faculties')->paginate($perPage);
        
        return UniversityResource::collection($universities);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/universities",
     * operationId="storeUniversity",
     * tags={"Universities"},
     * summary="Create a new university",
     * description="Creates a new university with the provided data.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"full_name", "short_name", "country", "university_category", "university_type"},
     * @OA\Property(property="full_name", type="string", example="Universiti Malaya", description="Full name of the university"),
     * @OA\Property(property="short_name", type="string", example="UM", description="Short name or abbreviation"),
     * @OA\Property(property="country", type="string", example="Malaysia", description="Country where the university is located"),
     * @OA\Property(property="university_category", type="string", enum={"Research", "Comprehensive", "N/A"}, example="Research", description="Category of the university"),
     * @OA\Property(property="university_type", type="string", enum={"Public", "Private"}, example="Public", description="Type of the university"),
     * @OA\Property(property="profile_picture", type="string", format="binary", nullable=true, description="Profile picture file"),
     * @OA\Property(property="background_image", type="string", format="binary", nullable=true, description="Background image file")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="University created successfully",
     * @OA\JsonContent(ref="#/components/schemas/University")
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
    public function store(StoreUniversityRequest $request)
    {
        try {
            $university = $this->universityService->create($request->validated());
            
            return new UniversityResource($university);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the university.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     * path="/api/v1/universities/{id}",
     * operationId="showUniversity",
     * tags={"Universities"},
     * summary="Get a specific university",
     * description="Returns detailed information about a specific university.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="University ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(ref="#/components/schemas/University")
     * ),
     * @OA\Response(
     * response=404,
     * description="University not found",
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
        $university = UniversityList::with('faculties')->findOrFail($id);
        
        return new UniversityResource($university);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/universities/{id}",
     * operationId="updateUniversity",
     * tags={"Universities"},
     * summary="Update a university",
     * description="Updates an existing university with the provided data.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="University ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="full_name", type="string", example="Universiti Malaya", description="Full name of the university"),
     * @OA\Property(property="short_name", type="string", example="UM", description="Short name or abbreviation"),
     * @OA\Property(property="country", type="string", example="Malaysia", description="Country where the university is located"),
     * @OA\Property(property="university_category", type="string", enum={"Research", "Comprehensive", "N/A"}, example="Research", description="Category of the university"),
     * @OA\Property(property="university_type", type="string", enum={"Public", "Private"}, example="Public", description="Type of the university"),
     * @OA\Property(property="profile_picture", type="string", format="binary", nullable=true, description="Profile picture file"),
     * @OA\Property(property="background_image", type="string", format="binary", nullable=true, description="Background image file")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="University updated successfully",
     * @OA\JsonContent(ref="#/components/schemas/University")
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=404,
     * description="University not found",
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
    public function update(UpdateUniversityRequest $request, string $id)
    {
        try {
            $university = UniversityList::findOrFail($id);
            $updatedUniversity = $this->universityService->update($university, $request->validated());
            
            return new UniversityResource($updatedUniversity);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'University not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the university.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     * path="/api/v1/universities/{id}",
     * operationId="destroyUniversity",
     * tags={"Universities"},
     * summary="Delete a university",
     * description="Deletes a university from the system.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="University ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="University deleted successfully",
     * @OA\JsonContent(ref="#/components/schemas/Success")
     * ),
     * @OA\Response(
     * response=404,
     * description="University not found",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=409,
     * description="Conflict - Cannot delete university",
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
            $university = UniversityList::findOrFail($id);
            $this->universityService->delete($university);
            
            return response()->json([
                'message' => 'University deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'University not found.'
            ], 404);
        } catch (\App\Exceptions\CannotDeleteException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 409);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the university.'
            ], 500);
        }
    }
}