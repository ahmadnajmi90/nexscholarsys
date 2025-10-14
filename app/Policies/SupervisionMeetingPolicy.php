<?php

namespace App\Policies;

use App\Models\SupervisionMeeting;
use App\Models\User;

class SupervisionMeetingPolicy
{
    /**
     * Determine if user can view the meeting
     */
    public function view(User $user, SupervisionMeeting $meeting): bool
    {
        $relationship = $meeting->relationship;
        $request = $meeting->request;

        if ($relationship) {
            return ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
                || ($user->academician && $user->academician->academician_id === $relationship->academician_id);
        }

        if ($request) {
            return ($user->postgraduate && $user->postgraduate->postgraduate_id === $request->student_id)
                || ($user->academician && $user->academician->academician_id === $request->academician_id);
        }

        return false;
    }

    /**
     * Determine if user can update the meeting
     */
    public function update(User $user, SupervisionMeeting $meeting): bool
    {
        // Only creator or both parties in the relationship/request can update
        // Meeting must not be cancelled or in the past
        if ($meeting->cancelled_at || $meeting->scheduled_for->isPast()) {
            return false;
        }

        return $this->view($user, $meeting);
    }

    /**
     * Determine if user can delete/cancel the meeting
     */
    public function delete(User $user, SupervisionMeeting $meeting): bool
    {
        // Meeting must not already be cancelled or in the past
        if ($meeting->cancelled_at || $meeting->scheduled_for->isPast()) {
            return false;
        }

        return $this->view($user, $meeting);
    }
}

