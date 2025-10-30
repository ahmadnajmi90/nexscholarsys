<?php

namespace App\Http\Controllers\ProjectHub;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use App\Models\WorkspaceGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class WorkspaceGroupController extends Controller
{
    /**
     * Get all groups for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $groups = WorkspaceGroup::where('user_id', $user->id)
            ->orderBy('order')
            ->get();
        
        return response()->json(['groups' => $groups]);
    }

    /**
     * Store a newly created workspace group.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => [
                'required', 
                'string', 
                'max:255',
                // Unique rule scoped to the authenticated user
                Rule::unique('workspace_groups', 'name')
                    ->where('user_id', $user->id)
            ],
        ]);
        
        // Get the highest order value and increment
        $maxOrder = WorkspaceGroup::where('user_id', $user->id)->max('order') ?? 0;
        
        $group = WorkspaceGroup::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'order' => $maxOrder + 1,
        ]);
        
        return Redirect::back()->with('success', 'Group created successfully.');
    }

    /**
     * Update the specified workspace group.
     */
    public function update(Request $request, WorkspaceGroup $workspaceGroup)
    {
        // Authorize that the authenticated user owns this group
        if ($workspaceGroup->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }
        
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => [
                'required', 
                'string', 
                'max:255',
                // Unique rule scoped to the authenticated user, ignoring current group
                Rule::unique('workspace_groups', 'name')
                    ->where('user_id', $user->id)
                    ->ignore($workspaceGroup->id)
            ],
        ]);
        
        $workspaceGroup->update([
            'name' => $validated['name'],
        ]);
        
        return Redirect::back()->with('success', 'Group updated successfully.');
    }

    /**
     * Remove the specified workspace group.
     */
    public function destroy(WorkspaceGroup $workspaceGroup)
    {
        // Authorize that the authenticated user owns this group
        if ($workspaceGroup->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }
        
        // Set all workspaces in this group to ungrouped (null)
        DB::table('workspace_members')
            ->where('workspace_group_id', $workspaceGroup->id)
            ->where('user_id', Auth::id())
            ->update(['workspace_group_id' => null]);
        
        // Delete the group
        $workspaceGroup->delete();
        
        return Redirect::back()->with('success', 'Group deleted successfully.');
    }

    /**
     * Update the order of groups.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'groups' => 'required|array',
            'groups.*.id' => 'required|exists:workspace_groups,id',
            'groups.*.order' => 'required|integer',
        ]);
        
        $user = $request->user();
        
        foreach ($validated['groups'] as $groupData) {
            WorkspaceGroup::where('id', $groupData['id'])
                ->where('user_id', $user->id)
                ->update(['order' => $groupData['order']]);
        }
        
        return Redirect::back()->with('success', 'Group order updated successfully.');
    }

    /**
     * Assign a workspace to a group.
     */
    public function assignWorkspace(Request $request, WorkspaceGroup $workspaceGroup, Workspace $workspace)
    {
        $user = $request->user();
        
        // Verify user is a member of the workspace
        $isMember = $workspace->members()->where('users.id', $user->id)->exists();
        if (!$isMember) {
            abort(403, 'You are not a member of this workspace.');
        }
        
        // Verify user owns the group
        if ($workspaceGroup->user_id !== $user->id) {
            abort(403, 'Unauthorized');
        }
        
        // Update the workspace_group_id in the pivot table for this specific user
        DB::table('workspace_members')
            ->where('workspace_id', $workspace->id)
            ->where('user_id', $user->id)
            ->update(['workspace_group_id' => $workspaceGroup->id]);
        
        return Redirect::back()->with('success', 'Workspace assigned to group successfully.');
    }

    /**
     * Remove a workspace from its group (set to ungrouped).
     */
    public function unassignWorkspace(Request $request, Workspace $workspace)
    {
        $user = $request->user();
        
        // Verify user is a member of the workspace
        $isMember = $workspace->members()->where('users.id', $user->id)->exists();
        if (!$isMember) {
            abort(403, 'You are not a member of this workspace.');
        }
        
        // Update the workspace_group_id to null in the pivot table for this specific user
        DB::table('workspace_members')
            ->where('workspace_id', $workspace->id)
            ->where('user_id', $user->id)
            ->update(['workspace_group_id' => null]);
        
        return Redirect::back()->with('success', 'Workspace moved to ungrouped.');
    }
}

