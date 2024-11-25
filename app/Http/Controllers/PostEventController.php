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
                    'description' => 'required|string',
                    'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
                    'event_type' => 'nullable|string|max:255',
                    'theme' => 'nullable|json',
                    'location' => 'nullable|string|max:255',
                    'start_date_time' => 'required|date',
                    'end_date_time' => 'required|date|after_or_equal:start_date_time',
                    'organized_by' => 'nullable|string|max:255',
                    'target_audience' => 'nullable|json',
                    'registration_url' => 'nullable|url|max:255',
                    'registration_deadline' => 'nullable|date',
                    'fees' => 'nullable|numeric|min:0',
                    'contact_email' => 'nullable|email|max:255',
                    'contact_number' => 'nullable|string|max:255',
                    'agenda' => 'nullable|string',
                    'speakers' => 'nullable|string',
                    'sponsors' => 'nullable|string',
                    'attachment' => 'nullable|file|mimes:pdf,doc,docx|max:5120', 
                    'event_status' => 'required|in:draft,published',
                    'is_featured' => 'boolean',
                ]);

                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    $imagePath = $request->file('image')->store('event_images', 'public');
                    $validated['image'] =  $imagePath;
                    logger('Image: Im here ', ['path' => $imagePath]);
                }
            
                // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('Attachment: Im here ');
                    $attachmentPath = $request->file('attachment')->store('event_attachments', 'public');
                    $validated['attachment'] = $attachmentPath;
                    logger('Attachment: Im here ', ['path' => $attachmentPath]);
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
                    Storage::disk('public')->delete($postEvent->image);
                }
            
                // Store the new image
                $imagePath = $request->file('image')->store('event_images', 'public');
                $request->merge(['image' => $imagePath]); // Add file path to validated data
                }else {
                    // Keep the existing path
                    $request->merge(['image' => $postEvent->image]);
                }

                // // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('attachment: Im here ');
                    // Delete the old attachment if it exists
                    if ($postEvent->attachment) {
                        Storage::disk('public')->delete($postEvent->attachment);
                    }
                
                    // Store the new attachment
                    $attachmentPath = $request->file('attachment')->store('event_attachments', 'public');
                    $request->merge(['attachment' => $attachmentPath]); // Add file path to validated data
                }else {
                    // Keep the existing path
                    $request->merge(['attachment' => $postEvent->attachment]);
                }

                $validated = $request->validate([
                    'event_name' => 'required|string|max:255',
                    'description' => 'required|string',
                    'image' => 'nullable',
                    'event_type' => 'nullable|string|max:255',
                    'theme' => 'nullable',
                    'location' => 'nullable|string|max:255',
                    'start_date_time' => 'required|date',
                    'end_date_time' => 'required|date|after_or_equal:start_date_time',
                    'organized_by' => 'nullable|string|max:255',
                    'target_audience' => 'nullable',
                    'registration_url' => 'nullable|url|max:255',
                    'registration_deadline' => 'nullable|date',
                    'fees' => 'nullable|numeric|min:0',
                    'contact_email' => 'nullable|email|max:255',
                    'contact_number' => 'nullable|string|max:255',
                    'agenda' => 'nullable|string',
                    'speakers' => 'nullable|string',
                    'sponsors' => 'nullable|string',
                    'attachment' => 'nullable', 
                    'event_status' => 'required|in:draft,published',
                    'is_featured' => 'boolean',
                ]);

                if ($request->hasFile('image')) {
                    logger('Image: Im here ');
                    // Delete the old image if it exists
                    if ($postEvent->image) {
                        Storage::disk('public')->delete($postEvent->image);
                    }
                
                    // Store the new image
                    $imagePath = $request->file('image')->store('event_images', 'public');
                    $validated['image'] =  $imagePath;
                }else {
                    // Keep the existing path
                    $request->merge(['image' => $postEvent->image]);
                }
    
                // // Handle attachment upload
                if ($request->hasFile('attachment')) {
                    logger('attachment: Im here ');
                    // Delete the old attachment if it exists
                    if ($postEvent->attachment) {
                        Storage::disk('public')->delete($postEvent->attachment);
                    }
                
                    // Store the new attachment
                    $attachmentPath = $request->file('attachment')->store('event_attachments', 'public');
                    $validated['attachment'] =  $attachmentPath;
                }else {
                    // Keep the existing path
                    $request->merge(['attachment' => $postEvent->attachment]);
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
