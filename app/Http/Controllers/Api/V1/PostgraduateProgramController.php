<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostgraduateProgramRequest;
use App\Http\Requests\UpdatePostgraduateProgramRequest;
use App\Http\Requests\ImportPostgraduateProgramsRequest;
use App\Http\Resources\PostgraduateProgramResource;
use App\Imports\PostgraduateProgramsImport;
use App\Models\PostgraduateProgram;
use App\Services\PostgraduateProgramService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

/**
 * @OA\Tag(
 * name="Postgraduate Programs",
 * description="API Endpoints for managing postgraduate programs"
 * )
 */
class PostgraduateProgramController extends Controller
{
    public function __construct(
        private PostgraduateProgramService $postgraduateProgramService
    ) {}

    /**
     * Display a listing of the resource.
     * 
     * @OA\Get(
     * path="/api/v1/postgraduate-programs",
     * operationId="getPostgraduateProgramsList",
     * tags={"Postgraduate Programs"},
     * summary="Get list of postgraduate programs",
     * description="Returns a paginated list of postgraduate programs, optionally filtered by search term.",
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="A search term to filter postgraduate programs by name.",
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
     * @OA\Items(ref="#/components/schemas/PostgraduateProgram")
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
        $query = PostgraduateProgram::with(['university', 'faculty']);

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $sortBy = $request->input('sort_by', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);

        $perPage = $request->input('per_page', 15);
        $programs = $query->paginate($perPage);

        return PostgraduateProgramResource::collection($programs);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/postgraduate-programs",
     * operationId="storePostgraduateProgram",
     * tags={"Postgraduate Programs"},
     * summary="Create a new postgraduate program",
     * description="Creates a new postgraduate program with the provided data.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "program_type", "university_id"},
     * @OA\Property(property="name", type="string", example="Master of Computer Science", description="Name of the program"),
     * @OA\Property(property="program_type", type="string", enum={"Master", "PhD"}, example="Master", description="Type of program"),
     * @OA\Property(property="university_id", type="integer", example=1, description="ID of the university"),
     * @OA\Property(property="faculty_id", type="integer", nullable=true, example=1, description="ID of the faculty"),
     * @OA\Property(property="description", type="string", nullable=true, example="A comprehensive program in computer science", description="Program description"),
     * @OA\Property(property="duration_years", type="string", nullable=true, example="2", description="Duration in years"),
     * @OA\Property(property="funding_info", type="string", nullable=true, example="Scholarships available", description="Funding information"),
     * @OA\Property(property="application_url", type="string", nullable=true, example="https://example.com/apply", description="Application URL"),
     * @OA\Property(property="country", type="string", nullable=true, example="Malaysia", description="Country")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Postgraduate program created successfully",
     * @OA\JsonContent(ref="#/components/schemas/PostgraduateProgram")
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
    public function store(StorePostgraduateProgramRequest $request)
    {
        try {
            $program = $this->postgraduateProgramService->create($request->validated());
            
            return new PostgraduateProgramResource($program);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while creating the postgraduate program.'
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     * 
     * @OA\Get(
     * path="/api/v1/postgraduate-programs/{id}",
     * operationId="showPostgraduateProgram",
     * tags={"Postgraduate Programs"},
     * summary="Get a specific postgraduate program",
     * description="Returns detailed information about a specific postgraduate program.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Postgraduate Program ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(ref="#/components/schemas/PostgraduateProgram")
     * ),
     * @OA\Response(
     * response=404,
     * description="Postgraduate Program not found",
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
        $program = PostgraduateProgram::findOrFail($id);
        return new PostgraduateProgramResource($program);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @OA\Post(
     * path="/api/v1/postgraduate-programs/{id}",
     * operationId="updatePostgraduateProgram",
     * tags={"Postgraduate Programs"},
     * summary="Update a postgraduate program",
     * description="Updates an existing postgraduate program with the provided data.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Postgraduate Program ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="Master of Computer Science", description="Name of the program"),
     * @OA\Property(property="program_type", type="string", enum={"Master", "PhD"}, example="Master", description="Type of program"),
     * @OA\Property(property="university_id", type="integer", example=1, description="ID of the university"),
     * @OA\Property(property="faculty_id", type="integer", nullable=true, example=1, description="ID of the faculty"),
     * @OA\Property(property="description", type="string", nullable=true, example="A comprehensive program in computer science", description="Program description"),
     * @OA\Property(property="duration_years", type="string", nullable=true, example="2", description="Duration in years"),
     * @OA\Property(property="funding_info", type="string", nullable=true, example="Scholarships available", description="Funding information"),
     * @OA\Property(property="application_url", type="string", nullable=true, example="https://example.com/apply", description="Application URL"),
     * @OA\Property(property="country", type="string", nullable=true, example="Malaysia", description="Country")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Postgraduate program updated successfully",
     * @OA\JsonContent(ref="#/components/schemas/PostgraduateProgram")
     * ),
     * @OA\Response(
     * response=400,
     * description="Bad request - validation error",
     * @OA\JsonContent(ref="#/components/schemas/Error")
     * ),
     * @OA\Response(
     * response=404,
     * description="Postgraduate Program not found",
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
    public function update(UpdatePostgraduateProgramRequest $request, string $id)
    {
        try {
            $program = PostgraduateProgram::findOrFail($id);
            $updatedProgram = $this->postgraduateProgramService->update($program, $request->validated());
            
            return new PostgraduateProgramResource($updatedProgram);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Postgraduate Program not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while updating the postgraduate program.'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @OA\Delete(
     * path="/api/v1/postgraduate-programs/{id}",
     * operationId="destroyPostgraduateProgram",
     * tags={"Postgraduate Programs"},
     * summary="Delete a postgraduate program",
     * description="Deletes a postgraduate program from the system.",
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Postgraduate Program ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Postgraduate program deleted successfully",
     * @OA\JsonContent(ref="#/components/schemas/Success")
     * ),
     * @OA\Response(
     * response=404,
     * description="Postgraduate Program not found",
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
            $program = PostgraduateProgram::findOrFail($id);
            $this->postgraduateProgramService->delete($program);
            
            return response()->json([
                'message' => 'Postgraduate Program deleted successfully.'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Postgraduate Program not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'An error occurred while deleting the postgraduate program.'
            ], 500);
        }
    }

    /**
     * Preview import data from file.
     * 
     * @OA\Post(
     * path="/api/v1/postgraduate-programs/preview-import",
     * operationId="previewImportPostgraduatePrograms",
     * tags={"Postgraduate Programs"},
     * summary="Preview import data from file",
     * description="Uploads a file and returns preview of the data to be imported.",
     * @OA\RequestBody(
     * required=true,
     * @OA\MediaType(
     * mediaType="multipart/form-data",
     * @OA\Schema(
     * @OA\Property(
     * property="file",
     * type="string",
     * format="binary",
     * description="Excel or CSV file to import"
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Preview data returned successfully",
     * @OA\JsonContent(
     * type="array",
     * @OA\Items(type="object")
     * )
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
     * )
     * )
     */
    public function previewImport(Request $request)
    {
        $request->validate([
            'file' => 'required|extensions:xlsx,csv|max:2048',
        ]);

        $data = Excel::toArray(new PostgraduateProgramsImport, $request->file('file'));

        return response()->json($data[0] ?? []);
    }

