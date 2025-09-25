<?php

namespace App\Http\Controllers\ProjectHub;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkspaceResource;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Connection;
use App\Models\ConnectionTag;
use App\Notifications\WorkspaceInvitationReceived;
use App\Notifications\WorkspaceDeletedNotification;
use App\Notifications\RoleChangedNotification;
use App\Notifications\RemovedFromWorkspaceNotification;
use App\Events\WorkspaceUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of the workspaces for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get all workspaces where the user is a member
        $workspaces = $user->workspaces()
            ->with('owner')
            ->get();
        
        return Inertia::render('ProjectHub/Workspace/Index', [
            'workspaces' => WorkspaceResource::collection($workspaces)
        ]);
    }

    /**
     * Store a newly created workspace in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255',
                      \Illuminate\Validation\Rule::unique('workspaces')
                          ->where('owner_id', $request->user()->id)],
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
        
        return Redirect::route('project-hub.index')
            ->with('success', 'Workspace created successfully.');
    }

    /**
     * Display the specified workspace.
     */
    public function show(Request $request, Workspace $workspace)
    {
        $this->authorize('view', $workspace);
        $user = Auth::user();
        // Load the workspace with all its boards, lists, and tasks
        $workspace->load([
            'owner',
            // Load only the boards that the current user is a member of
            'boards' => function ($query) use ($user) {
                $query->whereHas('members', function ($subQuery) use ($user) {
                    $subQuery->where('users.id', $user->id);
                });
            },
            // Load members, but filter out the owner from this specific list
            'members' => function ($query) use ($workspace) {
                $query->where('users.id', '!=', $workspace->owner_id);
            },
            'boards.members',
            'boards.lists.tasks.assignees',
            'boards.lists.tasks.comments.user',
            'boards.lists.tasks.creator',
            'boards.lists.tasks.attachments',
            'boards.lists.tasks.paperWritingTask'
        ]);
        
        // Get the authenticated user
        $user = $request->user();
        
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
                ->with(['recipient.academician', 'recipient.postgraduate', 'recipient.undergraduate'])
                ->get()
                ->pluck('recipient');
                
            // Get connections where this user is the recipient, status is accepted, and has Collaborator tag
            $receivedConnections = \App\Models\Connection::where('recipient_id', $user->id)
                ->where('status', 'accepted')
                ->whereHas('tags', function($query) use ($user, $collaboratorTag) {
                    $query->where('connection_tags.id', $collaboratorTag->id)
                          ->where('connection_tag_user.user_id', $user->id);
                })
                ->with(['requester.academician', 'requester.postgraduate', 'requester.undergraduate'])
                ->get()
                ->pluck('requester');
        } else {
            // Fallback if Collaborator tag doesn't exist - use regular connections
            $requestedConnections = \App\Models\Connection::where('requester_id', $user->id)
                ->where('status', 'accepted')
                ->with(['recipient.academician', 'recipient.postgraduate', 'recipient.undergraduate'])
                ->get()
                ->pluck('recipient');
                
            $receivedConnections = \App\Models\Connection::where('recipient_id', $user->id)
                ->where('status', 'accepted')
                ->with(['requester.academician', 'requester.postgraduate', 'requester.undergraduate'])
                ->get()
                ->pluck('requester');
        }
        
        // Merge both collections
        $connections = $requestedConnections->merge($receivedConnections);
        
        return Inertia::render('ProjectHub/Workspace/Show', [
            'workspace' => new WorkspaceResource($workspace),
            'connections' => $connections // Pass connections to the view
        ]);
    }

    /**
     * Update the specified workspace in storage.
     */
    public function update(Request $request, Workspace $workspace)
    {
        $this->authorize('update', $workspace);
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255',
                      \Illuminate\Validation\Rule::unique('workspaces')
                          ->where('owner_id', $request->user()->id)
                          ->ignore($workspace->id)],
            'description' => 'nullable|string',
        ]);
        
        $workspace->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        // Broadcast the update event for real-time updates
        broadcast(new WorkspaceUpdated($workspace, $request->user(), 'renamed'))->toOthers();

        // Load the owner for the resource
        $workspace->load('owner');

        // Return JSON response for AJAX calls (Inertia)
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Workspace updated successfully.',
                'workspace' => new WorkspaceResource($workspace)
            ]);
        }

        return Redirect::back()->with('success', 'Workspace updated successfully.');
    }

    /**
     * Remove the specified workspace from storage.
     */
    public function destroy(Workspace $workspace)
    {
        $this->authorize('delete', $workspace);
        
        // Get workspace name and current user before deletion
        $workspaceName = $workspace->name;
        $deletedByUser = request()->user();
        
        // Get members to notify (excluding the current user who is deleting)
        $membersToNotify = $workspace->members()
            ->where('users.id', '!=', $deletedByUser->id)
            ->get();
        
        // Delete the workspace
        $workspace->delete();
        
        // Notify members about the deletion
        foreach ($membersToNotify as $member) {
            $member->notify(new \App\Notifications\WorkspaceDeletedNotification(
                $workspaceName, 
                $deletedByUser->name
            ));
        }
        
        return Redirect::back()->with('success', 'Workspace deleted successfully.');
    }

    /**
     * Add a member to the workspace.
     */
    public function addMember(Request $request, Workspace $workspace)
    {
        // 1. Enforce the "owner-only" rule from the policy
        $this->authorize('addMember', $workspace);
        
        // 2. Validate the incoming data, including the role
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:admin,member',
        ]);
        
        // Optional: Prevent adding the owner as a member again
        if ($workspace->owner_id == $validated['user_id']) {
            return Redirect::back()->with('error', 'The owner is already a member of this workspace.');
        }

        // 3. Attach the new member with their assigned role
        $workspace->members()->syncWithoutDetaching([
            $validated['user_id'] => ['role' => $validated['role']]
        ]);

        // 4. Send invitation notification to the invited user
        $invitedUser = User::with(['academician', 'postgraduate', 'undergraduate'])
            ->find($validated['user_id']);
            
        $invitedUser->notify(new WorkspaceInvitationReceived($workspace, $request->user()));
        
        // 5. Reload the workspace with all members and their profile data
        $workspace->load(['members.academician', 'members.postgraduate', 'members.undergraduate']);
        
        return Redirect::back()->with('success', 'Member added successfully.');
    }

    /**
     * Remove a member from the workspace.
     */
    public function removeMember(Request $request, Workspace $workspace, User $member)
    {
        $this->authorize('removeMember', [$workspace, $member]);
        
        // Prevent removing the owner
        if ($member->id === $workspace->owner_id) {
            return Redirect::back()->with('error', 'Cannot remove the workspace owner.');
        }
        
        // Store workspace name before detaching the member
        $workspaceName = $workspace->name;
        
        // Remove the member
        $workspace->members()->detach($member->id);
        
        // Notify the member about being removed
        $member->notify(new \App\Notifications\RemovedFromWorkspaceNotification(
            $workspaceName,
            'workspace',
            $request->user()->name
        ));
        
        return Redirect::back()->with('success', 'Member removed successfully.');
    }
    
    /**
     * Update a member's role in the workspace.
     */
    public function updateMemberRole(Request $request, Workspace $workspace, User $member)
    {
        // Authorize that the authenticated user is the owner
        $this->authorize('addMember', $workspace);
        
        // Validate the incoming role
        $validated = $request->validate([
            'role' => 'required|string|in:admin,member',
        ]);
        
        // Prevent changing the owner's role
        if ($member->id === $workspace->owner_id) {
            return Redirect::back()->with('error', 'Cannot change the workspace owner\'s role');
        }
        
        // Update the role in the pivot table
        $workspace->members()->updateExistingPivot($member->id, [
            'role' => $validated['role']
        ]);
        
        // Notify the member about their role change
        $member->notify(new \App\Notifications\RoleChangedNotification(
            $workspace->name,
            'workspace',
            $validated['role'],
            $request->user()->name,
            $workspace->id
        ));
        
        // Reload the workspace with members
        $workspace->load(['members.academician', 'members.postgraduate', 'members.undergraduate']);
        
        return Redirect::back()->with('success', 'Member role updated successfully');
    }
}