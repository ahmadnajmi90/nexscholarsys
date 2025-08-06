<?php

namespace App\Http\Controllers\ProjectHub;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ProjectJoinRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Gate;

class ProjectJoinRequestController extends Controller
{
    /**
     * Store a new join request for a project.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Project  $project
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Project $project)
    {
        // Check if the user is already a member of the project
        if ($project->members()->where('user_id', Auth::id())->exists()) {
            return Redirect::back()->with('error', 'You are already a member of this project');
        }
        
        // Check if the user is the owner of the project
        if ($project->owner_id === Auth::id()) {
            return Redirect::back()->with('error', 'You are the owner of this project');
        }
        
        // Check if the user has already sent a request
        $existingRequest = ProjectJoinRequest::where('project_id', $project->id)
            ->where('user_id', Auth::id())
            ->first();
            
        if ($existingRequest) {
            if ($existingRequest->isPending()) {
                return Redirect::back()->with('error', 'You have already sent a request to join this project');
            } elseif ($existingRequest->isAccepted()) {
                return Redirect::back()->with('error', 'Your request to join this project has already been accepted');
            } elseif ($existingRequest->isRejected()) {
                // If the request was rejected, we'll update it to pending again
                $existingRequest->update(['status' => 'pending']);
                
                return Redirect::back()->with('success', 'Your request to join this project has been resubmitted');
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
        
        return Redirect::back()->with('success', 'Your request to join this project has been sent');
    }
    
    /**
     * Accept a join request.
     *
     * @param  \App\Models\ProjectJoinRequest  $projectJoinRequest
     * @return \Illuminate\Http\RedirectResponse
     */
    public function accept(ProjectJoinRequest $projectJoinRequest)
    {
        // Authorize that the current user is the project owner
        $project = $projectJoinRequest->project;
        
        if ($project->owner_id !== Auth::id()) {
            return Redirect::back()->with('error', 'You are not authorized to accept this request');
        }
        
        // Check if the request is pending
        if (!$projectJoinRequest->isPending()) {
            return Redirect::back()->with('error', 'This request has already been ' . $projectJoinRequest->status);
        }
        
        // Update the request status
        $projectJoinRequest->update(['status' => 'accepted']);
        
        // Add the user to the project members
        $project->members()->attach($projectJoinRequest->user_id, [
            'role' => 'member', // Default role is member
        ]);
        
        // TODO: Send notification to the requester
        
        return Redirect::back()->with('success', 'Join request accepted successfully');
    }
    
    /**
     * Reject a join request.
     *
     * @param  \App\Models\ProjectJoinRequest  $projectJoinRequest
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reject(ProjectJoinRequest $projectJoinRequest)
    {
        // Authorize that the current user is the project owner
        $project = $projectJoinRequest->project;
        
        if ($project->owner_id !== Auth::id()) {
            return Redirect::back()->with('error', 'You are not authorized to reject this request');
        }
        
        // Check if the request is pending
        if (!$projectJoinRequest->isPending()) {
            return Redirect::back()->with('error', 'This request has already been ' . $projectJoinRequest->status);
        }
        
        // Update the request status
        $projectJoinRequest->update(['status' => 'rejected']);
        
        // TODO: Send notification to the requester
        
        return Redirect::back()->with('success', 'Join request rejected successfully');
    }
}