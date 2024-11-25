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
                        ->orWhere('description', 'like', "%{$search}%");
                })
                ->paginate(10); // Paginate results with 10 items per page

            return inertia('PostGrants/Index', [
                'postGrants' => $postGrants,
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
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
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
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
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
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
                // Handle image upload
            if ($request->hasFile('image')) {
                logger('Image: Im here ');
                // Delete the old image if it exists
                if ($postGrant->image) {
                    Storage::disk('public')->delete($postGrant->image);
                }
            
                // Store the new image
                $imagePath = $request->file('image')->store('grant_images', 'public');
                $request->merge(['image' => $imagePath]); // Add file path to validated data
                }else {
                    // Keep the existing path
                    $request->merge(['image' => $postGrant->image]);
                }

                // // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('attachment: Im here ');
                    // Delete the old attachment if it exists
                    if ($postGrant->attachment) {
                        Storage::disk('public')->delete($postGrant->attachment);
                    }
                
                    // Store the new attachment
                    $attachmentPath = $request->file('attachment')->store('grant_attachments', 'public');
                    $request->merge(['attachment' => $attachmentPath]); // Add file path to validated data
                }else {
                    // Keep the existing path
                    $request->merge(['attachment' => $postGrant->attachment]);
                }

                $validated = $request->validate([
                    'title' => 'required|string|max:255',
                    'description' => 'required|string',
                    'image' => 'nullable',
                    'post_status' => 'required|in:draft,published',
                    'grant_status' => 'required|in:open,closed',
                    'category' => 'nullable|string|max:255',
                    'tags' => 'nullable',
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
                    'attachment' => 'nullable',
                ]);

                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    // Delete the old image if it exists
                    if ($postGrant->image) {
                        Storage::disk('public')->delete($postGrant->image);
                    }
                
                    // Store the new image
                    $imagePath = $request->file('image')->store('grant_images', 'public');
                    $validated['image'] =  $imagePath;
                }else {
                    // Keep the existing path
                    $request->merge(['image' => $postGrant->image]);
                }
    
                // // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('attachment: Im here ');
                    // Delete the old attachment if it exists
                    if ($postGrant->attachment) {
                        Storage::disk('public')->delete($postGrant->attachment);
                    }
                
                    // Store the new attachment
                    $attachmentPath = $request->file('attachment')->store('grant_attachments', 'public');
                    $validated['attachment'] =  $attachmentPath;
                }else {
                    // Keep the existing path
                    $request->merge(['attachment' => $postGrant->attachment]);
                }

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
