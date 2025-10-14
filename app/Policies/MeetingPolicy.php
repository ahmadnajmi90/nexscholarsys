<?php

namespace App\Policies;

use App\Models\SupervisionMeeting;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MeetingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SupervisionMeeting $supervisionMeeting): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SupervisionMeeting $meeting): bool
    {
        // User is the meeting creator
        if ($meeting->created_by === $user->id) {
            return true;
        }

        // Check if user is a participant in the associated relationship
        if ($meeting->supervision_relationship_id && $meeting->relationship) {
            $relationship = $meeting->relationship;
            
            // User is the academician
            if ($relationship->academician && $relationship->academician->user_id === $user->id) {
                return true;
            }
            
            // User is the student
            if ($relationship->student && $relationship->student->user_id === $user->id) {
                return true;
            }
        }

        // Check if user is a participant in the associated request
        if ($meeting->supervision_request_id && $meeting->request) {
            $request = $meeting->request;
            
            // User is the academician
            if ($request->academician && $request->academician->user_id === $user->id) {
                return true;
            }
            
            // User is the student
            if ($request->student && $request->student->user_id === $user->id) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SupervisionMeeting $meeting): bool
    {
        // User is the meeting creator
        if ($meeting->created_by === $user->id) {
            return true;
        }

        // Check if user is a participant in the associated relationship
        if ($meeting->supervision_relationship_id && $meeting->relationship) {
            $relationship = $meeting->relationship;
            
            // User is the academician
            if ($relationship->academician && $relationship->academician->user_id === $user->id) {
                return true;
            }
            
            // User is the student
            if ($relationship->student && $relationship->student->user_id === $user->id) {
                return true;
            }
        }

        // Check if user is a participant in the associated request
        if ($meeting->supervision_request_id && $meeting->request) {
            $request = $meeting->request;
            
            // User is the academician
            if ($request->academician && $request->academician->user_id === $user->id) {
                return true;
            }
            
            // User is the student
            if ($request->student && $request->student->user_id === $user->id) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SupervisionMeeting $supervisionMeeting): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SupervisionMeeting $supervisionMeeting): bool
    {
        return false;
    }

    /**
     * Determine whether the user can add the meeting to their Google Calendar.
     */
    public function addToCalendar(User $user, SupervisionMeeting $meeting): bool
    {
        // User is the meeting creator
        if ($meeting->created_by === $user->id) {
            return true;
        }

        // Check if user is a participant in the associated relationship
        if ($meeting->supervision_relationship_id && $meeting->relationship) {
            $relationship = $meeting->relationship;
            
            // User is the academician
            if ($relationship->academician && $relationship->academician->user_id === $user->id) {
                return true;
            }
            
            // User is the student
            if ($relationship->student && $relationship->student->user_id === $user->id) {
                return true;
            }
        }

        // Check if user is a participant in the associated request
        if ($meeting->supervision_request_id && $meeting->request) {
            $request = $meeting->request;
            
            // User is the academician
            if ($request->academician && $request->academician->user_id === $user->id) {
                return true;
            }
            
            // User is the student
            if ($request->student && $request->student->user_id === $user->id) {
                return true;
            }
        }

        return false;
    }
}
