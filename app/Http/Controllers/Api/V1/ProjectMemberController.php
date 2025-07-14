<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Notifications\ProjectInvitationReceived;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class ProjectMemberController extends Controller
{
    /**
     * Add a new member to the project.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Project $project): JsonResponse
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
            return response()->json([
                'message' => 'User is already a member of this project',
            ], 422);
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
        
        return response()->json([
            'message' => 'Member added successfully',
            'members' => $project->members
        ], 201);
    }
    
    /**
     * Remove a member from the project.
     *
     * @param  \App\Models\Project  $project
     * @param  \App\Models\User  $member
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Project $project, User $member): JsonResponse
    {
        // Authorize the action using the policy
        $this->authorize('removeMember', [$project, $member]);
        
        // Prevent the owner from removing themselves
        if ($member->id === $project->owner_id) {
            return response()->json([
                'message' => 'The project owner cannot be removed',
            ], 422);
        }
        
        // Check if the user is actually a member of the project
        if (!$project->members()->where('user_id', $member->id)->exists()) {
            return response()->json([
                'message' => 'User is not a member of this project',
            ], 404);
        }
        
        // Detach the member from the project
        $project->members()->detach($member->id);
        
        return response()->json([
            'message' => 'Member removed successfully',
        ], 200);
    }
}
