<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WorkspaceResource;
use App\Models\User;
use App\Models\Workspace;
use App\Notifications\WorkspaceInvitationReceived;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

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
        
        return WorkspaceResource::collection($workspaces);
    }

    /**
     * Store a newly created workspace in storage.
     */
    public function store(Request $request)
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
        
        return (new WorkspaceResource($workspace))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Display the specified workspace.
     */
    public function show(Request $request, Workspace $workspace)
    {
        $this->authorize('view', $workspace);
        
        // Load the owner and members for the resource
        $workspace->load(['owner', 'members']);
        
        return new WorkspaceResource($workspace);
    }

    /**
     * Update the specified workspace in storage.
     */
    public function update(Request $request, Workspace $workspace)
    {
        $this->authorize('update', $workspace);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        
        $workspace->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);
        
        // Load the owner for the resource
        $workspace->load('owner');
        
        return new WorkspaceResource($workspace);
    }

    /**
     * Remove the specified workspace from storage.
     */
    public function destroy(Workspace $workspace)
    {
        $this->authorize('delete', $workspace);
        
        $workspace->delete();
        
        return back()->with('success', 'Workspace deleted successfully.');
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
            if ($request->wantsJson()) {
                return response()->json(['message' => 'The owner is already a member of this workspace.'], 422);
            }
            return back()->with('error', 'The owner is already a member of this workspace.');
        }

        // 3. Attach the new member with their assigned role
        $workspace->members()->syncWithoutDetaching([
            $validated['user_id'] => ['role' => $validated['role']]
        ]);

        // 4. Send invitation notification to the invited user
        $invitedUser = User::find($validated['user_id']);
        $invitedUser->notify(new WorkspaceInvitationReceived($workspace, $request->user()));
        
        if ($request->wantsJson()) {
            return response()->json(['message' => 'Member added successfully.']);
        }
        
        return back()->with('success', 'Member added successfully.');
    }

    /**
     * Remove a member from the workspace.
     */
    public function removeMember(Request $request, Workspace $workspace, User $member)
    {
        $this->authorize('removeMember', [$workspace, $member]);
        
        // Prevent removing the owner
        if ($member->id === $workspace->owner_id) {
            if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Cannot remove the workspace owner',
            ], Response::HTTP_FORBIDDEN);
            }
            return back()->with('error', 'Cannot remove the workspace owner.');
        }
        
        $workspace->members()->detach($member->id);
        
        if ($request->wantsJson()) {
        return response()->json([
            'message' => 'Member removed successfully',
        ]);
        }
        
        return back()->with('success', 'Member removed successfully.');
    }
} 