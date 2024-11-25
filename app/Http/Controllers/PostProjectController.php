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
                    $imagePath = $request->file('image')->store('project_images', 'public');
                    $validated['image'] =  $imagePath;
                    logger('Image: Im here ', ['path' => $imagePath]);
                }
            
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                    $attachmentPath = $request->file('attachment')->store('project_attachments', 'public');
                    $validated['attachment'] = $attachmentPath;
                    logger('Attachment: Im here ', ['path' => $attachmentPath]);
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
                        Storage::disk('public')->delete($postProject->image);
                    }
                
                    // Store the new image
                    $imagePath = $request->file('image')->store('project_images', 'public');
                    $request->merge(['image' => $imagePath]); // Add file path to validated data
                }else {
                    // Keep the existing path
                    $request->merge(['image' => $postProject->image]);
                }

                // // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('attachment: Im here ');
                    // Delete the old attachment if it exists
                    if ($postProject->attachment) {
                        Storage::disk('public')->delete($postProject->attachment);
                    }
                
                    // Store the new attachment
                    $attachmentPath = $request->file('attachment')->store('project_attachments', 'public');
                    $request->merge(['attachment' => $attachmentPath]); // Add file path to validated data
                }else {
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
                    // Delete the old image if it exists
                    if ($postProject->image) {
                        Storage::disk('public')->delete($postProject->image);
                    }
                
                    // Store the new image
                    $imagePath = $request->file('image')->store('project_images', 'public');
                    $validated['image'] =  $imagePath;
                }else {
                    // Keep the existing path
                    $request->merge(['image' => $postProject->image]);
                }

                // // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('attachment: Im here ');
                    // Delete the old attachment if it exists
                    if ($postProject->attachment) {
                        Storage::disk('public')->delete($postProject->attachment);
                    }
                
                    // Store the new attachment
                    $attachmentPath = $request->file('attachment')->store('project_attachments', 'public');
                    $validated['attachment'] =  $attachmentPath;
                }else {
                    // Keep the existing path
                    $request->merge(['attachment' => $postProject->attachment]);
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
