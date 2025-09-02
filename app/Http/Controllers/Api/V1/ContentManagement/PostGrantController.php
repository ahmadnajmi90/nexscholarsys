<?php

namespace App\Http\Controllers\Api\V1\ContentManagement;

use App\Http\Controllers\Controller;
use App\Models\PostGrant;
use App\Services\FundingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\PostGrantResource;

/**
 * @OA\Tag(
 *     name="Content Management - Grants",
 *     description="API endpoints for managing grants"
 * )
 */
class PostGrantController extends Controller
{
    protected $fundingService;

    public function __construct(FundingService $fundingService)
    {
        $this->fundingService = $fundingService;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/grants",
     *     summary="Get all grants for the authenticated user",
     *     tags={"Content Management - Grants"},
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
     *         description="List of grants",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Grant")),
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

        $postGrants = PostGrant::query()
            ->where('author_id', Auth::user()->unique_id)
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->where('author_id', Auth::user()->unique_id);
            })
            ->paginate(10);

        return PostGrantResource::collection($postGrants);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/grants/{id}",
     *     summary="Get a specific grant",
     *     tags={"Content Management - Grants"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Grant ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Grant details",
     *         @OA\JsonContent(ref="#/components/schemas/Grant")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Grant not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function show($id)
    {
        $grant = auth()->user()->postGrants()->findOrFail($id);
        return new PostGrantResource($grant);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/grants",
     *     summary="Create a new grant",
     *     tags={"Content Management - Grants"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","description","start_date","end_date","application_deadline","grant_type","grant_theme","cycle","sponsored_by","email","country"},
     *             @OA\Property(property="title", type="string", example="Research Grant 2024"),
     *             @OA\Property(property="description", type="string", example="Funding opportunity for innovative research projects"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2024-01-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2024-12-31"),
     *             @OA\Property(property="application_deadline", type="string", format="date", example="2023-11-30"),
     *             @OA\Property(property="grant_type", type="string", example="Research Grant"),
     *             @OA\Property(property="grant_theme", type="array", @OA\Items(type="string"), example={"Science & Technology", "Social Science"}),
     *             @OA\Property(property="cycle", type="string", example="Annual"),
     *             @OA\Property(property="sponsored_by", type="string", example="National Science Foundation"),
     *             @OA\Property(property="email", type="string", format="email", example="contact@foundation.org"),
     *             @OA\Property(property="website", type="string", format="uri", example="https://foundation.org/grants"),
     *             @OA\Property(property="country", type="string", example="United States"),
     *             @OA\Property(property="status", type="string", enum={"draft","published"}, example="published")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Grant created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Grant")
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
                'grant_type' => 'required|string|max:255',
                'grant_theme' => 'required',
                'cycle' => 'required|string|max:255',
                'sponsored_by' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'website' => 'nullable|url|max:255',
                'country' => 'required|string|max:255',
                'image' => 'nullable|image|max:2048',
                'attachment' => 'nullable|file|max:5120',
                'status' => 'nullable',
            ]);

            $grant = $this->fundingService->createGrant($validated);

            return new PostGrantResource($grant);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/v1/grants/{id}",
     *     summary="Update an existing grant",
     *     tags={"Content Management - Grants"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Grant ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","description","start_date","end_date","application_deadline","grant_type","grant_theme","cycle","sponsored_by","email"},
     *             @OA\Property(property="title", type="string", example="Updated Research Grant 2024"),
     *             @OA\Property(property="description", type="string", example="Updated funding opportunity for innovative research projects"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2024-01-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2024-12-31"),
     *             @OA\Property(property="application_deadline", type="string", format="date", example="2023-11-30"),
     *             @OA\Property(property="grant_type", type="string", example="Research Grant"),
     *             @OA\Property(property="grant_theme", type="array", @OA\Items(type="string"), example={"Science & Technology", "Social Science"}),
     *             @OA\Property(property="cycle", type="string", example="Annual"),
     *             @OA\Property(property="sponsored_by", type="string", example="National Science Foundation"),
     *             @OA\Property(property="email", type="string", format="email", example="contact@foundation.org"),
     *             @OA\Property(property="website", type="string", format="uri", example="https://foundation.org/grants"),
     *             @OA\Property(property="country", type="string", example="United States"),
     *             @OA\Property(property="status", type="string", enum={"draft","published"}, example="published")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Grant updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Grant")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Grant not found"
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
            $postGrant = auth()->user()->postGrants()->findOrFail($id);
            $request->merge(['is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN)]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'application_deadline' => 'required|date',
                'grant_type' => 'required|string|max:255',
                'grant_theme' => 'required',
                'cycle' => 'required|string|max:255',
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

            $updatedGrant = $this->fundingService->updateGrant($postGrant, $validated);

            return new PostGrantResource($updatedGrant);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/grants/{id}",
     *     summary="Delete a grant",
     *     tags={"Content Management - Grants"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Grant ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Grant deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Grant deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Grant not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function destroy($id)
    {
        $postGrant = auth()->user()->postGrants()->findOrFail($id);
        $this->fundingService->deleteGrant($postGrant);

        return response()->json([
            'message' => 'Grant deleted successfully'
        ]);
    }
} 