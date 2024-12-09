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
        $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
        $researchOptions = [];
        foreach ($fieldOfResearches as $field) {
            foreach ($field->researchAreas as $area) {
                foreach ($area->nicheDomains as $domain) {
                    $researchOptions[] = [
                        'field_of_research_id' => $field->id,
                        'field_of_research_name' => $field->name,
                        'research_area_id' => $area->id,
                        'research_area_name' => $area->name,
                        'niche_domain_id' => $domain->id,
                        'niche_domain_name' => $domain->name,
                    ];
                }
            }
        }

        if(Auth::user()->cannot('post-grants'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            return Inertia::render('PostGrants/Create', [
                'auth' => Auth::user(),
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
                'researchOptions' => $researchOptions,
                'universities' => UniversityList::all(),
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
                    'duration' => 'nullable|string|max:255',
                    'sponsored_by' => 'nullable|string|max:255',
                    'category' => 'nullable|string|max:255',
                    'field_of_research' => 'nullable',
                    'supervisor_category' => 'nullable|string|max:255',
                    'supervisor_name' => 'nullable|string|max:255',
                    'university' => 'nullable|exists:university_list,id',
                    'email' => 'nullable|email|max:255',
                    'origin_country' => 'nullable|string|max:255',
                    'purpose' => 'nullable|string|max:255',
                    'student_nationality' => 'nullable|string|max:255',
                    'student_level' => 'nullable|string|max:255',
                    'appointment_type' => 'nullable|string|max:255',
                    'purpose_of_collaboration' => 'nullable|string|max:255',
                    'image' => 'nullable|string|max:255',
                    'attachment' => 'nullable|string|max:255',
                    'amount' => 'nullable|numeric|min:0',
                    'application_url' => 'nullable|url|max:255',
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

                if (isset($validated['field_of_research']) && is_string($validated['field_of_research'])) {
                    $validated['field_of_research'] = json_decode($validated['field_of_research'], true);
                    logger()->info('Field of Research:', $validated['field_of_research']);
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
        $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
        $researchOptions = [];
        foreach ($fieldOfResearches as $field) {
            foreach ($field->researchAreas as $area) {
                foreach ($area->nicheDomains as $domain) {
                    $researchOptions[] = [
                        'field_of_research_id' => $field->id,
                        'field_of_research_name' => $field->name,
                        'research_area_id' => $area->id,
                        'research_area_name' => $area->name,
                        'niche_domain_id' => $domain->id,
                        'niche_domain_name' => $domain->name,
                    ];
                }
            }
        }

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
                'researchOptions' => $researchOptions,
                'universities' => UniversityList::all(),
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
                    $request->merge(['image' => 'grant_images/' . $imageName]);
                } else {
                    // Keep the existing path
                    $request->merge(['image' => $postGrant->image]);
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
                    
                    // Save the relative path
                    $request->merge(['attachment' => 'grant_attachments/' . $attachmentName]);
                } else {
                    // Keep the existing path
                    $request->merge(['attachment' => $postGrant->attachment]);
                }

                $validated = $request->validate([
                    'title' => 'required|string|max:255',
                    'description' => 'required|string',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date',
                    'application_deadline' => 'required|date',
                    'duration' => 'nullable|string|max:255',
                    'sponsored_by' => 'nullable|string|max:255',
                    'category' => 'nullable|string|max:255',
                    'field_of_research' => 'nullable',
                    'supervisor_category' => 'nullable|string|max:255',
                    'supervisor_name' => 'nullable|string|max:255',
                    'university' => 'nullable|exists:university_list,id',
                    'email' => 'nullable|email|max:255',
                    'origin_country' => 'nullable|string|max:255',
                    'purpose' => 'nullable|string|max:255',
                    'student_nationality' => 'nullable|string|max:255',
                    'student_level' => 'nullable|string|max:255',
                    'appointment_type' => 'nullable|string|max:255',
                    'purpose_of_collaboration' => 'nullable|string|max:255',
                    'image' => 'nullable|string|max:255',
                    'attachment' => 'nullable|string|max:255',
                    'amount' => 'nullable|numeric|min:0',
                    'application_url' => 'nullable|url|max:255',
                    'status' => 'in:draft,published',
                ]);

                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    // Save the relative path
                    $validated['image'] = 'grant_images/' . $imageName;
                } else {
                    // Keep the existing path
                    $validated['image'] = $postGrant->image;
                }
                
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                    // Save the relative path
                    $validated['attachment'] = 'grant_attachments/' . $attachmentName;
                } else {
                    // Keep the existing path
                    $validated['attachment'] = $postGrant->attachment;
                }

                if (isset($validated['field_of_research']) && is_string($validated['field_of_research'])) {
                    $validated['field_of_research'] = json_decode($validated['field_of_research'], true);
                    logger()->info('Field of Research:', $validated['field_of_research']);
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
