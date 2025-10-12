<?php

namespace App\Policies;

use App\Models\SupervisionRequest;
use App\Models\User;

class SupervisionPolicy
{
    /**
     * Determine if user can view the request
     */
    public function view(User $user, SupervisionRequest $request): bool
    {
        // Student who made the request or supervisor who received it
        return ($user->postgraduate && $user->postgraduate->postgraduate_id === $request->student_id)
            || ($user->academician && $user->academician->academician_id === $request->academician_id);
    }

    /**
     * Determine if user can cancel the request
     */
    public function cancel(User $user, SupervisionRequest $request): bool
    {
        // Only student who made the request
        return $user->postgraduate 
            && $user->postgraduate->postgraduate_id === $request->student_id
            && $request->status === SupervisionRequest::STATUS_PENDING;
    }

    /**
     * Determine if user can accept the request (send offer)
     */
    public function accept(User $user, SupervisionRequest $request): bool
    {
        // Only supervisor who received the request
        return $user->academician 
            && $user->academician->academician_id === $request->academician_id
            && $request->status === SupervisionRequest::STATUS_PENDING;
    }

    /**
     * Determine if user can reject the request
     */
    public function reject(User $user, SupervisionRequest $request): bool
    {
        // Only supervisor who received the request
        return $user->academician 
            && $user->academician->academician_id === $request->academician_id
            && $request->status === SupervisionRequest::STATUS_PENDING;
    }

    /**
     * Determine if user can accept the offer (student accepting supervisor's offer)
     */
    public function acceptOffer(User $user, SupervisionRequest $request): bool
    {
        // Only student who received the offer
        return $user->postgraduate 
            && $user->postgraduate->postgraduate_id === $request->student_id
            && $request->status === SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE;
    }

    /**
     * Determine if user can reject the offer (student rejecting supervisor's offer)
     */
    public function rejectOffer(User $user, SupervisionRequest $request): bool
    {
        // Only student who received the offer
        return $user->postgraduate 
            && $user->postgraduate->postgraduate_id === $request->student_id
            && $request->status === SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE;
    }

    /**
     * Determine if user can add notes to request
     */
    public function addNote(User $user, SupervisionRequest $request): bool
    {
        // Only supervisor can add notes
        return $user->academician 
            && $user->academician->academician_id === $request->academician_id;
    }
}

