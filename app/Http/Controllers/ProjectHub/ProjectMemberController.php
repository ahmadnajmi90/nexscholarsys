<?php

namespace App\Http\Controllers\ProjectHub;

use App\Http\Controllers\Controller;
use App\Notifications\ProjectInvitationReceived;
use App\Notifications\RoleChangedNotification;
use App\Notifications\RemovedFromWorkspaceNotification;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class ProjectMemberController extends Controller
{
    /**
     * Add a new member to the project.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Project $project)
    {
        // Authorize the action using the policy
        $this->authorize('addMember', $project);
        
        // Validate the incoming request
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:admin,member', // Limit roles to admin or member
        ]);
        
        // Check if the user is already a member of the project
        if ($project->members()->where('user_id', $validated['user_id'])->exists()) {
            return Redirect::back()->with('error', 'User is already a member of this project');
        }
        
        // Attach the new member to the project
        $project->members()->attach($validated['user_id'], [
            'role' => $validated['role'],
        ]);

        // Send invitation notification to the invited user
        $invitedUser = User::with(['academician', 'postgraduate', 'undergraduate'])
            ->find($validated['user_id']);
            
        $invitedUser->notify(new ProjectInvitationReceived($project, $request->user()));
        
        // Reload the project with all members and their profile data
        $project->load(['members.academician', 'members.postgraduate', 'members.undergraduate']);
        
        return Redirect::back()->with('success', 'Member added successfully');
    }
    
    /**
     * Remove a member from the project.
     *
     * @param  \App\Models\Project  $project
     * @param  \App\Models\User  $member
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Project $project, User $member)
    {
        $this->authorize('removeMember', [$project, $member]);

        // Correctly detach the member from the project
        $project->members()->detach($member->id);

        $member->notify(new \App\Notifications\RemovedFromWorkspaceNotification(
            $project->name,
            'project', // parentType
            auth()->user()->name
        ));

        return Redirect::back()->with('success', 'Member removed from project.');
    }
    
    /**
     * Update a member's role in the project.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @param  \App\Models\User  $member
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateRole(Request $request, Project $project, User $member)
    {
        // Authorize the action using the policy
        $this->authorize('addMember', $project);
        
        // Validate the incoming role
        $validated = $request->validate([
            'role' => 'required|string|in:admin,member',
        ]);
        
        // Prevent changing the owner's role
        if ($member->id === $project->owner_id) {
            return Redirect::back()->with('error', 'Cannot change the project owner\'s role');
        }
        
        // Check if the user is actually a member of the project
        if (!$project->members()->where('user_id', $member->id)->exists()) {
            return Redirect::back()->with('error', 'User is not a member of this project');
        }
        
        // Update the role in the pivot table
        $project->members()->updateExistingPivot($member->id, [
            'role' => $validated['role']
        ]);
        
        // Notify the member about their role change
        $member->notify(new RoleChangedNotification(
            $project->name,
            'project',
            $validated['role'],
            $request->user()->name,
            $project->id
        ));
        
        // Reload the project with members
        $project->load(['members.academician', 'members.postgraduate', 'members.undergraduate']);
        
        return Redirect::back()->with('success', 'Member role updated successfully');
    }
}