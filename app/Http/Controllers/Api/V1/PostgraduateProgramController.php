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
use ReflectionClass;

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
     * description="Uploads a file and returns preview of the cleaned and enriched data to be imported, including information about skipped rows.",
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
     * @OA\Property(property="processed_rows", type="array", description="Successfully processed rows with original and cleaned data",
     *     @OA\Items(
     *         @OA\Property(property="original", type="object", description="Original row data from file"),
     *         @OA\Property(property="processed", type="object", description="Cleaned and enriched data"),
     *         @OA\Property(property="changes", type="object", description="Changes made during processing")
     *     )
     * ),
     * @OA\Property(property="skipped_rows", type="array", description="Rows that were skipped during processing",
     *     @OA\Items(
     *         @OA\Property(property="row", type="object", description="Original row data"),
     *         @OA\Property(property="reason", type="string", description="Reason why the row was skipped")
     *     )
     * ),
     * @OA\Property(property="summary", type="object",
     *     @OA\Property(property="total_rows", type="integer", description="Total rows in file"),
     *     @OA\Property(property="processed_count", type="integer", description="Successfully processed rows"),
     *     @OA\Property(property="skipped_count", type="integer", description="Skipped rows")
     * )
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

        try {
            // Get raw data first to count total rows
            $rawData = Excel::toArray([], $request->file('file'));
            $totalRows = count($rawData[0] ?? []);

            // Process data using the import class
            $import = new PostgraduateProgramsImport();
            Excel::import($import, $request->file('file'));

            $processedRows = $import->getProcessedRows();
            $skippedRows = $import->getSkippedRows();

            // Return the cleaned and enriched data as an array for frontend compatibility
            // Include additional metadata in headers for future frontend enhancements
            $previewArray = array_map(function($processedRow) {
                return $processedRow['processed'];
            }, $processedRows);

            return response()->json($previewArray, 200, [
                'X-Total-Rows' => $totalRows,
                'X-Processed-Count' => count($processedRows),
                'X-Skipped-Count' => count($skippedRows),
                'X-Import-Metadata' => json_encode([
                    'processed_rows' => $processedRows,
                    'skipped_rows' => $skippedRows,
                    'summary' => [
                        'total_rows' => $totalRows,
                        'processed_count' => count($processedRows),
                        'skipped_count' => count($skippedRows),
                    ]
                ])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to process import file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import postgraduate programs from file or data.
     *
     * @OA\Post(
     * path="/api/v1/postgraduate-programs/import",
     * operationId="importPostgraduatePrograms",
     * tags={"Postgraduate Programs"},
     * summary="Import postgraduate programs from file or data",
     * description="Imports postgraduate programs from an Excel/CSV file or JSON data with automatic data cleaning, enrichment, and validation.",
     * @OA\RequestBody(
     * required=true,
     * @OA\OneOf({
     *     @OA\Schema(
     *         @OA\Property(property="file", type="string", format="binary", description="Excel or CSV file to import")
     *     ),
     *     @OA\Schema(
     *         @OA\Property(property="programs", type="array", description="Array of program data to import",
     *             @OA\Items(
     *                 @OA\Property(property="name", type="string", example="Master of Computer Science"),
     *                 @OA\Property(property="program_type", type="string", enum={"Master", "PhD"}, example="Master"),
     *                 @OA\Property(property="university_id", type="integer", example=1),
     *                 @OA\Property(property="faculty_id", type="integer", nullable=true, example=1),
     *                 @OA\Property(property="description", type="string", nullable=true, example="A comprehensive program"),
     *                 @OA\Property(property="duration_years", type="string", nullable=true, example="2 years"),
     *                 @OA\Property(property="funding_info", type="string", nullable=true, example="Scholarships available"),
     *                 @OA\Property(property="application_url", type="string", nullable=true, example="https://example.com/apply"),
     *                 @OA\Property(property="country", type="string", nullable=true, example="Malaysia")
     *             )
     *         )
     *     )
     * })
     * ),
     * @OA\Response(
     * response=200,
     * description="Postgraduate programs imported successfully",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Postgraduate programs imported successfully"),
     * @OA\Property(property="processed_count", type="integer", description="Number of successfully processed rows"),
     * @OA\Property(property="skipped_count", type="integer", description="Number of skipped rows"),
     * @OA\Property(property="skipped_rows", type="array", description="Details of skipped rows",
     *     @OA\Items(
     *         @OA\Property(property="row", type="object", description="Original row data"),
     *         @OA\Property(property="reason", type="string", description="Reason why the row was skipped")
     *     )
     * )
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
    public function import(Request $request)
    {
        // Check if file upload or JSON data import
        if ($request->hasFile('file')) {
            // File upload validation
            $request->validate([
                'file' => 'required|extensions:xlsx,csv|max:2048',
            ]);

            try {
                // Process the file using the import class
                $import = new PostgraduateProgramsImport();
                Excel::import($import, $request->file('file'));

                $processedCount = count($import->getProcessedRows());
                $skippedRows = $import->getSkippedRows();
                $skippedCount = count($skippedRows);

                return response()->json([
                    'message' => 'Postgraduate programs imported successfully.',
                    'processed_count' => $processedCount,
                    'skipped_count' => $skippedCount,
                    'skipped_rows' => $skippedRows,
                ]);

            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Failed to import postgraduate programs: ' . $e->getMessage()
                ], 500);
            }
        } elseif ($request->has('programs')) {
            // JSON data validation and import
            $validated = $request->validate([
                'programs' => 'required|array|min:1',
                'programs.*.name' => 'required|string|max:255',
                'programs.*.program_type' => 'nullable|string|in:Master,PhD',
                'programs.*.university_id' => 'nullable|integer|exists:university_list,id',
                'programs.*.faculty_id' => 'nullable|integer|exists:faculty_list,id',
                'programs.*.description' => 'nullable|string',
                'programs.*.duration_years' => 'nullable|string',
                'programs.*.funding_info' => 'nullable|string',
                'programs.*.application_url' => 'nullable|url',
                'programs.*.country' => 'nullable|string|max:100',
            ]);

            try {
                $imported = 0;
                $errors = [];

                foreach ($validated['programs'] as $index => $programData) {
                    try {
                        // Apply the same cleaning and enrichment logic as the import class
                        $import = new PostgraduateProgramsImport();
                        $reflection = new \ReflectionClass($import);

                        // Clean and enrich the data using the same methods
                        $programType = $reflection->getMethod('determineProgramType')
                            ->invoke($import, $programData['name'], $programData['program_type'] ?? null);

                        if (!$programType) {
                            $errors[] = ['row' => $index + 1, 'reason' => 'Unable to determine program type'];
                            continue;
                        }

                        $universityId = $reflection->getMethod('resolveUniversityId')
                            ->invoke($import, $programData['university_id'] ?? null);

                        if (!$universityId) {
                            $errors[] = ['row' => $index + 1, 'reason' => 'Unable to resolve university'];
                            continue;
                        }

                        $facultyId = $reflection->getMethod('resolveFacultyId')
                            ->invoke($import, $programData['faculty_id'] ?? null, $universityId);

                        $country = $reflection->getMethod('deriveCountryFromUniversity')
                            ->invoke($import, $universityId);

                        $description = $reflection->getMethod('cleanDescription')
                            ->invoke($import, $programData['description'] ?? null);

                        $durationYears = $reflection->getMethod('cleanDurationYears')
                            ->invoke($import, $programData['duration_years'] ?? null);

                        $fundingInfo = $reflection->getMethod('setDefaultFundingInfo')
                            ->invoke($import, $programData['funding_info'] ?? null);

                        // Create the program
                        PostgraduateProgram::updateOrCreate(
                            [
                                'name' => trim($programData['name']),
                                'university_id' => $universityId,
                            ],
                            [
                                'program_type' => $programType,
                                'faculty_id' => $facultyId,
                                'description' => $description,
                                'duration_years' => $durationYears,
                                'funding_info' => $fundingInfo,
                                'application_url' => $programData['application_url'] ?? null,
                                'country' => $country,
                            ]
                        );

                        $imported++;

                    } catch (\Exception $e) {
                        $errors[] = ['row' => $index + 1, 'reason' => 'Processing error: ' . $e->getMessage()];
                    }
                }

                return response()->json([
                    'message' => 'Postgraduate programs imported successfully.',
                    'processed_count' => $imported,
                    'skipped_count' => count($errors),
                    'skipped_rows' => $errors,
                ]);

            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Failed to import postgraduate programs: ' . $e->getMessage()
                ], 500);
            }
        } else {
            return response()->json([
                'error' => 'Either a file upload or programs data is required.'
            ], 400);
        }
    }
}
