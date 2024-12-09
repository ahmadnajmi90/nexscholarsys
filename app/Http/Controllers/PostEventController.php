<?php

namespace App\Http\Controllers;

use App\Models\PostEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\DB;

class PostEventController extends Controller
{
    public function index(Request $request)
    {
        if(Auth::user()->cannot('post-events'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $search = $request->input('search');

            $postEvents = PostEvent::query()
                ->where('author_id', Auth::user()->unique_id) // Ensure only user's posts
                ->when($search, function ($query, $search) {
                    $query->where('event_name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                })
                ->paginate(10); // Paginate results with 10 items per page

            return Inertia::render('PostEvents/Index', [
                'postEvents' => $postEvents,
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
                'search' => $search, // Pass search query for retaining user input
            ]);
        }
    }

    public function create()
    {
        if(Auth::user()->cannot('post-events'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            return Inertia::render('PostEvents/Create', [
                'auth' => Auth::user(),
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
            ]);
        }
    }

    public function store(Request $request)
    {
        if(Auth::user()->cannot('post-events'))
        {
            logger('Unauthorized access'); // Log the reason
            abort(403, 'Unauthorized access.');
        }
        else{
            try {
                logger('Store method reached');
                $author = Auth::user();
                $request->merge(['author_id' => $author->unique_id]);
                if ($request->has('theme') && is_array($request->theme)) {
                    logger('theme: Im here ');
                    $request->merge([
                        'theme' => json_encode($request->theme),
                    ]);
                }
                if ($request->has('target_audience') && is_array($request->target_audience)) {
                    logger('Target Audience: Im here ');
                    $request->merge([
                        'target_audience' => json_encode($request->target_audience),
                    ]);
                }
                logger('Store method reached', $request->all());
                
                $validated = $request->validate([
                    'event_name' => 'required|string|max:255',
                    'description' => 'nullable|string',
                    'event_type' => 'nullable|string|max:255',
                    'event_mode' => 'nullable|string|max:255',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after_or_equal:start_date',
                    'start_time' => 'required',
                    'end_time' => 'required',
                    'image' => 'nullable|string|max:255',
                    'attachment' => 'nullable|string|max:255',
                    'registration_url' => 'nullable|url|max:255',
                    'registration_deadline' => 'nullable|date',
                    'contact_email' => 'nullable|email|max:255',
                    'venue' => 'nullable|string|max:255',
                    'city' => 'nullable|string|max:255',
                    'country' => 'nullable|string|max:255',
                    'event_status' => 'nullable|string|in:draft,published',
                ]);

                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    
                    // Define the destination path directly in the public directory
                    $destinationPath = public_path('storage/event_images');
                    
                    // Ensure the directory exists
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    
                    // Store the uploaded file in the public/storage/event_images folder
                    $image = $request->file('image');
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move($destinationPath, $imageName);
                    
                    // Save the path relative to public/storage
                    $validated['image'] = 'event_images/' . $imageName;
                    logger('Image: Im here ', ['path' => $validated['image']]);
                }
                
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                    
                    // Define the destination path directly in the public directory
                    $destinationPath = public_path('storage/event_attachments');
                    
                    // Ensure the directory exists
                    if (!file_exists($destinationPath)) {
                        mkdir($destinationPath, 0755, true);
                    }
                    
                    // Store the uploaded file in the public/storage/event_images folder
                    $attachment = $request->file('attachment');
                    $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                    $attachment->move($destinationPath, $attachmentName);
                    
                    // Save the path relative to public/storage
                    $validated['attachment'] = 'event_attachments/' . $attachmentName;
                    logger('Attachment: Im here ', ['path' => $validated['attachment']]);
                }
        
                // Log validated data
                logger('Validated Data:', $validated);
        
                // Save data
                auth()->user()->postEvents()->create($validated);
        
                return redirect()->route('post-events.index')->with('success', 'Post event created successfully.');
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
        if(Auth::user()->cannot('post-events'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postEvent = auth()->user()->postEvents()->findOrFail($id);
            return Inertia::render('PostEvents/Edit', [
                'postEvent' => $postEvent,
                'auth' => Auth::user(),
                'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        if (Auth::user()->cannot('post-events')) {
            abort(403, 'Unauthorized access.');
        }
        else{
            try{
                logger($request->all());
                $postEvent = auth()->user()->postEvents()->findOrFail($id);
                $request->merge([
                    'is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN),
                ]);
                // Handle image upload
                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    
                    // Delete the old image if it exists
                    if ($postEvent->image) {
                        $oldImagePath = public_path('storage/' . $postEvent->image);
                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath); // Delete the old image
                        }
                    }
                
                    // Define the destination path
                    $imageDestination = public_path('storage/event_images');
                    
                    // Ensure the directory exists
                    if (!file_exists($imageDestination)) {
                        mkdir($imageDestination, 0755, true);
                    }
                    
                    // Save the new image
                    $image = $request->file('image');
                    $imageName = time() . '_' . $image->getClientOriginalName();
                    $image->move($imageDestination, $imageName);
                    
                    // Save the relative path
                    $request->merge(['image' => 'event_images/' . $imageName]);
                } else {
                    // Keep the existing path
                    $request->merge(['image' => $postEvent->image]);
                }
                
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                
                    // Delete the old attachment if it exists
                    if ($postEvent->attachment) {
                        $oldAttachmentPath = public_path('storage/' . $postEvent->attachment);
                        if (file_exists($oldAttachmentPath)) {
                            unlink($oldAttachmentPath); // Delete the old attachment
                        }
                    }
                
                    // Define the destination path
                    $attachmentDestination = public_path('storage/event_attachments');
                    
                    // Ensure the directory exists
                    if (!file_exists($attachmentDestination)) {
                        mkdir($attachmentDestination, 0755, true);
                    }
                    
                    // Save the new attachment
                    $attachment = $request->file('attachment');
                    $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                    $attachment->move($attachmentDestination, $attachmentName);
                    
                    // Save the relative path
                    $request->merge(['attachment' => 'event_attachments/' . $attachmentName]);
                } else {
                    // Keep the existing path
                    $request->merge(['attachment' => $postEvent->attachment]);
                }

                $validated = $request->validate([
                    'event_name' => 'required|string|max:255',
                    'description' => 'nullable|string',
                    'event_type' => 'nullable|string|max:255',
                    'event_mode' => 'nullable|string|max:255',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after_or_equal:start_date',
                    'start_time' => 'required',
                    'end_time' => 'required',
                    'image' => 'nullable|string|max:255',
                    'attachment' => 'nullable|string|max:255',
                    'registration_url' => 'nullable|url|max:255',
                    'registration_deadline' => 'nullable|date',
                    'contact_email' => 'nullable|email|max:255',
                    'venue' => 'nullable|string|max:255',
                    'city' => 'nullable|string|max:255',
                    'country' => 'nullable|string|max:255',
                    'event_status' => 'nullable|string|in:draft,published',
                ]);

                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    // Save the relative path
                    $validated['image'] = 'event_images/' . $imageName;
                } else {
                    // Keep the existing path
                    $validated['image'] = $postEvent->image;
                }
                
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                    // Save the relative path
                    $validated['attachment'] = 'event_attachments/' . $attachmentName;
                } else {
                    // Keep the existing path
                    $validated['attachment'] = $postEvent->attachment;
                }
                

                // Handle tags
                if ($request->has('target_audience') && is_array($request->target_audience)) {
                    $validated['target_audience'] = json_encode($request->target_audience);
                }

                // Update the post event
                $postEvent->update($validated);

                return redirect()->route('post-events.index')->with('success', 'Post event updated successfully.');
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
        if(Auth::user()->cannot('post-events'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postEvent = auth()->user()->postEvents()->findOrFail($id);
            $postEvent->delete();

            return redirect()->route('post-events.index')->with('success', 'Post event deleted successfully.');
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
