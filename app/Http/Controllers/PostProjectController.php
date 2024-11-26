<?php

namespace App\Http\Controllers;

use App\Models\PostProject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\DB;

class PostProjectController extends Controller
{
    public function index(Request $request)
    {
        if(Auth::user()->cannot('post-projects'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $search = $request->input('search');

            $postProjects = PostProject::query()
            ->where('author_id', Auth::user()->unique_id) // Ensure only user's posts
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->paginate(10); // Paginate results with 10 items per page

            return inertia('PostProjects/Index', [
                'postProjects' => $postProjects,
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
                'search' => $search,
            ]);
        }
    }

    public function create()
    {
        if(Auth::user()->cannot('post-projects'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            return Inertia::render('PostProjects/Create', [
                'auth' => Auth::user(),
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
            ]);
        }   
    }

    public function store(Request $request)
    {
        if(Auth::user()->cannot('post-projects'))
        {
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
                    'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
                    'project_type' => 'required',
                    'purpose' => 'required',
                    'start_date' => 'nullable|date',
                    'end_date' => 'nullable|date',
                    'tags' => 'nullable|json',
                    'email' => 'nullable|email|max:255',
                    'contact_number' => 'nullable|string|max:255',
                    'location' => 'nullable|string|max:255',
                    'budget' => 'nullable|numeric|min:0',
                    'is_featured' => 'boolean',
                    'attachment' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
                ]);

                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    
                    // Define the destination path directly in the public directory
                    $destinationPath = public_path('storage/project_images');
                    
                    // Ensure the directory exists
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    
                    // Store the uploaded file in the public/storage/event_images folder
                    $image = $request->file('image');
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move($destinationPath, $imageName);
                    
                    // Save the path relative to public/storage
                    $validated['image'] = 'project_images/' . $imageName;
                    logger('Image: Im here ', ['path' => $validated['image']]);
                }
                
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                    
                    // Define the destination path directly in the public directory
                    $destinationPath = public_path('storage/project_attachments');
                    
                    // Ensure the directory exists
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    
                    // Store the uploaded file in the public/storage/event_images folder
                    $attachment = $request->file('attachment');
                    $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                    $attachment->move($destinationPath, $attachmentName);
                    
                    // Save the path relative to public/storage
                    $validated['attachment'] = 'project_attachments/' . $attachmentName;
                    logger('Attachment: Im here ', ['path' => $validated['attachment']]);
                }
                // Log validated data
                logger('Validated Data:', $validated);

                auth()->user()->postProjects()->create($validated);

                return redirect()->route('post-projects.index')->with('success', 'Project project successfully.');
        
            } catch (ValidationException $e) {
                logger('Validation Errors:', $e->errors());
                // Return back with validation errors
                return redirect()->back()->withErrors($e->errors())->withInput();
            }
        }
    }

    public function edit($id)
    {
        if(Auth::user()->cannot('post-projects'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postProject = auth()->user()->postProjects()->findOrFail($id);
            return Inertia::render('PostProjects/Edit', [
                'postProject' => $postProject,
                'auth' => Auth::user(),
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        if(Auth::user()->cannot('post-projects'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            try{
                $user = Auth::user();
                logger($request->all());
                $postProject = auth()->user()->postProjects()->findOrFail($id);
                $request->merge([
                    'is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN),
                ]);
                
                // Handle image upload
                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    
                    // Delete the old image if it exists
                    if ($postProject->image) {
                        $oldImagePath = public_path('storage/' . $postProject->image);
                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath); // Delete the old image
                        }
                    }
                
                    // Define the destination path
                    $imageDestination = public_path('storage/project_images');
                    
                    // Ensure the directory exists
                    if (!file_exists($imageDestination)) {
                        mkdir($imageDestination, 0755, true);
                    }
                    
                    // Save the new image
                    $image = $request->file('image');
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move($imageDestination, $imageName);
                    
                    // Save the relative path
                    $request->merge(['image' => 'project_images/' . $imageName]);
                } else {
                    // Keep the existing path
                    $request->merge(['image' => $postProject->image]);
                }
                
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                
                    // Delete the old attachment if it exists
                    if ($postProject->attachment) {
                        $oldAttachmentPath = public_path('storage/' . $postProject->attachment);
                        if (file_exists($oldAttachmentPath)) {
                            unlink($oldAttachmentPath); // Delete the old attachment
                        }
                    }
                
                    // Define the destination path
                    $attachmentDestination = public_path('storage/project_attachments');
                    
                    // Ensure the directory exists
                    if (!file_exists($attachmentDestination)) {
                        mkdir($attachmentDestination, 0755, true);
                    }
                    
                    // Save the new attachment
                    $attachment = $request->file('attachment');
                    $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                    $attachment->move($attachmentDestination, $attachmentName);
                    
                    // Save the relative path
                    $request->merge(['attachment' => 'project_attachments/' . $attachmentName]);
                } else {
                    // Keep the existing path
                    $request->merge(['attachment' => $postProject->attachment]);
                }

                $validated = $request->validate([
                    'title' => 'required|string|max:255',
                    'description' => 'required|string',
                    'image' => 'nullable',
                    'project_type' => 'required',
                    'purpose' => 'required',
                    'start_date' => 'nullable|date',
                    'end_date' => 'nullable|date',
                    'tags' => 'nullable',
                    'email' => 'nullable|email|max:255',
                    'contact_number' => 'nullable|string|max:255',
                    'location' => 'nullable|string|max:255',
                    'budget' => 'nullable|numeric|min:0',
                    'is_featured' => 'boolean',
                    'attachment' => 'nullable',
                ]);

                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    // Save the relative path
                    $validated['image'] = 'project_images/' . $imageName;
                } else {
                    // Keep the existing path
                    $validated['image'] = $postProject->image;
                }
                
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                    // Save the relative path
                    $validated['attachment'] = 'project_attachments/' . $attachmentName;
                } else {
                    // Keep the existing path
                    $validated['attachment'] = $postProject->attachment;
                }

                // Handle tags
                if ($request->has('tags') && is_array($request->tags)) {
                    $validated['tags'] = json_encode($request->tags);
                }

                logger('Validated Data:', $validated);

                // Update the post grant
                $postProject->update($validated);

                return redirect()->route('post-projects.index')->with('success', 'Post project updated successfully.');
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
        if(Auth::user()->cannot('post-projects'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postProject = auth()->user()->postProjects()->findOrFail($id);
            $postProject->delete();

            return redirect()->route('post-projects.index')->with('success', 'Post projects deleted successfully.');
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
