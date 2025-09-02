<?php

namespace App\Http\Controllers\Api\V1\ContentManagement;

use App\Http\Controllers\Controller;
use App\Models\PostScholarship;
use App\Services\FundingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\PostScholarshipResource;

/**
 * @OA\Tag(
 *     name="Content Management - Scholarships",
 *     description="API endpoints for managing scholarships"
 * )
 */
class PostScholarshipController extends Controller
{
    protected $fundingService;

    public function __construct(FundingService $fundingService)
    {
        $this->fundingService = $fundingService;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/scholarships",
     *     summary="Get all scholarships for the authenticated user",
     *     tags={"Content Management - Scholarships"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search term for title or description",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number for pagination",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of scholarships",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Scholarship")),
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="last_page", type="integer"),
     *             @OA\Property(property="per_page", type="integer"),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $postScholarships = PostScholarship::query()
            ->where('author_id', Auth::user()->unique_id)
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->where('author_id', Auth::user()->unique_id);
            })
            ->paginate(10);

        return PostScholarshipResource::collection($postScholarships);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/scholarships/{id}",
     *     summary="Get a specific scholarship",
     *     tags={"Content Management - Scholarships"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Scholarship ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Scholarship details",
     *         @OA\JsonContent(ref="#/components/schemas/Scholarship")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Scholarship not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function show($id)
    {
        $scholarship = auth()->user()->postScholarships()->findOrFail($id);
        return new PostScholarshipResource($scholarship);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/scholarships",
     *     summary="Create a new scholarship",
     *     tags={"Content Management - Scholarships"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","description","start_date","end_date","application_deadline","scholarship_type","scholarship_theme","sponsored_by","email","country"},
     *             @OA\Property(property="title", type="string", example="Research Scholarship 2024"),
     *             @OA\Property(property="description", type="string", example="Funding opportunity for innovative research projects"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2024-01-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2024-12-31"),
     *             @OA\Property(property="application_deadline", type="string", format="date", example="2023-11-30"),
     *             @OA\Property(property="scholarship_type", type="string", example="Research Scholarship"),
     *             @OA\Property(property="scholarship_theme", type="array", @OA\Items(type="string"), example={"Science & Technology", "Social Science"}),
     *             @OA\Property(property="sponsored_by", type="string", example="National Science Foundation"),
     *             @OA\Property(property="email", type="string", format="email", example="contact@foundation.org"),
     *             @OA\Property(property="website", type="string", format="uri", example="https://foundation.org/scholarships"),
     *             @OA\Property(property="country", type="string", example="United States"),
     *             @OA\Property(property="status", type="string", enum={"draft","published"}, example="published")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Scholarship created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Scholarship")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $author = Auth::user();
            $request->merge(['author_id' => $author->unique_id]);

            if ($request->has('tags') && is_array($request->tags)) {
                $request->merge(['tags' => json_encode($request->tags)]);
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'application_deadline' => 'required|date',
                'scholarship_type' => 'required|string|max:255',
                'scholarship_theme' => 'required',
                'sponsored_by' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'website' => 'nullable|url|max:255',
                'country' => 'required|string|max:255',
                'image' => 'nullable|image|max:2048',
                'attachment' => 'nullable|file|max:5120',
                'status' => 'nullable',
            ]);

            $scholarship = $this->fundingService->createScholarship($validated);

            return new PostScholarshipResource($scholarship);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/v1/scholarships/{id}",
     *     summary="Update an existing scholarship",
     *     tags={"Content Management - Scholarships"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Scholarship ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","description","start_date","end_date","application_deadline","scholarship_type","scholarship_theme","sponsored_by","email"},
     *             @OA\Property(property="title", type="string", example="Updated Research Scholarship 2024"),
     *             @OA\Property(property="description", type="string", example="Updated funding opportunity for innovative research projects"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2024-01-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2024-12-31"),
     *             @OA\Property(property="application_deadline", type="string", format="date", example="2023-11-30"),
     *             @OA\Property(property="scholarship_type", type="string", example="Research Scholarship"),
     *             @OA\Property(property="scholarship_theme", type="array", @OA\Items(type="string"), example={"Science & Technology", "Social Science"}),
     *             @OA\Property(property="sponsored_by", type="string", example="National Science Foundation"),
     *             @OA\Property(property="email", type="string", format="email", example="contact@foundation.org"),
     *             @OA\Property(property="website", type="string", format="uri", example="https://foundation.org/scholarships"),
     *             @OA\Property(property="country", type="string", example="United States"),
     *             @OA\Property(property="status", type="string", enum={"draft","published"}, example="published")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Scholarship updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Scholarship")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Scholarship not found"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $postScholarship = auth()->user()->postScholarships()->findOrFail($id);
            $request->merge(['is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN)]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'application_deadline' => 'required|date',
                'scholarship_type' => 'required|string|max:255',
                'scholarship_theme' => 'required',
                'sponsored_by' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'website' => 'nullable|url|max:255',
                'country' => 'nullable|string|max:255',
                'status' => 'nullable',
                'image' => [
                    'nullable',
                    'max:2048',
                    function ($attribute, $value, $fail) use ($request) {
                        if (is_string($value) && !file_exists(public_path('storage/' . $value))) {
                            $fail('The ' . $attribute . ' field must be an existing file.');
                        } elseif (!is_string($value) && !$request->hasFile($attribute)) {
                            $fail('The ' . $attribute . ' field must be an image.');
                        }
                    },
                ],
                'attachment' => [
                    'nullable',
                    'max:5120',
                    function ($attribute, $value, $fail) use ($request) {
                        if (is_string($value) && !file_exists(public_path('storage/' . $value))) {
                            $fail('The ' . $attribute . ' field must be an existing file.');
                        } elseif (!is_string($value) && !$request->hasFile($attribute)) {
                            $fail('The ' . $attribute . ' field must be a file.');
                        }
                    },
                ],
            ]);

            $updatedScholarship = $this->fundingService->updateScholarship($postScholarship, $validated);

            return new PostScholarshipResource($updatedScholarship);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/scholarships/{id}",
     *     summary="Delete a scholarship",
     *     tags={"Content Management - Scholarships"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Scholarship ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Scholarship deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Scholarship deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Scholarship not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function destroy($id)
    {
        $postScholarship = auth()->user()->postScholarships()->findOrFail($id);
        $this->fundingService->deleteScholarship($postScholarship);

        return response()->json([
            'message' => 'Scholarship deleted successfully'
        ]);
    }
}
