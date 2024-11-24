<?php

namespace App\Http\Controllers;

use App\Models\PostGrant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class PostGrantController extends Controller
{
    public function index(Request $request)
    {
        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postGrants = auth()->user()->postGrants;
            return Inertia::render('PostGrants/Index', [
                'postGrants' => $postGrants,
            ]);

            $search = $request->input('search');

            $postGrants = PostGrant::query()
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->paginate(10); // Adjust the number per page as needed

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
                    'author_id' => 'required|string|max:255',
                    'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048', // Image validation
                    'post_status' => 'required|in:draft,published',
                    'grant_status' => 'required|in:open,closed',
                    'category' => 'nullable|string|max:255',
                    'tags' => 'nullable|json',
                    'sponsored_by' => 'nullable|string|max:255',
                    'location' => 'nullable|string|max:255',
                    'email' => 'nullable|email|max:255',
                    'contact_number' => 'nullable|string|max:255',
                    'purpose' => 'nullable|in:find_pgstudent,find_collaboration',
                    'start_date' => 'nullable|date',
                    'end_date' => 'nullable|date',
                    'budget' => 'nullable|numeric|min:0',
                    'eligibility_criteria' => 'nullable|string',
                    'is_featured' => 'boolean',
                    'application_url' => 'nullable|url|max:255',
                    'attachment' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // Attachment validation
                ]);

                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    $imagePath = $request->file('image')->store('grant_images', 'public');
                    $validated['image'] =  $imagePath;
                    logger('Image: Im here ', ['path' => $imagePath]);
                }
            
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                    $attachmentPath = $request->file('attachment')->store('grant_attachments', 'public');
                    $validated['attachment'] = $attachmentPath;
                    logger('Attachment: Im here ', ['path' => $attachmentPath]);
                }
        
                // Log validated data
                logger('Validated Data:', $validated);
        
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
                    // 'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
                    'post_status' => 'required|in:draft,published',
                    'grant_status' => 'required|in:open,closed',
                    'category' => 'nullable|string|max:255',
                    'tags' => 'nullable|json',
                    'sponsored_by' => 'nullable|string|max:255',
                    'location' => 'nullable|string|max:255',
                    'email' => 'nullable|email|max:255',
                    'contact_number' => 'nullable|string|max:255',
                    'purpose' => 'nullable|in:find_pgstudent,find_collaboration',
                    'start_date' => 'nullable|date',
                    'end_date' => 'nullable|date',
                    'budget' => 'nullable|numeric|min:0',
                    'eligibility_criteria' => 'nullable|string',
                    'is_featured' => 'nullable|boolean',
                    'application_url' => 'nullable|url|max:255',
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
}