    /**
     * Import postgraduate programs from data.
     * 
     * @OA\Post(
     * path="/api/v1/postgraduate-programs/import",
     * operationId="importPostgraduatePrograms",
     * tags={"Postgraduate Programs"},
     * summary="Import postgraduate programs",
     * description="Imports multiple postgraduate programs from provided data.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"programs"},
     * @OA\Property(
     * property="programs",
     * type="array",
     * @OA\Items(
     * required={"name", "program_type", "university_id"},
     * @OA\Property(property="name", type="string", example="Master of Computer Science"),
     * @OA\Property(property="program_type", type="string", enum={"Master", "PhD"}, example="Master"),
     * @OA\Property(property="university_id", type="integer", example=1),
     * @OA\Property(property="faculty_id", type="integer", nullable=true, example=1),
     * @OA\Property(property="description", type="string", nullable=true, example="A comprehensive program"),
     * @OA\Property(property="duration_years", type="string", nullable=true, example="2"),
     * @OA\Property(property="funding_info", type="string", nullable=true, example="Scholarships available"),
     * @OA\Property(property="application_url", type="string", nullable=true, example="https://example.com/apply"),
     * @OA\Property(property="country", type="string", nullable=true, example="Malaysia")
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Postgraduate programs imported successfully",
     * @OA\JsonContent(ref="#/components/schemas/Success")
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
     * )
     * )
     */
    public function import(Request $request)
    {
        $validated = $request->validate([
            'programs' => 'required|array',
            'programs.*.name' => 'required|string',
            'programs.*.program_type' => 'required|string|in:Master,PhD',
            'programs.*.university_id' => 'required|integer|exists:university_list,id',
            'programs.*.faculty_id' => 'nullable|integer|exists:faculty_list,id',
            'programs.*.description' => 'nullable|string',
            'programs.*.duration_years' => 'nullable|string',
            'programs.*.funding_info' => 'nullable|string',
            'programs.*.application_url' => 'nullable|string',
            'programs.*.country' => 'nullable|string',
        ]);

        foreach ($validated['programs'] as $programData) {
            PostgraduateProgram::updateOrCreate(
                [
                    'name' => $programData['name'],
                    'university_id' => $programData['university_id'],
                ],
                [
                    'program_type' => $programData['program_type'] ?? 'Master',
                    'faculty_id' => $programData['faculty_id'] ?? null,
                    'description' => $programData['description'] ?? null,
                    'duration_years' => $programData['duration_years'] ?? null,
                    'funding_info' => $programData['funding_info'] ?? null,
                    'application_url' => $programData['application_url'] ?? null,
                    'country' => $programData['country'] ?? null,
                ]
            );
        }

        return response()->json(['message' => 'Postgraduate Programs imported successfully.']);
    }
}
