<?php

namespace App\Http\Controllers\ProjectHub;

use App\Http\Controllers\Controller;
use App\Http\Resources\BoardResource;
use App\Models\Board;
use App\Models\Workspace;
use App\Models\Project;
use App\Notifications\BoardDeletedNotification;
use App\Events\BoardUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Models\FieldOfResearch;

class BoardController extends Controller
{
    /**
     * Store a newly created board in the workspace.
     */
    public function storeForWorkspace(Request $request, Workspace $workspace)
    {
        $this->authorize('create', [Board::class, $workspace]);
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255',
                      \Illuminate\Validation\Rule::unique('boards')
                          ->where('boardable_id', $workspace->id)
                          ->where('boardable_type', get_class($workspace))],
        ]);
        
        $board = $workspace->boards()->create([
            'name' => $validated['name'],
            'creator_id' => Auth::id(),
        ]);
        
        // Auto-assign both the creator and workspace owner to the board
        $board->members()->syncWithoutDetaching([
            Auth::id(),
            $workspace->owner_id
        ]);
        
        return Redirect::back()->with('success', 'Board created successfully.');
    }
    
    /**
     * Store a newly created board in the project.
     */
    public function storeForProject(Request $request, Project $project)
    {
        $this->authorize('create', [Board::class, $project]);
        
        // Check if project is for showcase
        if ($project->postProject && is_array($project->postProject->purpose) && in_array('For Showcase', $project->postProject->purpose)) {
            abort(403, 'Boards cannot be created for showcase projects');
        }
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255',
                      \Illuminate\Validation\Rule::unique('boards')
                          ->where('boardable_id', $project->id)
                          ->where('boardable_type', get_class($project))],
        ]);
        
        $board = $project->boards()->create([
            'name' => $validated['name'],
            'creator_id' => Auth::id(),
        ]);
        
        // Auto-assign both the creator and project owner to the board
        $board->members()->syncWithoutDetaching([
            Auth::id(),
            $project->owner_id
        ]);
        
        return Redirect::back()->with('success', 'Board created successfully.');
    }
    
    /**
     * Display the specified board.
     */
    public function show(Board $board)
    {
        $this->authorize('view', $board);
        
        // Eager load all necessary relationships with proper ordering and nesting
        $board->load([
            'lists' => function ($query) {
                $query->orderBy('order');
            },
            'lists.tasks' => function ($query) {
                $query->whereNull('archived_at')->orderBy('order');
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
            'lists.tasks.paperWritingTask',
            'boardable',  // Load the parent entity (workspace or project)
            'boardable.members.academician',
            'boardable.members.postgraduate',
            'boardable.members.undergraduate'
        ]);

        // Get the parent entity data
        $parentEntity = $board->boardable;
        $parentType = $parentEntity instanceof Workspace ? 'workspace' : 'project';
        
        // Get the members and owner of the parent entity
        $members = $parentEntity->members;
        $owner = $parentEntity->owner;
        
        // Add the owner to the members collection if they are not already in it
        if ($owner && !$members->contains('id', $owner->id)) {
            $members->push($owner);
        }

        // Get all research options with their relationships
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
            'initialBoardData' => array_merge((new BoardResource($board))->toArray(request()), [
                'parent' => [
                    'id' => $parentEntity->id,
                    'name' => $parentEntity->name,
                    'type' => $parentType,
                    'members' => $members->map(function($member) {
                        return [
                            'id' => $member->id,
                            'name' => $member->name,
                            'email' => $member->email,
                            'academician' => $member->academician,
                            'postgraduate' => $member->postgraduate,
                            'undergraduate' => $member->undergraduate
                        ];
                    })
                ]
            ]),
            'researchOptions' => $researchOptions
        ]);
    }

    /**
     * Return archived tasks for a board as JSON.
     */
    public function showArchived(Board $board)
    {
        $this->authorize('view', $board);

        $archivedTasks = \App\Models\Task::whereHas('list', function ($q) use ($board) {
                $q->where('board_id', $board->id);
            })
            ->whereNotNull('archived_at')
            ->with('list')
            ->orderByDesc('archived_at')
            ->paginate(20);

        $archivedTasks->getCollection()->transform(function ($task) {
            $task->list_name = $task->list ? $task->list->name : 'Unknown List';
            return $task;
        });

        return response()->json($archivedTasks);
    }
    
    /**
     * Update the specified board.
     */
    public function update(Request $request, Board $board)
    {
        $this->authorize('update', $board);
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255',
                      \Illuminate\Validation\Rule::unique('boards')
                          ->where('boardable_id', $board->boardable_id)
                          ->where('boardable_type', $board->boardable_type)
                          ->ignore($board->id)],
        ]);
        
        $board->update([
            'name' => $validated['name'],
        ]);

        // Broadcast the update event for real-time updates
        broadcast(new BoardUpdated($board, $request->user(), 'renamed'))->toOthers();

        // Return JSON response for AJAX calls (Inertia)
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Board updated successfully.',
                'board' => $board
            ]);
        }

        return Redirect::back()->with('success', 'Board updated successfully.');
    }
    
    /**
     * Remove the specified board.
     */
    public function destroy(Board $board)
    {
        $this->authorize('delete', $board);
        
        // Get board details before deletion
        $boardName = $board->name;
        $deletedByUser = request()->user();
        
        // Get the parent entity (workspace or project)
        $boardable = $board->boardable;
        $parentName = $boardable ? $boardable->name : 'Unknown';
        $parentType = $boardable instanceof Workspace ? 'workspace' : 'project';
        $parentId = $boardable ? $boardable->id : 0;
        
        // Get board members to notify (excluding the user who is deleting)
        $membersToNotify = $board->members()
            ->where('users.id', '!=', $deletedByUser->id)
            ->get();
        
        // Delete the board
        $board->delete();
        
        // Notify members about the deletion
        foreach ($membersToNotify as $member) {
            $member->notify(new BoardDeletedNotification(
                $boardName,
                $parentName,
                $parentType,
                $deletedByUser->name,
                $parentId
            ));
        }
        
        return Redirect::back()->with('success', 'Board deleted successfully.');
    }
    
    /**
     * Sync the members of a board.
     */
    public function syncMembers(Request $request, Board $board)
    {
        // You should add authorization here to ensure only workspace/project admins can do this
        // $this->authorize('manageMembers', $board);
        
        // For now, we'll check if the user is the owner of the parent entity
        $boardable = $board->boardable;
        if (!$boardable || $boardable->owner_id !== Auth::id()) {
            return Redirect::back()->with('error', 'Unauthorized');
        }

        $validated = $request->validate([
            'user_ids' => 'present|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        // Always include the owner of the parent entity in the sync
        $userIds = array_unique(
            array_merge($validated['user_ids'], [$boardable->owner_id])
        );

        // sync() is perfect: it adds new users, removes unchecked ones, and leaves existing ones.
        $board->members()->sync($userIds);

        return Redirect::back()->with('success', 'Board access updated successfully.');
    }
}