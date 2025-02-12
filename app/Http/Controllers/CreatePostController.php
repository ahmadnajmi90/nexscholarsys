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
            logger('Store method reached', $request->all());

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'url' => 'nullable|url|max:255',
                'content' => 'nullable|string',
                'category' => 'nullable|string|max:255',
                'tags' => 'nullable|array',
                'image' => 'nullable|image|max:2048',
                'featured_image' => 'nullable|image|max:255',
                'attachment' => 'nullable|file|max:2048',
                'status' => 'nullable|string|in:draft,published',
            ]);

            if ($request->hasFile('image')) {
                logger('Image: Im here ');

                // Define the destination path directly in the public directory
                $destinationPath = public_path('storage/post_images');

                // Ensure the directory exists
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                // Store the uploaded file in the public/storage/event_images folder
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move($destinationPath, $imageName);

                // Save the path relative to public/storage
                $validated['image'] = 'post_images/' . $imageName;
                logger('Image: Im here ', ['path' => $validated['image']]);
            }

            if ($request->hasFile('featured_image')) {
                logger('Featured Image: Im here ');

                // Define the destination path directly in the public directory
                $destinationPath = public_path('storage/post_featured_images');

                // Ensure the directory exists
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                // Store the uploaded file in the public/storage/event_images folder
                $featured_image = $request->file('featured_image');
                $featured_imageName = time() . '_' . $featured_image->getClientOriginalName();
                $featured_image->move($destinationPath, $featured_imageName);

                // Save the path relative to public/storage
                $validated['featured_image'] = 'post_featured_images/' . $featured_imageName;
                logger('Featured Image: Im here ', ['path' => $validated['featured_image']]);
            }

            // Handle attachment upload
            if ($request->hasFile('attachment')) {
                logger('Attachment: Im here ');

                // Define the destination path directly in the public directory
                $destinationPath = public_path('storage/post_attachments');

                // Ensure the directory exists
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                // Store the uploaded file in the public/storage/event_images folder
                $attachment = $request->file('attachment');
                $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                $attachment->move($destinationPath, $attachmentName);

                // Save the path relative to public/storage
                $validated['attachment'] = 'post_attachments/' . $attachmentName;
                logger('Attachment: Im here ', ['path' => $validated['attachment']]);
            }

            // Log validated data
            logger('Validated Data:', $validated);

            // Save data
            auth()->user()->createPosts()->create($validated);

            return redirect()->route('create-posts.index')->with('success', 'Post created successfully.');
        } catch (ValidationException $e) {
            // Log validation errors
            logger('Validation Errors:', $e->errors());

            // Return back with validation errors
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

            // Decode tags if they are sent as a JSON string.
            if ($request->has('tags') && is_string($request->tags)) {
                $decodedTags = json_decode($request->tags, true);
                if (is_array($decodedTags)) {
                    $request->merge(['tags' => $decodedTags]);
                }
            }
            logger('Update method reached', $request->all());

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'url' => 'nullable|url|max:255',
                'content' => 'nullable|string',
                'category' => 'nullable|string|max:255',
                'tags' => 'nullable|array',
                'image' => [
                    'nullable',
                    function ($attribute, $value, $fail) use ($request) {
                        if (is_string($value) && !file_exists(public_path('storage/' . $value))) {
                            $fail('The ' . $attribute . ' field must be an existing file.');
                        } elseif (!is_string($value) && !$request->hasFile($attribute)) {
                            $fail('The ' . $attribute . ' field must be an image.');
                        }
                    },
                ],
                'featured_image' => [
                    'nullable',
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
                    function ($attribute, $value, $fail) use ($request) {
                        if (is_string($value) && !file_exists(public_path('storage/' . $value))) {
                            $fail('The ' . $attribute . ' field must be an existing file.');
                        } elseif (!is_string($value) && !$request->hasFile($attribute)) {
                            $fail('The ' . $attribute . ' field must be a valid file.');
                        }
                    },
                ],
                'status' => 'nullable|string|in:draft,published',
            ]);

            // Handle Image Upload
            if ($request->hasFile('image')) {
                logger('Image: Im here');
                // Delete the old image if it exists
                if ($post->image) {
                    $oldImagePath = public_path('storage/' . $post->image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                $imageDestination = public_path('storage/event_images');
                if (!file_exists($imageDestination)) {
                    mkdir($imageDestination, 0755, true);
                }
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move($imageDestination, $imageName);
                $validated['image'] = 'event_images/' . $imageName;
            } else {
                // Keep the existing path
                $validated['image'] = $post->image;
            }

            // Handle Featured Image Upload
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

            // Handle Attachment Upload
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
