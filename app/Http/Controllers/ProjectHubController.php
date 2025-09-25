<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\WorkspaceResource;
use App\Http\Resources\ProjectResource;
use App\Models\Workspace;
use App\Models\Board;
use App\Models\Connection;
use App\Models\FieldOfResearch;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use App\Models\Project;

class ProjectHubController extends Controller
{
    /**
     * Display the Project Hub index page.
     */
    // public function index(Request $request)
    // {
    //     // Load the academician relationship for the authenticated user
    //     $request->user()->load('academician');
        
    //     // Fetch all workspaces for the authenticated user with members relationship
    //     $workspaces = $request->user()->workspaces()
    //         ->with([
    //             'owner',
    //             'owner.academician',
    //             'owner.postgraduate',
    //             'owner.undergraduate',
    //             'members',
    //             'members.academician',
    //             'members.postgraduate',
    //             'members.undergraduate'
    //         ])
    //         ->get();
        
    //     // Fetch projects for the authenticated user
    //     $projects = \App\Models\Project::where('owner_id', $request->user()->id)
    //         ->with([
    //             'owner',
    //             'owner.academician',
    //             'owner.postgraduate',
    //             'owner.undergraduate',
    //             'postProject',
    //             'boards',
    //             'members.academician',
    //             'members.postgraduate',
    //             'members.undergraduate'
    //         ])
    //         ->get();
        
    //     // Fetch post projects that can be linked (not already linked to a ScholarLab project)
    //     $linkableProjects = \App\Models\PostProject::where('author_id', $request->user()->id)
    //         ->whereDoesntHave('scholarLabProject')
    //         ->get();
            
    //     // Get the authenticated user's accepted connections
    //     // First get the friends with their IDs
    //     $friendIds = $request->user()->getFriends()->pluck('id');
        
    //     // Then fetch the users with eager loaded relationships
    //     $connections = \App\Models\User::whereIn('id', $friendIds)
    //         ->with(['academician', 'postgraduate', 'undergraduate'])
    //         ->get();
        
    //     return Inertia::render('ProjectHub/Index', [
    //         'workspaces' => $workspaces, // Pass raw workspaces collection to match projects
    //         'projects' => $projects,
    //         'linkableProjects' => $linkableProjects,
    //         'connections' => $connections, // Pass connections to the frontend
    //     ]);
    // }

