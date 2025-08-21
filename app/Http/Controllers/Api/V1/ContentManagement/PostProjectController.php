<?php

namespace App\Http\Controllers\Api\V1\ContentManagement;

use App\Http\Controllers\Controller;
use App\Models\PostProject;
use App\Services\PostProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\PostProjectResource;

/**
 * @OA\Tag(
 *     name="Content Management - Projects",
 *     description="API endpoints for managing projects"
 * )
 */
class PostProjectController extends Controller
{
    protected $postProjectService;

    public function __construct(PostProjectService $postProjectService)
    {
        $this->postProjectService = $postProjectService;
    }

    /**
     * @OA\Get(
     *     path="/api/v1/projects",
     *     summary="Get all projects for the authenticated user",
     *     tags={"Content Management - Projects"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search term for title or description",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number for pagination",
     *         required=false,
     *         @OA\Schema(type="integer", default=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of projects",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Project")),
     *             @OA\Property(property="current_page", type="integer"),
     *             @OA\Property(property="last_page", type="integer"),
     *             @OA\Property(property="per_page", type="integer"),
     *             @OA\Property(property="total", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $postProjects = PostProject::query()
            ->where('author_id', Auth::user()->unique_id)
            ->when($search, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->where('author_id', Auth::user()->unique_id);
            })
            ->paginate(10);

        return PostProjectResource::collection($postProjects);
    }

    /**
     * @OA\Get(
     *     path="/api/v1/projects/{id}",
     *     summary="Get a specific project",
     *     tags={"Content Management - Projects"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project details",
     *         @OA\JsonContent(ref="#/components/schemas/Project")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function show($id)
    {
        $project = auth()->user()->postProjects()->findOrFail($id);
        return new PostProjectResource($project);
    }

    /**
     * @OA\Post(
     *     path="/api/v1/projects",
     *     summary="Create a new project",
     *     tags={"Content Management - Projects"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","description","project_theme","purpose","sponsored_by","category","field_of_research","email","origin_country","amount"},
     *             @OA\Property(property="title", type="string", example="AI Research Project"),
     *             @OA\Property(property="description", type="string", example="Advanced research project in artificial intelligence"),
     *             @OA\Property(property="project_theme", type="string", example="Machine Learning"),
     *             @OA\Property(property="purpose", type="string", example="Research and Development"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2024-01-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2024-12-31"),
     *             @OA\Property(property="application_deadline", type="string", format="date", example="2023-11-30"),
     *             @OA\Property(property="duration", type="string", example="12 months"),
     *             @OA\Property(property="sponsored_by", type="string", example="Tech Corporation"),
     *             @OA\Property(property="category", type="string", example="Research"),
     *             @OA\Property(property="field_of_research", type="array", @OA\Items(type="string"), example={"Computer Science", "AI"}),
     *             @OA\Property(property="supervisor_category", type="string", example="Professor"),
     *             @OA\Property(property="supervisor_name", type="string", example="Dr. John Smith"),
     *             @OA\Property(property="university", type="integer", example=1),
     *             @OA\Property(property="email", type="string", format="email", example="contact@techcorp.com"),
     *             @OA\Property(property="origin_country", type="string", example="United States"),
     *             @OA\Property(property="student_nationality", type="string", example="International"),
     *             @OA\Property(property="student_level", type="string", example="PhD"),
     *             @OA\Property(property="student_mode_study", type="string", example="Full-time"),
     *             @OA\Property(property="appointment_type", type="string", example="Research Assistant"),
     *             @OA\Property(property="purpose_of_collaboration", type="string", example="Academic Research"),
     *             @OA\Property(property="amount", type="number", example=50000),
     *             @OA\Property(property="application_url", type="string", format="uri", example="https://techcorp.com/apply"),
     *             @OA\Property(property="project_status", type="string", enum={"draft","published"}, example="published"),
     *             @OA\Property(property="create_scholarlab_project", type="boolean", example=true),
     *             @OA\Property(property="tags", type="array", @OA\Items(type="string"), example={"AI", "Machine Learning", "Research"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Project created successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Project")
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
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
                'field_of_research' => 'required',
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

            if ($request->has('create_scholarlab_project')) {
                $validated['create_scholarlab_project'] = filter_var($request->create_scholarlab_project, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }

            if ($request->has('tags') && is_array($request->tags)) {
                $validated['tags'] = json_encode($request->tags);
            }

            $project = $this->postProjectService->createProject($validated);

            return new PostProjectResource($project);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/v1/projects/{id}",
     *     summary="Update an existing project",
     *     tags={"Content Management - Projects"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","description","project_theme","purpose","sponsored_by","category","field_of_research","email","origin_country","amount"},
     *             @OA\Property(property="title", type="string", example="Updated AI Research Project"),
     *             @OA\Property(property="description", type="string", example="Updated advanced research project in artificial intelligence"),
     *             @OA\Property(property="project_theme", type="string", example="Machine Learning"),
     *             @OA\Property(property="purpose", type="string", example="Research and Development"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2024-01-01"),
     *             @OA\Property(property="end_date", type="string", format="date", example="2024-12-31"),
     *             @OA\Property(property="application_deadline", type="string", format="date", example="2023-11-30"),
     *             @OA\Property(property="duration", type="string", example="12 months"),
     *             @OA\Property(property="sponsored_by", type="string", example="Tech Corporation"),
     *             @OA\Property(property="category", type="string", example="Research"),
     *             @OA\Property(property="field_of_research", type="array", @OA\Items(type="string"), example={"Computer Science", "AI"}),
     *             @OA\Property(property="supervisor_category", type="string", example="Professor"),
     *             @OA\Property(property="supervisor_name", type="string", example="Dr. John Smith"),
     *             @OA\Property(property="university", type="integer", example=1),
     *             @OA\Property(property="email", type="string", format="email", example="contact@techcorp.com"),
     *             @OA\Property(property="origin_country", type="string", example="United States"),
     *             @OA\Property(property="student_nationality", type="string", example="International"),
     *             @OA\Property(property="student_level", type="string", example="PhD"),
     *             @OA\Property(property="student_mode_study", type="string", example="Full-time"),
     *             @OA\Property(property="appointment_type", type="string", example="Research Assistant"),
     *             @OA\Property(property="purpose_of_collaboration", type="string", example="Academic Research"),
     *             @OA\Property(property="amount", type="number", example=50000),
     *             @OA\Property(property="application_url", type="string", format="uri", example="https://techcorp.com/apply"),
     *             @OA\Property(property="project_status", type="string", enum={"draft","published"}, example="published")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project updated successfully",
     *         @OA\JsonContent(ref="#/components/schemas/Project")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project not found"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        try {
            $postProject = auth()->user()->postProjects()->findOrFail($id);
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
                'field_of_research' => 'required',
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

            $updatedProject = $this->postProjectService->updateProject($postProject, $validated);

            return new PostProjectResource($updatedProject);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/projects/{id}",
     *     summary="Delete a project",
     *     tags={"Content Management - Projects"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Project ID",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Project deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Project deleted successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Project not found"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated"
     *     )
     * )
     */
    public function destroy($id)
    {
        $postProject = auth()->user()->postProjects()->findOrFail($id);
        $this->postProjectService->deleteProject($postProject);

        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }
} 