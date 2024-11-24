<?php

namespace App\Http\Controllers;

use App\Models\PostProject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class PostProjectController extends Controller
{
    public function index()
    {
        $postProjects = auth()->user()->postProjects; // Assuming a relationship in the User model
        return Inertia::render('PostProjects/Index', [
            'postProjects' => $postProjects,
        ]);

        $search = $request->input('search');

        $postProjects = PostProject::query()
        ->when($search, function ($query, $search) {
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        })
        ->paginate(10); // Adjust the number per page as needed

        return inertia('PostProjects/Index', [
            'postProjects' => $postProjects,
            'search' => $search,
        ]);
    }

    public function create()
    {
        return Inertia::render('PostProjects/Create', [
            'auth' => Auth::user(),
        ]);
    }

    public function store(Request $request)
    {
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

    public function edit($id)
    {
        $postProject = auth()->user()->postProjects()->findOrFail($id);
        return Inertia::render('PostProjects/Edit', [
            'postProject' => $postProject,
            'auth' => Auth::user(),
        ]);
    }

    public function update(Request $request, $id)
    {
        try{
            logger($request->all());
            $postProject = auth()->user()->postProjects()->findOrFail($id);
            $request->merge([
                'is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN),
            ]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                // 'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
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
                // 'attachment' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
            ]);

            // // Handle image upload
            // if ($request->hasFile('image')) {
            //     logger($request->file('image'));
            //     $imagePath = $request->file('image')->store('grant_images', 'public');
            //     $validated['image'] = $imagePath;
            // }

            // // Handle attachment upload
            // if ($request->hasFile('attachment')) {
            //     logger($request->file('attachment'));
            //     $attachmentPath = $request->file('attachment')->store('grant_attachments', 'public');
            //     $validated['attachment'] = $attachmentPath;
            // }

            // Handle tags
            if ($request->has('tags') && is_array($request->tags)) {
                $validated['tags'] = json_encode($request->tags);
            }

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

    public function destroy($id)
    {
        $postProject = auth()->user()->postProjects()->findOrFail($id);
        $postProject->delete();

        return redirect()->route('post-projects.index')->with('success', 'Post projects deleted successfully.');
    }
}
