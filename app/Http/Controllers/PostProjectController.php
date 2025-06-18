<?php

namespace App\Http\Controllers;

use App\Models\PostProject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Silber\Bouncer\BouncerFacade as Bouncer;
use Illuminate\Support\Facades\DB;
use App\Models\FieldOfResearch;
use App\Models\UniversityList;
use App\Http\Requests\StorePostProjectRequest;

class PostProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if(!$user || !Bouncer::allows('post-projects'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $search = $request->input('search');

            $postProjects = PostProject::query()
            ->where('author_id', $user->unique_id) // Ensure only user's posts
            ->when($search, function ($query, $search) use ($user) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->where('author_id', $user->unique_id);
            })
            ->paginate(10); // Paginate results with 10 items per page

            return inertia('PostProjects/Index', [
                'postProjects' => $postProjects,
                'search' => $search,
            ]);
        }
    }

    public function create()
    {
        $user = Auth::user();
        if(!$user || !Bouncer::allows('post-projects'))
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

            return Inertia::render('PostProjects/Create', [
                'auth' => $user,
                'researchOptions' => $researchOptions,
                'universities' => UniversityList::all(),
            ]);
        }   
    }

    public function store(StorePostProjectRequest $request)
    {
        try {
            logger('Store method reached');
            
            // Get validated data
            $validated = $request->validated();
            
            // Ensure author_id is set
            if (!isset($validated['author_id']) || empty($validated['author_id'])) {
                $user = Auth::user();
                if (!$user) {
                    abort(403, 'User not authenticated');
                }
                $validated['author_id'] = $user->unique_id;
                logger('Setting author_id explicitly', ['author_id' => $validated['author_id']]);
            }
            
            // Handle image upload
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

            // Process JSON fields
            foreach (['purpose', 'student_level', 'student_mode_study', 'field_of_research'] as $field) {
                if (isset($validated[$field]) && is_string($validated[$field])) {
                    $validated[$field] = json_decode($validated[$field], true);
                    logger()->info(ucfirst($field) . ':', $validated[$field] ?? []);
                }
            }

            // Log validated data
            logger('Validated Data:', $validated);

            // Create the post project with explicit author_id
            $postProject = new PostProject($validated);
            $postProject->author_id = $validated['author_id'];
            $postProject->save();

            // Check if the user opted-in to create a ScholarLab project
            if ($request->boolean('create_scholarlab_project')) {
                logger('Creating ScholarLab project for post project ID: ' . $postProject->id);
                
                // Create the linked ScholarLab Project
                $project = \App\Models\Project::create([
                    'name' => $postProject->title, // Use the post's title as the project name
                    'description' => 'Research project based on: ' . $postProject->title,
                    'owner_id' => Auth::id(),
                    'post_project_id' => $postProject->id, // Link to the post we just created
                ]);
                
                // Create a default board for the project
                $board = new \App\Models\Board([
                    'name' => 'Main Board',
                ]);
                
                // Save the board with the polymorphic relationship
                $project->boards()->save($board);
                
                // Create some default lists for the board
                $board->lists()->create([
                    'name' => 'To Do',
                    'order' => 1,
                ]);
                
                $board->lists()->create([
                    'name' => 'In Progress',
                    'order' => 2,
                ]);
                
                $board->lists()->create([
                    'name' => 'Done',
                    'order' => 3,
                ]);
                
                logger('ScholarLab project created successfully with ID: ' . $project->id);
            }

            return redirect()->route('post-projects.index')->with('success', 'Project posted successfully.');
    
        } catch (ValidationException $e) {
            logger('Validation Errors:', $e->errors());
            // Return back with validation errors
            return redirect()->back()->withErrors($e->errors())->withInput();
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

        $user = Auth::user();
        if(!$user || !Bouncer::allows('post-projects'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postProject = PostProject::where('author_id', $user->unique_id)->findOrFail($id);
            return Inertia::render('PostProjects/Edit', [
                'postProject' => $postProject,
                'auth' => $user,
                'researchOptions' => $researchOptions,
                'universities' => UniversityList::all(),
            ]);
        }
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if(!$user || !Bouncer::allows('post-projects'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            try{
                logger($request->all());
                $postProject = PostProject::where('author_id', $user->unique_id)->findOrFail($id);
                $request->merge([
                    'is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN),
                ]);

                $validated = $request->validate([
                    'title' => 'required|string|max:255',
                    'description' => 'required|string',
                    'project_theme' => 'required|string|max:255',
                    'purpose' => 'required|max:255',
                    'start_date' => 'nullable|date',
                    'end_date' => 'nullable|date',
                    'application_deadline' => 'nullable|date',
                    'duration' => 'nullable|string|max:255',
                    'sponsored_by' => 'nullable|string|max:255',
                    'category' => 'nullable|string|max:255',
                    'field_of_research' => 'nullable',
                    'supervisor_category' => 'nullable|string|max:255',
                    'supervisor_name' => 'nullable|string|max:255',
                    'university' => 'nullable|exists:university_list,id',
                    'email' => 'nullable|email|max:255',
                    'origin_country' => 'nullable|string|max:255',
                    'student_nationality' => 'nullable|string|max:255',
                    'student_level' => 'nullable',
                    'student_mode_study' => 'nullable',
                    'appointment_type' => 'nullable|string|max:255',
                    'purpose_of_collaboration' => 'nullable|string|max:255',
                    'amount' => 'nullable|numeric|min:0',
                    'application_url' => 'nullable|url|max:255',
                    'project_status' => 'nullable',

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
                    'attachment' => [
                        'nullable',
                        'max:5120',
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
                    $validated['image'] = 'project_images/' . $imageName;
                } else {
                    // Keep the existing path
                    $validated['image'] = $postProject->image;
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
                    $validated['attachment'] = 'project_attachments/' . $attachmentName;
                } else {
                    // Keep the existing path
                    $validated['attachment'] = $postProject->attachment;
                }

                if (isset($validated['purpose']) && is_string($validated['purpose'])) {
                    $validated['purpose'] = json_decode($validated['purpose'], true);
                    logger()->info('Purpose:', $validated['purpose']);
                }

                if (isset($validated['student_level']) && is_string($validated['student_level'])) {
                    $validated['student_level'] = json_decode($validated['student_level'], true);
                    logger()->info('Student Level:', $validated['student_level']);
                }

                if (isset($validated['student_mode_study']) && is_string($validated['student_mode_study'])) {
                    $validated['student_mode_study'] = json_decode($validated['student_mode_study'], true);
                    logger()->info('Student Mode Study:', $validated['student_mode_study']);
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
        $user = Auth::user();
        if(!$user || !Bouncer::allows('post-projects'))
        {
            abort(403, 'Unauthorized access.');
        }
        else{
            $postProject = PostProject::where('author_id', $user->unique_id)->findOrFail($id);
            $postProject->delete();

            return redirect()->route('post-projects.index')->with('success', 'Post projects deleted successfully.');
        }
    }
}
