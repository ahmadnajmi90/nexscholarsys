<?php

namespace App\Http\Controllers;

use App\Models\PostGrant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\DB;
use App\Models\FieldOfResearch;
use App\Models\UniversityList;

class PostGrantController extends Controller
{
    public function index(Request $request)
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $search = $request->input('search');

            $postGrants = PostGrant::query()
                ->where('author_id', Auth::user()->unique_id) // Ensure only user's posts
                ->when($search, function ($query, $search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->where('author_id', Auth::user()->unique_id);
                })
                ->paginate(10); // Paginate results with 10 items per page

            return inertia('PostGrants/Index', [
                'postGrants' => $postGrants,
                'search' => $search,
            ]);
        }
    }

    public function create()
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            return Inertia::render('PostGrants/Create', [
                'auth' => Auth::user(),
            ]);
        }
    }

    public function store(Request $request)
    {
        if(Auth::user()->cannot('post-grants'))
        {
            logger('Unauthorized access'); // Log the reason
            abort(403, 'Unauthorized access.');
        }
        else{
            try {
                logger('Store method reached');
                $author = Auth::user();
                $request->merge(['author_id' => $author->unique_id]);
                if ($request->has('tags') && is_array($request->tags)) {
                    logger('Tags: Im here ');
                    $request->merge([
                        'tags' => json_encode($request->tags),
                    ]);
                }
                
                $validated = $request->validate([
                    'title' => 'required|string|max:255',
                    'description' => 'required|string',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date',
                    'application_deadline' => 'required|date',
                    'grant_type' => 'nullable|string|max:255',
                    'grant_theme' => 'required',
                    'cycle' => 'nullable|string|max:255',
                    'sponsored_by' => 'nullable|string|max:255',
                    'email' => 'nullable|email|max:255',
                    'website' => 'nullable|url|max:255',
                    'country' => 'nullable|string|max:255',
                    'image' => 'nullable|image|max:2048',
                    'attachment' => 'nullable|file|max:5120',
                    'status' => 'nullable',
                ]);

                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    
                    // Define the destination path directly in the public directory
                    $destinationPath = public_path('storage/grant_images');
                    
                    // Ensure the directory exists
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    
                    // Store the uploaded file in the public/storage/event_images folder
                    $image = $request->file('image');
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move($destinationPath, $imageName);
                    
                    // Save the path relative to public/storage
                    $validated['image'] = 'grant_images/' . $imageName;
                    logger('Image: Im here ', ['path' => $validated['image']]);
                }
                
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                    
                    // Define the destination path directly in the public directory
                    $destinationPath = public_path('storage/grant_attachments');
                    
                    // Ensure the directory exists
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    
                    // Store the uploaded file in the public/storage/event_images folder
                    $attachment = $request->file('attachment');
                    $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                    $attachment->move($destinationPath, $attachmentName);
                    
                    // Save the path relative to public/storage
                    $validated['attachment'] = 'grant_attachments/' . $attachmentName;
                    logger('Attachment: Im here ', ['path' => $validated['attachment']]);
                }

                if (isset($validated['grant_theme']) && is_string($validated['grant_theme'])) {
                    $validated['grant_theme'] = json_decode($validated['grant_theme'], true);
                    logger()->info('Grant Theme:', $validated['grant_theme']);
                }
        
                // Log validated data
                logger('Decoded Data:', $validated);
        
                // Save data
                auth()->user()->postGrants()->create($validated);
        
                return redirect()->route('post-grants.index')->with('success', 'Post grant created successfully.');
            } catch (ValidationException $e) {
                // Log validation errors
                logger('Validation Errors:', $e->errors());
        
                // Return back with validation errors
                return redirect()->back()->withErrors($e->errors())->withInput();
            }
        }
    }

    public function edit($id)
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postGrant = auth()->user()->postGrants()->findOrFail($id);
            return Inertia::render('PostGrants/Edit', [
                'postGrant' => $postGrant,
                'auth' => Auth::user(),
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        if (Auth::user()->cannot('post-grants')) {
            abort(403, 'Unauthorized access.');
        }
        else{
            try{
                logger($request->all());
                $postGrant = auth()->user()->postGrants()->findOrFail($id);
                $request->merge([
                    'is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN),
                ]);

                $validated = $request->validate([
                    'title' => 'required|string|max:255',
                    'description' => 'required|string',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date',
                    'application_deadline' => 'required|date',
                    'grant_type' => 'nullable|string|max:255',
                    'grant_theme' => 'required',
                    'cycle' => 'nullable|string|max:255',
                    'sponsored_by' => 'nullable|string|max:255',
                    'email' => 'nullable|email|max:255',
                    'website' => 'nullable|url|max:255',
                    'country' => 'nullable|string|max:255',
                    'status' => 'nullable',

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
                    'attachment' => [
                        'nullable',
                        function ($attribute, $value, $fail) use ($request) {
                            if (is_string($value) && !file_exists(public_path('storage/' . $value))) {
                                $fail('The ' . $attribute . ' field must be an existing file.');
                            } elseif (!is_string($value) && !$request->hasFile($attribute)) {
                                $fail('The ' . $attribute . ' field must be a file.');
                            }
                        },
                    ],
                ]);

                // Handle image upload
                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    
                    // Delete the old image if it exists
                    if ($postGrant->image) {
                        $oldImagePath = public_path('storage/' . $postGrant->image);
                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath); // Delete the old image
                        }
                    }
                
                    // Define the destination path
                    $imageDestination = public_path('storage/grant_images');
                    
                    // Ensure the directory exists
                    if (!file_exists($imageDestination)) {
                        mkdir($imageDestination, 0755, true);
                    }
                    
                    // Save the new image
                    $image = $request->file('image');
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move($imageDestination, $imageName);
                    
                    // Save the relative path
                    $validated['image'] = 'grant_images/' . $imageName;
                } else {
                    // Keep the existing path
                    $validated['image'] = $postGrant->image;
                }
                
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                
                    // Delete the old attachment if it exists
                    if ($postGrant->attachment) {
                        $oldAttachmentPath = public_path('storage/' . $postGrant->attachment);
                        if (file_exists($oldAttachmentPath)) {
                            unlink($oldAttachmentPath); // Delete the old attachment
                        }
                    }
                
                    // Define the destination path
                    $attachmentDestination = public_path('storage/grant_attachments');
                    
                    // Ensure the directory exists
                    if (!file_exists($attachmentDestination)) {
                        mkdir($attachmentDestination, 0755, true);
                    }
                    
                    // Save the new attachment
                    $attachment = $request->file('attachment');
                    $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                    $attachment->move($attachmentDestination, $attachmentName);

                    $validated['attachment'] = 'grant_attachments/' . $attachmentName;
                } else {
                    // Keep the existing path
                    $validated['attachment'] = $postGrant->attachment;
                }

                if (isset($validated['grant_theme']) && is_string($validated['grant_theme'])) {
                    $validated['grant_theme'] = json_decode($validated['grant_theme'], true);
                    logger()->info('grant_theme:', $validated['grant_theme']);
                }

                // Update the post grant
                $postGrant->update($validated);

                return redirect()->route('post-grants.index')->with('success', 'Post grant updated successfully.');
            }catch (ValidationException $e) {
            // Log validation errors
            logger('Validation Errors:', $e->errors());
    
            // Return back with validation errors
            return redirect()->back()->withErrors($e->errors())->withInput();
            }
        }
    }

    public function destroy($id)
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postGrant = auth()->user()->postGrants()->findOrFail($id);
            $postGrant->delete();

            return redirect()->route('post-grants.index')->with('success', 'Post grant deleted successfully.');
        }
    }

    public function track(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:grant,project,event',
            'item_id' => 'required|integer',
        ]);

        // Log the click
        DB::table('click_tracking')->insert([
            'user_id' => Auth::id(),
            'type' => $validated['type'],
            'item_id' => $validated['item_id'],
            'clicked_at' => now(),
        ]);

        return response()->json(['success' => true]);
    }
}
