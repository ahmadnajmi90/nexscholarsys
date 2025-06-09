<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\WorkspaceResource;
use App\Models\Workspace;
use App\Models\Board;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;

class ProjectHubController extends Controller
{
    /**
     * Display the Project Hub index page.
     */
    public function index(Request $request)
    {
        // Fetch all workspaces for the authenticated user
        $workspaces = $request->user()->workspaces()->with('owner')->get();
        
        // Transform them with the resource to ensure consistent format
        $workspacesResource = WorkspaceResource::collection($workspaces);
        
        return Inertia::render('ProjectHub/Index', [
            'workspaces' => $workspacesResource,
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
        
        // Load the workspace with all its boards and owners
        $workspace->load(['owner', 'boards' => function($query) {
            $query->orderBy('created_at');
        }]);
        
        return Inertia::render('ProjectHub/Workspace/Show', [
            'workspace' => new WorkspaceResource($workspace),
        ]);
    }
    
    /**
     * Display a board with its lists and tasks.
     */
    public function showBoard(Board $board)
    {
        // Authorize that the user can view this board
        $this->authorize('view', $board);
        
        // Load the board with its workspace, lists, and tasks
        $board->load([
            'workspace.members',
            'lists' => function($query) {
                $query->orderBy('order');
            },
            'lists.tasks' => function($query) {
                $query->orderBy('order');
            },
            'lists.tasks.assignees',
            'lists.tasks.comments.user.academician',
            'lists.tasks.comments.user.postgraduate',
            'lists.tasks.comments.user.undergraduate',
            'lists.tasks.creator',
            'lists.tasks.attachments'
        ]);
        
        // Transform the board data to a suitable format for the frontend
        $initialBoardData = [
            'id' => $board->id,
            'name' => $board->name,
            'workspace' => [
                'id' => $board->workspace->id,
                'name' => $board->workspace->name,
                'members' => $board->workspace->members->map(function($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'email' => $member->email,
                        'avatar_url' => $member->profile_photo_url,
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
                            'assignees' => $task->assignees,
                            'creator' => $task->creator ? [
                                'id' => $task->creator->id,
                                'name' => $task->creator->name,
                                'avatar_url' => $task->creator->profile_photo_url,
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
                        ];
                    })
                ];
            })
        ];
        
        return Inertia::render('ProjectHub/Board/Show', [
            'initialBoardData' => $initialBoardData,
            'workspace' => new WorkspaceResource($board->workspace),
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
} 