    public function index(Request $request)
    {
        $user = $request->user()->loadMissing('academician.scholarProfile', 'academician.publications'); // Load auth user's profile with scholar profile and publications
        
        // If the user has an academician profile, add the extra data to it.
        if ($user->academician) {
            // We create new properties on the academician object that will be serialized to JSON.
            $user->academician->scholar_profile = $user->academician->scholarProfile;
            $user->academician->total_publications = $user->academician->publications->count();
        }
        
        // Fetch WORKSPACES with all necessary nested data
        $workspaces = $user->workspaces()
            ->with([
                'owner.academician.scholarProfile', 'owner.postgraduate', 'owner.undergraduate',
                'members' => function($query) {
                    $query->withPivot('role');
                },
                'members.academician.scholarProfile', 'members.postgraduate', 'members.undergraduate'
            ])
            ->latest()
            ->get();
        
        // Fetch PROJECTS with all necessary nested data (including owned projects)
        // Get projects where user is a member
        $memberProjects = $user->projects()
            ->with([
                'owner.academician.scholarProfile', 'owner.postgraduate', 'owner.undergraduate',
                'postProject',
                'boards.members', // Add eager loading for board members
                'members' => function($query) {
                    $query->withPivot('role');
                },
                'members.academician.scholarProfile', 'members.postgraduate', 'members.undergraduate'
            ])
            ->latest()
            ->get();
        
        // Get projects where user is the owner
        $ownedProjects = Project::where('owner_id', $user->id)
            ->with([
                'owner.academician.scholarProfile', 'owner.postgraduate', 'owner.undergraduate',
                'postProject',
                'boards.members', // Add eager loading for board members
                'members' => function($query) {
                    $query->withPivot('role');
                },
                'members.academician.scholarProfile', 'members.postgraduate', 'members.undergraduate'
            ])
            ->latest()
            ->get();
        
        // Merge owned and member projects, removing duplicates by ID
        $projects = $ownedProjects->merge($memberProjects)->unique('id')->values();
        
        // Fetch other necessary data
        $linkableProjects = \App\Models\PostProject::where('author_id', $user->unique_id)
            ->whereDoesntHave('scholarLabProject')
            ->whereJsonDoesntContain('purpose', 'For Showcase')
            ->get();
            
        // Find the Collaborator tag
        $collaboratorTag = \App\Models\ConnectionTag::where('name', 'Collaborator')->first();
        
        if ($collaboratorTag) {
            // Get connections where this user is the requester, status is accepted, and has Collaborator tag
            $requestedConnections = \App\Models\Connection::where('requester_id', $user->id)
                ->where('status', 'accepted')
                ->whereHas('tags', function($query) use ($user, $collaboratorTag) {
                    $query->where('connection_tags.id', $collaboratorTag->id)
                          ->where('connection_tag_user.user_id', $user->id);
                })
                ->with(['recipient.academician.scholarProfile', 'recipient.postgraduate', 'recipient.undergraduate'])
                ->get()
                ->pluck('recipient.id');
                
            // Get connections where this user is the recipient, status is accepted, and has Collaborator tag
            $receivedConnections = \App\Models\Connection::where('recipient_id', $user->id)
                ->where('status', 'accepted')
                ->whereHas('tags', function($query) use ($user, $collaboratorTag) {
                    $query->where('connection_tags.id', $collaboratorTag->id)
                          ->where('connection_tag_user.user_id', $user->id);
                })
                ->with(['requester.academician.scholarProfile', 'requester.postgraduate', 'requester.undergraduate'])
                ->get()
                ->pluck('requester.id');
                
            // Merge the IDs
            $friendIds = $requestedConnections->merge($receivedConnections);
        } else {
            // Fallback if Collaborator tag doesn't exist - use all connections
            $friendIds = $user->getFriends()->pluck('id');
        }
        
        // Then fetch the users with eager loaded relationships
        $connections = \App\Models\User::whereIn('id', $friendIds)
            ->with(['academician.scholarProfile', 'postgraduate', 'undergraduate'])
            ->get();
        
        // Transform collections using API Resources
        return Inertia::render('ProjectHub/Index', [
            'workspaces' => WorkspaceResource::collection($workspaces),
            'projects' => ProjectResource::collection($projects),
            'linkableProjects' => $linkableProjects,
            'connections' => $connections,
        ]);
    }
    
