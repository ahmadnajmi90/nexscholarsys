<?php

namespace App\Http\Controllers\ContentManagement;

use App\Http\Controllers\Controller;
use App\Models\CreatePost;
use App\Services\CreatePostService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CreatePostController extends Controller
{
    protected $createPostService;

    public function __construct(CreatePostService $createPostService)
    {
        $this->createPostService = $createPostService;
    }

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

        return Inertia::render('CreatePosts/Index', [
            'createPosts' => $createPosts,
            'search' => $search,
        ]);
    }

    public function create()
    {
        return Inertia::render('CreatePosts/Create', [
            'auth' => Auth::user(),
        ]);
    }

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

            $this->createPostService->createPost($validated);

            return redirect()->route('create-posts.index')->with('success', 'Post created successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function edit($id)
    {
        $post = auth()->user()->createPosts()->findOrFail($id);
        return Inertia::render('CreatePosts/Edit', [
            'auth' => Auth::user(),
            'post' => $post,
        ]);
    }

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

            $this->createPostService->updatePost($post, $validated);

            return redirect()->route('create-posts.index')->with('success', 'Post updated successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function destroy($id)
    {
        $createPost = auth()->user()->createPosts()->findOrFail($id);
        $this->createPostService->deletePost($createPost);

        return redirect()->route('create-posts.index')->with('success', 'Post deleted successfully.');
    }
} 