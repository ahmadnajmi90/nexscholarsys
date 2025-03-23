<?php

namespace App\Http\Controllers;

use App\Models\CreatePost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\DB;

class CreatePostController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $createPosts = CreatePost::query()
            ->where('author_id', Auth::user()->unique_id) // Ensure only user's posts
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->where('author_id', Auth::user()->unique_id);
            })
            ->paginate(10); // Paginate results with 10 items per page

        return Inertia::render('CreatePosts/Index', [
            'createPosts' => $createPosts,
            'search' => $search, // Pass search query for retaining user input
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
            logger('Store method reached');
            $author = Auth::user();
            $request->merge(['author_id' => $author->unique_id]);

            if ($request->has('tags') && is_string($request->tags)) {
                $decodedTags = json_decode($request->tags, true);
                if (is_array($decodedTags)) {
                    $request->merge(['tags' => $decodedTags]);
                }
            }

            // Validate including images.* rules
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'url' => 'nullable|max:255',
                'content' => 'nullable|string',
                'category' => 'nullable|string|max:255',
                'tags' => 'nullable|array',
                'images' => 'nullable|array',
                'images.*' => 'image|max:2048', // Each image must be less than 2MB
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

            // Process multiple images
            if ($request->hasFile('images')) {
                $imagesPaths = [];
                foreach ($request->file('images') as $image) {
                    logger('Processing image file');
                    $destinationPath = public_path('storage/post_images');
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move($destinationPath, $imageName);
                    $imagesPaths[] = 'post_images/' . $imageName;
                }
                // Store as JSON array (or simply assign $imagesPaths and later json_encode if needed)
                $validated['images'] = json_encode($imagesPaths);
            }

            if ($request->hasFile('featured_image')) {
                logger('Featured Image: Im here ');
                $destinationPath = public_path('storage/post_featured_images');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $featured_image = $request->file('featured_image');
                $featured_imageName = time() . '_' . $featured_image->getClientOriginalName();
                $featured_image->move($destinationPath, $featured_imageName);
                $validated['featured_image'] = 'post_featured_images/' . $featured_imageName;
                logger('Featured Image: Im here ', ['path' => $validated['featured_image']]);
            }

            if ($request->hasFile('attachment')) {
                logger('Attachment: Im here ');
                $destinationPath = public_path('storage/post_attachments');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $attachment = $request->file('attachment');
                $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                $attachment->move($destinationPath, $attachmentName);
                $validated['attachment'] = 'post_attachments/' . $attachmentName;
                logger('Attachment: Im here ', ['path' => $validated['attachment']]);
            }

            logger('Validated Data:', $validated);
            auth()->user()->createPosts()->create($validated);

            return redirect()->route('create-posts.index')->with('success', 'Post created successfully.');
        } catch (ValidationException $e) {
            logger('Validation Errors:', $e->errors());
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function edit($id)
    {
        $post = auth()->user()->createPosts()->findOrFail($id);
        // Render the edit page with the current post data.
        return Inertia::render('CreatePosts/Edit', [
            'auth' => Auth::user(),
            'post' => $post,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            logger('Update method reached');
            $post = auth()->user()->createPosts()->findOrFail($id);
            $author = Auth::user();
            $request->merge(['author_id' => $author->unique_id]);

            // Decode tags if necessary.
            if ($request->has('tags') && is_string($request->tags)) {
                $decodedTags = json_decode($request->tags, true);
                if (is_array($decodedTags)) {
                    $request->merge(['tags' => $decodedTags]);
                }
            }
            logger('Update method reached', $request->all());

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'url' => 'nullable|max:255',
                'content' => 'nullable|string',
                'category' => 'nullable|string|max:255',
                'tags' => 'nullable|array',
                'images' => 'nullable|array',
                'images.*' => 'image|max:2048', // Each image must be less than 2MB
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

            // Handle Images Upload: If new images are uploaded, delete all old images.
            if ($request->hasFile('images')) {
                // Delete all old images
                $existingImages = $post->images ? json_decode($post->images, true) : [];
                foreach ($existingImages as $oldImage) {
                    $oldImagePath = public_path('storage/' . $oldImage);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                // Upload new images
                $newImages = [];
                foreach ($request->file('images') as $image) {
                    $destinationPath = public_path('storage/post_images');
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move($destinationPath, $imageName);
                    $newImages[] = 'post_images/' . $imageName;
                }
                $validated['images'] = json_encode($newImages);
            } else {
                // No new images uploaded, so keep existing images
                $validated['images'] = $post->images;
            }

            // Handle Featured Image Upload (unchanged)
            if ($request->hasFile('featured_image')) {
                logger('Featured Image: Im here');
                if ($post->featured_image) {
                    $oldFeaturedPath = public_path('storage/' . $post->featured_image);
                    if (file_exists($oldFeaturedPath)) {
                        unlink($oldFeaturedPath);
                    }
                }
                $featuredDestination = public_path('storage/post_featured_images');
                if (!file_exists($featuredDestination)) {
                    mkdir($featuredDestination, 0755, true);
                }
                $featured = $request->file('featured_image');
                $featuredName = time() . '_' . $featured->getClientOriginalName();
                $featured->move($featuredDestination, $featuredName);
                $validated['featured_image'] = 'post_featured_images/' . $featuredName;
            } else {
                $validated['featured_image'] = $post->featured_image;
            }

            // Handle Attachment Upload (unchanged)
            if ($request->hasFile('attachment')) {
                logger('Attachment: Im here');
                if ($post->attachment) {
                    $oldAttachmentPath = public_path('storage/' . $post->attachment);
                    if (file_exists($oldAttachmentPath)) {
                        unlink($oldAttachmentPath);
                    }
                }
                $attachmentDestination = public_path('storage/post_attachments');
                if (!file_exists($attachmentDestination)) {
                    mkdir($attachmentDestination, 0755, true);
                }
                $attachment = $request->file('attachment');
                $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                $attachment->move($attachmentDestination, $attachmentName);
                $validated['attachment'] = 'post_attachments/' . $attachmentName;
            } else {
                $validated['attachment'] = $post->attachment;
            }

            logger('Validated Data:', $validated);

            // Update the post record with the validated data.
            $post->update($validated);

            return redirect()->route('create-posts.index')->with('success', 'Post updated successfully.');
        } catch (ValidationException $e) {
            logger('Validation Errors:', $e->errors());
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function destroy($id)
    {
        $createPost = auth()->user()->createPosts()->findOrFail($id);
        $createPost->delete();

        return redirect()->route('create-posts.index')->with('success', 'Post deleted successfully.');
    }

    // public function track(Request $request)
    // {
    //     $validated = $request->validate([
    //         'type' => 'required|string|in:grant,project,event',
    //         'item_id' => 'required|integer',
    //     ]);

    //     // Log the click
    //     DB::table('click_tracking')->insert([
    //         'user_id' => Auth::id(),
    //         'type' => $validated['type'],
    //         'item_id' => $validated['item_id'],
    //         'clicked_at' => now(),
    //     ]);

    //     return response()->json(['success' => true]);
    // }
}
