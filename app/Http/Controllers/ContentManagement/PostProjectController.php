<?php

namespace App\Http\Controllers\ContentManagement;

use App\Http\Controllers\Controller;
use App\Models\PostProject;
use App\Models\FieldOfResearch;
use App\Models\UniversityList;
use App\Services\PostProjectService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Silber\Bouncer\BouncerFacade as Bouncer;

class PostProjectController extends Controller
{
    protected $postProjectService;

    public function __construct(PostProjectService $postProjectService)
    {
        $this->postProjectService = $postProjectService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user || !Bouncer::allows('post-projects')) {
            abort(403, 'Unauthorized access.');
        }

        $search = $request->input('search');

        $postProjects = PostProject::query()
            ->where('author_id', $user->unique_id)
            ->when($search, function ($query, $search) use ($user) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->where('author_id', $user->unique_id);
            })
            ->paginate(10);

        return inertia('PostProjects/Index', [
            'postProjects' => $postProjects,
            'search' => $search,
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        if (!$user || !Bouncer::allows('post-projects')) {
            abort(403, 'Unauthorized access.');
        }

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
            'researchOptions' => $researchOptions,
            'universities' => UniversityList::all(),
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Convert boolean string values to actual boolean before validation
            if ($request->has('create_scholarlab_project')) {
                $request->merge([
                    'create_scholarlab_project' => filter_var($request->create_scholarlab_project, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE)
                ]);
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'project_theme' => 'required|string|max:255',
                'purpose' => 'required|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'application_deadline' => 'nullable|date',
                'duration' => 'nullable|string|max:255',
                'sponsored_by' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'field_of_research' => 'required_if:category,Fundamental Research,Applied Research,Fundamental + Applied',
                'supervisor_category' => 'nullable|string|max:255',
                'supervisor_name' => 'nullable|string|max:255',
                'university' => 'nullable|exists:university_list,id',
                'email' => 'required|email|max:255',
                'origin_country' => 'required|string|max:255',
                'student_nationality' => 'nullable|string|max:255',
                'student_level' => 'nullable',
                'student_mode_study' => 'nullable',
                'appointment_type' => 'nullable|string|max:255',
                'purpose_of_collaboration' => 'nullable|string|max:255',
                'image' => 'nullable|image|max:2048',
                'attachment' => 'nullable|file|max:5120',
                'amount' => 'required|numeric|min:0',
                'application_url' => 'nullable|url|max:255',
                'project_status' => 'nullable',
                'create_scholarlab_project' => 'sometimes|boolean',
                'tags' => 'nullable|array'
            ]);

            $user = Auth::user();
            if (!$user) {
                abort(403, 'User not authenticated');
            }

            $validated['author_id'] = $user->unique_id;

            if ($request->has('tags') && is_array($request->tags)) {
                $validated['tags'] = json_encode($request->tags);
            }

            $this->postProjectService->createProject($validated);

            return redirect()->route('post-projects.index')->with('success', 'Project posted successfully.');
        } catch (ValidationException $e) {
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
        if (!$user || !Bouncer::allows('post-projects')) {
            abort(403, 'Unauthorized access.');
        }

        $postProject = PostProject::where('author_id', $user->unique_id)->findOrFail($id);
        return Inertia::render('PostProjects/Edit', [
            'postProject' => $postProject,
            'researchOptions' => $researchOptions,
            'universities' => UniversityList::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user || !Bouncer::allows('post-projects')) {
            abort(403, 'Unauthorized access.');
        }

        try {
            $postProject = PostProject::where('author_id', $user->unique_id)->findOrFail($id);
            $request->merge(['is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN)]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'project_theme' => 'required|string|max:255',
                'purpose' => 'required|max:255',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'application_deadline' => 'nullable|date',
                'duration' => 'nullable|string|max:255',
                'sponsored_by' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'field_of_research' => 'required_if:category,Fundamental Research,Applied Research,Fundamental + Applied',
                'supervisor_category' => 'nullable|string|max:255',
                'supervisor_name' => 'nullable|string|max:255',
                'university' => 'nullable|exists:university_list,id',
                'email' => 'required|email|max:255',
                'origin_country' => 'required|string|max:255',
                'student_nationality' => 'nullable|string|max:255',
                'student_level' => 'nullable',
                'student_mode_study' => 'nullable',
                'appointment_type' => 'nullable|string|max:255',
                'purpose_of_collaboration' => 'nullable|string|max:255',
                'amount' => 'required|numeric|min:0',
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

            $this->postProjectService->updateProject($postProject, $validated);

            return redirect()->route('post-projects.index')->with('success', 'Post project updated successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    public function destroy($id)
    {
        $user = Auth::user();
        if (!$user || !Bouncer::allows('post-projects')) {
            abort(403, 'Unauthorized access.');
        }

        $postProject = PostProject::where('author_id', $user->unique_id)->findOrFail($id);
        $this->postProjectService->deleteProject($postProject);

        return redirect()->route('post-projects.index')->with('success', 'Post projects deleted successfully.');
    }
} 