    /**
     * Store a newly created workspace.
     * This is a fallback method for the API route.
     */
    public function storeWorkspace(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        
        $user = $request->user();
        
        $workspace = DB::transaction(function () use ($validated, $user) {
            // Create the workspace with the current user as owner
            $workspace = Workspace::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'owner_id' => $user->id,
            ]);
            
            // Add the owner as an admin member
            $workspace->members()->attach($user->id, ['role' => 'admin']);
            
            return $workspace;
        });
        
        // Load the owner relationship for the resource
        $workspace->load('owner');
        
        if ($request->wantsJson()) {
            return (new WorkspaceResource($workspace))
                ->response()
                ->setStatusCode(Response::HTTP_CREATED);
        }
        
        return redirect()->route('project-hub.index');
    }
    
    /**
     * Display a workspace and its boards.
     */
    public function showWorkspace(Workspace $workspace)
    {
        // Authorize that the user can view this workspace
        $this->authorize('view', $workspace);
        
        $userId = Auth::id();
        
        // Load the workspace with all its boards and owners
        $workspace->load([
            'owner.academician.scholarProfile', 'owner.postgraduate', 'owner.undergraduate',
            'boards' => function($query) use ($userId) {
                $query->orderBy('created_at')
                      ->whereHas('members', function ($query) use ($userId) {
                          $query->where('user_id', $userId);
                      })
                      ->with('members'); // Add eager loading for board members
            },
            'members' => function($query) {
                $query->withPivot('role');
            },
            'members.academician.scholarProfile', 'members.postgraduate', 'members.undergraduate'
        ]);
        
        // Filter out the workspace owner from the members collection
        // This creates a new filtered collection that excludes the owner
        $manageableMembers = $workspace->members->filter(function ($member) use ($workspace) {
            return $member->id !== $workspace->owner_id;
        })->values(); // Reset array keys
        
        // Replace the members collection with the filtered one
        $workspace->setRelation('members', $manageableMembers);
        
        // Get the auth user's accepted connections to populate the invite list
        $userId = Auth::id();
        
        // Find the Collaborator tag
        $collaboratorTag = \App\Models\ConnectionTag::where('name', 'Collaborator')->first();
        
        if ($collaboratorTag) {
            // Get connections where this user is the requester, status is accepted, and has Collaborator tag
            $requestedConnections = \App\Models\Connection::where('requester_id', $userId)
                ->where('status', 'accepted')
                ->whereHas('tags', function($query) use ($userId, $collaboratorTag) {
                    $query->where('connection_tags.id', $collaboratorTag->id)
                          ->where('connection_tag_user.user_id', $userId);
                })
                ->with(['recipient.academician.scholarProfile', 'recipient.postgraduate', 'recipient.undergraduate'])
                ->get()
                ->pluck('recipient');
                
            // Get connections where this user is the recipient, status is accepted, and has Collaborator tag
            $receivedConnections = \App\Models\Connection::where('recipient_id', $userId)
                ->where('status', 'accepted')
                ->whereHas('tags', function($query) use ($userId, $collaboratorTag) {
                    $query->where('connection_tags.id', $collaboratorTag->id)
                          ->where('connection_tag_user.user_id', $userId);
                })
                ->with(['requester.academician.scholarProfile', 'requester.postgraduate', 'requester.undergraduate'])
                ->get()
                ->pluck('requester');
        } else {
            // Fallback if Collaborator tag doesn't exist - use regular connections
            $requestedConnections = \App\Models\Connection::where('requester_id', $userId)
                ->where('status', 'accepted')
                ->with(['recipient.academician.scholarProfile', 'recipient.postgraduate', 'recipient.undergraduate'])
                ->get()
                ->pluck('recipient');
                
            $receivedConnections = \App\Models\Connection::where('recipient_id', $userId)
                ->where('status', 'accepted')
                ->with(['requester.academician.scholarProfile', 'requester.postgraduate', 'requester.undergraduate'])
                ->get()
                ->pluck('requester');
        }
        
        // Merge both collections
        $connections = $requestedConnections->merge($receivedConnections);
        
        // Get the IDs of users who are already members of this workspace
        $memberIds = $workspace->members()->pluck('users.id');
        
        // Filter out users who are already members of the workspace
        $connections = $connections->whereNotIn('id', $memberIds);
        
        // Note: We don't need to explicitly load profiles here since they are already
        // eager-loaded in the with() clauses above for both requestedConnections and receivedConnections
        
        return Inertia::render('ProjectHub/Workspace/Show', [
            'workspace' => new WorkspaceResource($workspace),
            'connections' => $connections, // Pass filtered connections to the frontend
        ]);
    }
    
    /**
     * Display a board with its lists and tasks.
     */
    public function showBoard(Board $board)
    {
        // Load the boardable relationship to determine what this board belongs to
        $board->load('boardable');
        
        // Authorize that the user can view the boardable (project or workspace)
        $this->authorize('view', $board->boardable);
        
        // Load the board with its lists and tasks
        $board->load([
            'boardable',
            'lists' => function($query) {
                $query->orderBy('order');
            },
            'lists.tasks' => function($query) {
                $query->orderBy('order');
            },
            'lists.tasks.assignees.academician',
            'lists.tasks.assignees.postgraduate', 
            'lists.tasks.assignees.undergraduate',
            'lists.tasks.comments.user.academician',
            'lists.tasks.comments.user.postgraduate',
            'lists.tasks.comments.user.undergraduate',
            'lists.tasks.creator.academician',
            'lists.tasks.creator.postgraduate',
            'lists.tasks.creator.undergraduate',
            'lists.tasks.attachments',
            'lists.tasks.paperWritingTask'
        ]);
        
        // Get the parent entity (workspace or project)
        $parentEntity = $board->boardable;
        $parentType = class_basename($parentEntity);
        
        // Get members based on the parent entity type with role-specific relationships
        $members = [];
        if ($parentType === 'Workspace') {
            $parentEntity->load(['members.academician.scholarProfile', 'members.postgraduate', 'members.undergraduate']);
            $members = $parentEntity->members;
        } elseif ($parentType === 'Project') {
            $parentEntity->load(['members.academician.scholarProfile', 'members.postgraduate', 'members.undergraduate']);
            $members = $parentEntity->members;
        }
        
        // Transform the board data to a suitable format for the frontend
        $initialBoardData = [
            'id' => $board->id,
            'name' => $board->name,
            'parent' => [
                'id' => $parentEntity instanceof Model ? $parentEntity->getKey() : null,
                'name' => $parentEntity->name ?? 'Unknown',
                'type' => $parentType,
                'members' => $members->map(function($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'email' => $member->email,
                        'avatar_url' => $member->profile_photo_url,
                        'academician' => $member->academician ? [
                            'full_name' => $member->academician->full_name,
                            'profile_picture' => $member->academician->profile_picture,
                        ] : null,
                        'postgraduate' => $member->postgraduate ? [
                            'full_name' => $member->postgraduate->full_name,
                            'profile_picture' => $member->postgraduate->profile_picture,
                        ] : null,
                        'undergraduate' => $member->undergraduate ? [
                            'full_name' => $member->undergraduate->full_name,
                            'profile_picture' => $member->undergraduate->profile_picture,
                        ] : null,
                    ];
                })
            ],
            'lists' => $board->lists->map(function($list) {
                return [
                    'id' => $list->id,
                    'name' => $list->name,
                    'order' => $list->order,
                    'tasks' => $list->tasks->map(function($task) {
                        return [
                            'id' => $task->id,
                            'title' => $task->title,
                            'description' => $task->description,
                            'order' => $task->order,
                            'due_date' => $task->due_date,
                            'priority' => $task->priority,
                            'assignees' => $task->assignees->map(function($assignee) {
                                return [
                                    'id' => $assignee->id,
                                    'name' => $assignee->name,
                                    'email' => $assignee->email,
                                    'avatar_url' => $assignee->profile_photo_url,
                                    'academician' => $assignee->academician ? [
                                        'full_name' => $assignee->academician->full_name,
                                        'profile_picture' => $assignee->academician->profile_picture,
                                    ] : null,
                                    'postgraduate' => $assignee->postgraduate ? [
                                        'full_name' => $assignee->postgraduate->full_name,
                                        'profile_picture' => $assignee->postgraduate->profile_picture,
                                    ] : null,
                                    'undergraduate' => $assignee->undergraduate ? [
                                        'full_name' => $assignee->undergraduate->full_name,
                                        'profile_picture' => $assignee->undergraduate->profile_picture,
                                    ] : null,
                                ];
                            }),
                            'creator' => $task->creator ? [
                                'id' => $task->creator->id,
                                'name' => $task->creator->name,
                                'avatar_url' => $task->creator->profile_photo_url,
                                'full_name' => $task->creator->academician->full_name 
                                            ?? $task->creator->postgraduate->full_name 
                                            ?? $task->creator->undergraduate->full_name 
                                            ?? $task->creator->name,
                                'academician' => $task->creator->academician ? [
                                    'full_name' => $task->creator->academician->full_name,
                                    'profile_picture' => $task->creator->academician->profile_picture,
                                ] : null,
                                'postgraduate' => $task->creator->postgraduate ? [
                                    'full_name' => $task->creator->postgraduate->full_name,
                                    'profile_picture' => $task->creator->postgraduate->profile_picture,
                                ] : null,
                                'undergraduate' => $task->creator->undergraduate ? [
                                    'full_name' => $task->creator->undergraduate->full_name,
                                    'profile_picture' => $task->creator->undergraduate->profile_picture,
                                ] : null,
                            ] : null,
                            'paper_writing_task' => $task->paperWritingTask ? [
                                'id' => $task->paperWritingTask->id,
                                'area_of_study' => $task->paperWritingTask->area_of_study,
                                'paper_type' => $task->paperWritingTask->paper_type,
                                'publication_type' => $task->paperWritingTask->publication_type,
                                'scopus_info' => $task->paperWritingTask->scopus_info,
                                'progress' => $task->paperWritingTask->progress,
                                'created_at' => $task->paperWritingTask->created_at,
                                'updated_at' => $task->paperWritingTask->updated_at,
                            ] : null,
                            'comments' => $task->comments->map(function($comment) {
                                $profile = $comment->user->academician ?? $comment->user->postgraduate ?? $comment->user->undergraduate ?? null;
                                
                                return [
                                    'id' => $comment->id,
                                    'content' => $comment->content,
                                    'created_at' => $comment->created_at,
                                    'user' => [
                                        'id' => $comment->user->id,
                                        'name' => $comment->user->name,
                                        'avatar_url' => $comment->user->profile_photo_url,
                                        'academician' => $comment->user->academician ? [
                                            'full_name' => $comment->user->academician->full_name,
                                            'profile_picture' => $comment->user->academician->profile_picture,
                                        ] : null,
                                        'postgraduate' => $comment->user->postgraduate ? [
                                            'full_name' => $comment->user->postgraduate->full_name,
                                            'profile_picture' => $comment->user->postgraduate->profile_picture,
                                        ] : null,
                                        'undergraduate' => $comment->user->undergraduate ? [
                                            'full_name' => $comment->user->undergraduate->full_name,
                                            'profile_picture' => $comment->user->undergraduate->profile_picture,
                                        ] : null,
                                    ]
                                ];
                            }),
                            'comments_count' => $task->comments->count(),
                            'attachments' => $task->attachments->map(function($attachment) {
                                return [
                                    'id' => $attachment->id,
                                    'original_name' => $attachment->original_name,
                                    'size' => $attachment->size,
                                    'size_formatted' => $this->formatFileSize($attachment->size),
                                    'mime_type' => $attachment->mime_type,
                                    'url' => asset('storage/' . $attachment->file_path),
                                    'created_at' => $attachment->created_at,
                                ];
                            }),
                            'list_id' => $task->board_list_id,
                            'created_at' => $task->created_at,
                            'updated_at' => $task->updated_at,
                            'completed_at' => $task->completed_at,
                        ];
                    })
                ];
            })
        ];
        
        // Create a resource for the parent entity
        $parentResource = null;
        if ($parentType === 'Workspace') {
            $parentResource = new WorkspaceResource($parentEntity);
        } elseif ($parentType === 'Project') {
            // If you have a ProjectResource, use it here
            // $parentResource = new ProjectResource($parentEntity);
            $parentResource = $parentEntity;
        }
        
        // Load research field options for Paper Writing Tasks
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
        
        return Inertia::render('ProjectHub/Board/Show', [
            'initialBoardData' => $initialBoardData,
            'parentEntity' => $parentResource,
            'parentType' => $parentType,
            'researchOptions' => $researchOptions,
        ]);
    }
    
    /**
     * Format file size into human-readable format.
     *
     * @param int $bytes
     * @return string
     */
    private function formatFileSize(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }
    
    /**
     * Store a newly created project.
     */
    public function storeProject(Request $request)
    {
        // Authorize that the user can create a project
        $this->authorize('create', \App\Models\Project::class);
        
        // Validate that a valid, unlinked PostProject was selected
        $validated = $request->validate([
            'post_project_id' => 'required|unique:projects|exists:post_projects,id',
        ]);
        
        // Find the selected publication
        $postProject = \App\Models\PostProject::find($validated['post_project_id']);
        
        // Create the new ScholarLab Project
        $project = \App\Models\Project::create([
            // Copy the name and description from the publication
            'name' => $postProject->title,
            'description' => $postProject->description,
            'owner_id' => Auth::id(),
            'post_project_id' => $postProject->id, // Create the link
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
        
        return redirect()->route('project-hub.index')->with('success', 'Project created successfully.');
    }

    /**
     * Update the specified project in storage.
     */
    public function updateProject(Request $request, Project $scholar_project)
    {
        // Authorize that the user can update this project
        $this->authorize('update', $scholar_project);

        // Validate the incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Update the project
        $scholar_project->update($validated);

        // Optionally, you can broadcast an event for real-time updates
        // broadcast(new ProjectUpdated($scholar_project, $request->user()))->toOthers();

        // Return JSON response for AJAX calls (Inertia)
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Project updated successfully.',
                'project' => new ProjectResource($scholar_project)
            ]);
        }

        return redirect()->back()->with('success', 'Project updated successfully.');
    }
    
    /**
     * Display a project and its boards.
     */
    public function showProject(\App\Models\Project $scholar_project)
    {
        // Authorize that the user can view this project
        $this->authorize('view', $scholar_project);
        
        $userId = Auth::id();
        
        // Load the project with all its boards, lists, tasks, and related data
        $scholar_project->load([
            'owner.academician', 'owner.postgraduate', 'owner.undergraduate',
            'boards' => function($query) use ($userId) {
                $query->orderBy('created_at')
                      ->whereHas('members', function ($query) use ($userId) {
                          $query->where('user_id', $userId);
                      })
                      ->with([
                          'members',
                          'lists' => function($query) {
                              $query->orderBy('order');
                          },
                          'lists.tasks' => function($query) {
                              $query->orderBy('order');
                          },
                          'lists.tasks.assignees.academician',
                          'lists.tasks.assignees.postgraduate',
                          'lists.tasks.assignees.undergraduate',
                          'lists.tasks.comments.user.academician',
                          'lists.tasks.comments.user.postgraduate',
                          'lists.tasks.comments.user.undergraduate',
                          'lists.tasks.creator.academician',
                          'lists.tasks.creator.postgraduate',
                          'lists.tasks.creator.undergraduate',
                          'lists.tasks.attachments',
                          'lists.tasks.paperWritingTask'
                      ]);
            },
            'members' => function($query) {
                $query->withPivot('role');
            },
            'members.academician', 'members.postgraduate', 'members.undergraduate'
        ]);
        
        // Filter out the project owner from the members collection
        // This creates a new filtered collection that excludes the owner
        $manageableMembers = $scholar_project->members->filter(function ($member) use ($scholar_project) {
            return $member->id !== $scholar_project->owner_id;
        })->values(); // Reset array keys
        
        // Replace the members collection with the filtered one
        $scholar_project->setRelation('members', $manageableMembers);
        
        // Get the authenticated user
        $user = Auth::user();
        $userId = $user->id;
        
        // Find the Collaborator tag
        $collaboratorTag = \App\Models\ConnectionTag::where('name', 'Collaborator')->first();
        
        if ($collaboratorTag) {
            // Get connections where this user is the requester, status is accepted, and has Collaborator tag
            $requestedConnections = Connection::where('requester_id', $userId)
                ->where('status', 'accepted')
                ->whereHas('tags', function($query) use ($userId, $collaboratorTag) {
                    $query->where('connection_tags.id', $collaboratorTag->id)
                          ->where('connection_tag_user.user_id', $userId);
                })
                ->with(['recipient.academician', 'recipient.postgraduate', 'recipient.undergraduate'])
                ->get()
                ->pluck('recipient');
                
            // Get connections where this user is the recipient, status is accepted, and has Collaborator tag
            $receivedConnections = Connection::where('recipient_id', $userId)
                ->where('status', 'accepted')
                ->whereHas('tags', function($query) use ($userId, $collaboratorTag) {
                    $query->where('connection_tags.id', $collaboratorTag->id)
                          ->where('connection_tag_user.user_id', $userId);
                })
                ->with(['requester.academician', 'requester.postgraduate', 'requester.undergraduate'])
                ->get()
                ->pluck('requester');
        } else {
            // Fallback if Collaborator tag doesn't exist - use regular connections
            $requestedConnections = Connection::where('requester_id', $userId)
                ->where('status', 'accepted')
                ->with(['recipient.academician', 'recipient.postgraduate', 'recipient.undergraduate'])
                ->get()
                ->pluck('recipient');
                
            $receivedConnections = Connection::where('recipient_id', $userId)
                ->where('status', 'accepted')
                ->with(['requester.academician', 'requester.postgraduate', 'requester.undergraduate'])
                ->get()
                ->pluck('requester');
        }
        
        // Merge both collections
        $connections = $requestedConnections->merge($receivedConnections);
        
        return Inertia::render('ProjectHub/Project/Show', [
            'project' => new ProjectResource($scholar_project),
            'connections' => $connections, // Pass connections to the view
        ]);
    }

    /**
     * Remove the specified project from storage.
     */
    public function destroyProject(\App\Models\Project $scholar_project)
    {
        // Authorize that the user can delete this project
        $this->authorize('delete', $scholar_project);
        
        // Delete the project
        $scholar_project->delete();
        
        return redirect()->route('project-hub.index')->with('success', 'Project deleted successfully.');
    }
} 