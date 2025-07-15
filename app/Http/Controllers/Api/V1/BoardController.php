<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BoardResource;
use App\Models\Board;
use App\Models\Workspace;
use App\Models\Project;
use App\Notifications\BoardDeletedNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

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
        
        return redirect()->back()->with('success', 'Board created successfully.');
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
        
        return redirect()->back()->with('success', 'Board created successfully.');
    }
    
    /**
     * Display the specified board.
     */
    public function show(Board $board)
    {
        $this->authorize('view', $board);
        
        // Eager load lists with their tasks
        $board->load('lists.tasks');
        
        return new BoardResource($board);
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
        
        return new BoardResource($board);
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
        
        return back()->with('success', 'Board deleted successfully.');
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
            return response()->json(['message' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
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

        return response()->json(['message' => 'Board access updated successfully.']);
    }
} 