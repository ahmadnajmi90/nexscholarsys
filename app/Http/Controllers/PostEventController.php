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
use App\Models\FieldOfResearch;

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
                        ->orWhere('description', 'like', "%{$search}%")
                        ->where('author_id', Auth::user()->unique_id);
                })
                ->paginate(10); // Paginate results with 10 items per page

            return Inertia::render('PostEvents/Index', [
                'postEvents' => $postEvents,
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

            return Inertia::render('PostEvents/Create', [
                'auth' => Auth::user(),
                'researchOptions' => $researchOptions,
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
                    'image' => 'nullable|image|max:2048',
                    'event_theme' => 'nullable|string|max:255',
                    'registration_url' => 'nullable|url|max:255',
                    'registration_deadline' => 'nullable|date',
                    'contact_email' => 'nullable|email|max:255',
                    'venue' => 'nullable|string|max:255',
                    'city' => 'nullable|string|max:255',
                    'country' => 'nullable|string|max:255',
                    'event_status' => 'nullable|string|in:draft,published',
                    'field_of_research' => 'nullable',
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

                if (isset($validated['field_of_research']) && is_string($validated['field_of_research'])) {
                    $validated['field_of_research'] = json_decode($validated['field_of_research'], true);
                    logger()->info('Field of Research:', $validated['field_of_research']);
                }

                // Handle attachment upload
                // if ($request->hasFile('attachment')) {
                //     logger('Attachment: Im here ');

                //     // Define the destination path directly in the public directory
                //     $destinationPath = public_path('storage/event_attachments');

                //     // Ensure the directory exists
                //     if (!file_exists($destinationPath)) {
                //         mkdir($destinationPath, 0755, true);
                //     }

                //     // Store the uploaded file in the public/storage/event_images folder
                //     $attachment = $request->file('attachment');
                //     $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                //     $attachment->move($destinationPath, $attachmentName);

                //     // Save the path relative to public/storage
                //     $validated['attachment'] = 'event_attachments/' . $attachmentName;
                //     logger('Attachment: Im here ', ['path' => $validated['attachment']]);
                // }

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

        if(Auth::user()->cannot('post-events'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postEvent = auth()->user()->postEvents()->findOrFail($id);
            return Inertia::render('PostEvents/Edit', [
                'postEvent' => $postEvent,
                'auth' => Auth::user(),
                'researchOptions' => $researchOptions,
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

                $validated = $request->validate([
                    'event_name' => 'required|string|max:255',
                    'description' => 'nullable|string',
                    'event_type' => 'nullable|string|max:255',
                    'event_mode' => 'nullable|string|max:255',
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after_or_equal:start_date',
                    'start_time' => 'required',
                    'end_time' => 'required',
                    'registration_url' => 'nullable|url|max:255',
                    'registration_deadline' => 'nullable|date',
                    'contact_email' => 'nullable|email|max:255',
                    'venue' => 'nullable|string|max:255',
                    'city' => 'nullable|string|max:255',
                    'country' => 'nullable|string|max:255',
                    'event_status' => 'nullable|string|in:draft,published',
                    'event_theme' => 'nullable|string|max:255',
                    'field_of_research' => 'nullable',

                    'image' => [
                        'nullable',
                        'max:2048',
                        function ($attribute, $value, $fail) use ($request) {
                            if (is_string($value) && !file_exists(public_path('storage/' . $value))) {
                                $fail('The ' . $attribute . ' field must be an existing file.');
                            } elseif (!is_string($value) && !$request->hasFile($attribute)) {
                                $fail('The ' . $attribute . ' field must be an image.');
                            }
                        },
                    ],
                    // 'attachment' => [
                    //     'nullable',
                    //     function ($attribute, $value, $fail) use ($request) {
                    //         if (is_string($value) && !file_exists(public_path('storage/' . $value))) {
                    //             $fail('The ' . $attribute . ' field must be an existing file.');
                    //         } elseif (!is_string($value) && !$request->hasFile($attribute)) {
                    //             $fail('The ' . $attribute . ' field must be a file.');
                    //         }
                    //     },
                    // ],
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
                    $validated['image'] = 'event_images/' . $imageName;
                } else {
                    // Keep the existing path
                    $validated['image'] = $postEvent->image;
                }

                if (!array_key_exists('field_of_research', $validated)) {
                    $validated['field_of_research'] = null;
                    logger()->info('Field of Research not provided; setting to null.');
                } elseif (isset($validated['field_of_research']) && is_string($validated['field_of_research'])) {
                    $decoded = json_decode($validated['field_of_research'], true);
                    if (empty($decoded)) {
                        $validated['field_of_research'] = null;
                        logger()->info('Field of Research is empty; setting to null.');
                    } else {
                        $validated['field_of_research'] = $decoded;
                        logger()->info('Field of Research:', $validated['field_of_research']);
                    }
                }

                // Handle attachment upload
                // if ($request->hasFile('attachment')) {
                //     logger('Attachment: Im here ');


                //     if ($postEvent->attachment) {
                //         $oldAttachmentPath = public_path('storage/' . $postEvent->attachment);
                //         if (file_exists($oldAttachmentPath)) {
                //             unlink($oldAttachmentPath);
                //         }
                //     }


                //     $attachmentDestination = public_path('storage/event_attachments');


                //     if (!file_exists($attachmentDestination)) {
                //         mkdir($attachmentDestination, 0755, true);
                //     }


                //     $attachment = $request->file('attachment');
                //     $attachmentName = time() . '_' . $attachment->getClientOriginalName();
                //     $attachment->move($attachmentDestination, $attachmentName);


                //     $validated['attachment'] = 'event_attachments/' . $attachmentName;
                // } else {

                //     $validated['attachment'] = $postEvent->attachment;
                // }


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
}
