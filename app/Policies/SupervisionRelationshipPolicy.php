<?php

namespace App\Policies;

use App\Models\SupervisionRelationship;
use App\Models\User;

class SupervisionRelationshipPolicy
{
    /**
     * Determine if user can view the relationship
     */
    public function view(User $user, SupervisionRelationship $relationship): bool
    {
        return ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
            || ($user->academician && $user->academician->academician_id === $relationship->academician_id);
    }

    /**
     * Determine if user can initiate unbind
     */
    public function initiateUnbind(User $user, SupervisionRelationship $relationship): bool
    {
        // Both student and supervisor can initiate
        return $relationship->status === SupervisionRelationship::STATUS_ACTIVE
            && (
                ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
                || ($user->academician && $user->academician->academician_id === $relationship->academician_id)
            );
    }

    /**
     * Determine if user can invite co-supervisor
     */
    public function inviteCoSupervisor(User $user, SupervisionRelationship $relationship): bool
    {
        // Only main supervisor or student can invite
        return $relationship->status === SupervisionRelationship::STATUS_ACTIVE
            && $relationship->role === SupervisionRelationship::ROLE_MAIN
            && (
                ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
                || ($user->academician && $user->academician->academician_id === $relationship->academician_id)
            );
    }

    /**
     * Determine if user can schedule meeting
     */
    public function scheduleMeeting(User $user, SupervisionRelationship $relationship): bool
    {
        // Both parties can schedule
        return $relationship->status === SupervisionRelationship::STATUS_ACTIVE
            && (
                ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
                || ($user->academician && $user->academician->academician_id === $relationship->academician_id)
            );
    }

    /**
     * Determine if user can upload documents
     */
    public function uploadDocument(User $user, SupervisionRelationship $relationship): bool
    {
        // Both parties can upload
        return $relationship->status === SupervisionRelationship::STATUS_ACTIVE
            && (
                ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
                || ($user->academician && $user->academician->academician_id === $relationship->academician_id)
            );
    }

    /**
     * Determine if user can update research details
     */
    public function updateResearch(User $user, SupervisionRelationship $relationship): bool
    {
        // Both parties can update
        return $relationship->status === SupervisionRelationship::STATUS_ACTIVE
            && (
                ($user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id)
                || ($user->academician && $user->academician->academician_id === $relationship->academician_id)
            );
    }
}

