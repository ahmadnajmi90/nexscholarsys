<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ProjectJoinRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ProjectJoinRequestController extends Controller
{
    /**
     * Store a new join request for a project.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Project $project): JsonResponse
    {
        // Check if the user is already a member of the project
        if ($project->members()->where('user_id', Auth::id())->exists()) {
            return response()->json([
                'message' => 'You are already a member of this project',
            ], 422);
        }
        
        // Check if the user is the owner of the project
        if ($project->owner_id === Auth::id()) {
            return response()->json([
                'message' => 'You are the owner of this project',
            ], 422);
        }
        
        // Check if the user has already sent a request
        $existingRequest = ProjectJoinRequest::where('project_id', $project->id)
            ->where('user_id', Auth::id())
            ->first();
            
        if ($existingRequest) {
            if ($existingRequest->isPending()) {
                return response()->json([
                    'message' => 'You have already sent a request to join this project',
                ], 422);
            } elseif ($existingRequest->isAccepted()) {
                return response()->json([
                    'message' => 'Your request to join this project has already been accepted',
                ], 422);
            } elseif ($existingRequest->isRejected()) {
                // If the request was rejected, we'll update it to pending again
                $existingRequest->update(['status' => 'pending']);
                
                return response()->json([
                    'message' => 'Your request to join this project has been resubmitted',
                ], 200);
            }
        }
        
        // Validate the request
        $validated = $request->validate([
            'message' => 'nullable|string|max:500',
        ]);
        
        // Create the join request
        $joinRequest = ProjectJoinRequest::create([
            'project_id' => $project->id,
            'user_id' => Auth::id(),
            'status' => 'pending',
            'message' => $validated['message'] ?? null,
        ]);
        
        // TODO: Send notification to project owner
        
        return response()->json([
            'message' => 'Your request to join this project has been sent',
            'join_request' => $joinRequest,
        ], 201);
    }
    
    /**
     * Accept a join request.
     *
     * @param  \App\Models\ProjectJoinRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function accept(ProjectJoinRequest $projectJoinRequest): JsonResponse
    {
        // Authorize that the current user is the project owner
        $project = $projectJoinRequest->project;
        
        if ($project->owner_id !== Auth::id()) {
            return response()->json([
                'message' => 'You are not authorized to accept this request',
            ], 403);
        }
        
        // Check if the request is pending
        if (!$projectJoinRequest->isPending()) {
            return response()->json([
                'message' => 'This request has already been ' . $projectJoinRequest->status,
            ], 422);
        }
        
        // Update the request status
        $projectJoinRequest->update(['status' => 'accepted']);
        
        // Add the user to the project members
        $project->members()->attach($projectJoinRequest->user_id, [
            'role' => 'member', // Default role is member
        ]);
        
        // TODO: Send notification to the requester
        
        return response()->json([
            'message' => 'Join request accepted successfully',
        ], 200);
    }
    
    /**
     * Reject a join request.
     *
     * @param  \App\Models\ProjectJoinRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reject(ProjectJoinRequest $projectJoinRequest): JsonResponse
    {
        // Authorize that the current user is the project owner
        $project = $projectJoinRequest->project;
        
        if ($project->owner_id !== Auth::id()) {
            return response()->json([
                'message' => 'You are not authorized to reject this request',
            ], 403);
        }
        
        // Check if the request is pending
        if (!$projectJoinRequest->isPending()) {
            return response()->json([
                'message' => 'This request has already been ' . $projectJoinRequest->status,
            ], 422);
        }
        
        // Update the request status
        $projectJoinRequest->update(['status' => 'rejected']);
        
        // TODO: Send notification to the requester
        
        return response()->json([
            'message' => 'Join request rejected successfully',
        ], 200);
    }
}
