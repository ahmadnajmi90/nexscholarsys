<?php

namespace App\Http\Controllers\Api\V1\ContentManagement;

use App\Http\Controllers\Controller;
use App\Models\CreatePost;
use App\Services\CreatePostService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\CreatePostResource;

/**
 * @OA\Tag(
 *     name="Content Management - Posts",
 *     description="API endpoints for managing posts"
 * )
 */
class CreatePostController extends Controller
{
    protected $createPostService;

    public function __construct(CreatePostService $createPostService)
    {
        $this->createPostService = $createPostService;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/posts",
     *     summary="Get all posts for the authenticated user",
     *     tags={"Content Management - Posts"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search term for title or content",
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
     *         description="List of posts",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Post")),
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

        $createPosts = CreatePost::query()
            ->where('author_id', Auth::user()->unique_id)
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->where('author_id', Auth::user()->unique_id);
            })
            ->paginate(10);

        return CreatePostResource::collection($createPosts);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/posts/{id}",
     *     summary="Get a specific post",
     *     tags={"Content Management - Posts"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Post ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post details",
     *         @OA\JsonContent(ref="#/components/schemas/Post")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function show($id)
    {
        $post = auth()->user()->createPosts()->findOrFail($id);
        return new CreatePostResource($post);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/posts",
     *     summary="Create a new post",
     *     tags={"Content Management - Posts"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","content","category"},
     *             @OA\Property(property="title", type="string", example="My Post Title"),
     *             @OA\Property(property="content", type="string", example="This is the post content"),
     *             @OA\Property(property="category", type="string", example="Research"),
     *             @OA\Property(property="url", type="string", example="my-post-url"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="status", type="string", enum={"draft","published"}, example="published")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Post created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Post")
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

            if ($request->has('tags') && is_string($request->tags)) {
                $decodedTags = json_decode($request->tags, true);
                if (is_array($decodedTags)) {
                    $request->merge(['tags' => $decodedTags]);
                }
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'url' => 'nullable|max:255',
                'content' => 'required|string',
                'category' => 'required|string|max:255',
                'tags' => 'nullable|array',
                'images' => 'nullable|array',
                'images.*' => 'image|max:2048',
                'featured_image' => 'nullable|image|max:2048',
                'attachment' => 'nullable|file|max:5120',
                'status' => 'nullable|string|in:draft,published',
            ], [
                'images.*.max' => 'Each image must not be greater than 2MB (2048 kilobytes).',
                'images.*.image' => 'Each file must be a valid image.',
                'featured_image.max' => 'The featured image must not be greater than 2MB (2048 kilobytes).',
                'featured_image.image' => 'The featured image must be a valid image file.',
                'attachment.max' => 'The attachment must not be greater than 5MB (5120 kilobytes).',
            ]);

            $post = $this->createPostService->createPost($validated);

            return new CreatePostResource($post);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/v1/posts/{id}",
     *     summary="Update an existing post",
     *     tags={"Content Management - Posts"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Post ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","content","category"},
     *             @OA\Property(property="title", type="string", example="Updated Post Title"),
     *             @OA\Property(property="content", type="string", example="Updated post content"),
     *             @OA\Property(property="category", type="string", example="Research"),
     *             @OA\Property(property="url", type="string", example="updated-post-url"),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="string")),
     *             @OA\Property(property="status", type="string", enum={"draft","published"}, example="published")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Post")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found"
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
            $post = auth()->user()->createPosts()->findOrFail($id);
            $author = Auth::user();
            $request->merge(['author_id' => $author->unique_id]);

            if ($request->has('tags') && is_string($request->tags)) {
                $decodedTags = json_decode($request->tags, true);
                if (is_array($decodedTags)) {
                    $request->merge(['tags' => $decodedTags]);
                }
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'url' => 'nullable|max:255',
                'content' => 'required|string',
                'category' => 'required|string|max:255',
                'tags' => 'nullable|array',
                'images' => 'nullable|array',
                'images.*' => 'image|max:2048',
                'featured_image' => [
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
                            $fail('The ' . $attribute . ' field must be a valid file.');
                        }
                    },
                ],
                'status' => 'nullable|string|in:draft,published',
            ], [
                'images.*.max' => 'Each image must not be greater than 2MB (2048 kilobytes).',
                'images.*.image' => 'Each file must be a valid image.',
                'featured_image.max' => 'The featured image must not be greater than 2MB (2048 kilobytes).',
                'featured_image.image' => 'The featured image must be a valid image file.',
                'attachment.max' => 'The attachment must not be greater than 5MB (5120 kilobytes).',
            ]);

            $updatedPost = $this->createPostService->updatePost($post, $validated);

            return new CreatePostResource($updatedPost);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/posts/{id}",
     *     summary="Delete a post",
     *     tags={"Content Management - Posts"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Post ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Post deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function destroy($id)
    {
        $createPost = auth()->user()->createPosts()->findOrFail($id);
        $this->createPostService->deletePost($createPost);

        return response()->json([
            'message' => 'Post deleted successfully'
        ]);
    }
} 