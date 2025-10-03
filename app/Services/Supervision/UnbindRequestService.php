<?php

namespace App\Services\Supervision;

use App\Models\SupervisionRelationship;
use App\Models\SupervisionRelationshipUnbindRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class UnbindRequestService
{
    /**
     * Initiate an unbind request from supervisor or student
     */
    public function initiateUnbindRequest(SupervisionRelationship $relationship, User $initiator, string $reason): SupervisionRelationshipUnbindRequest
    {
        return DB::transaction(function () use ($relationship, $initiator, $reason) {
            // Check if relationship is active
            if ($relationship->status !== SupervisionRelationship::STATUS_ACTIVE) {
                throw ValidationException::withMessages([
                    'relationship' => __('Cannot unbind a relationship that is not active.'),
                ]);
            }

            // Determine who is initiating
            $isSupervisor = $initiator->academician && 
                           $initiator->academician->academician_id === $relationship->academician_id;
            $isStudent = $initiator->postgraduate && 
                        $initiator->postgraduate->postgraduate_id === $relationship->student_id;

            if (!$isSupervisor && !$isStudent) {
                throw ValidationException::withMessages([
                    'unbind' => __('You are not authorized to unbind this relationship.'),
                ]);
            }

            $initiatedBy = $isSupervisor 
                ? SupervisionRelationshipUnbindRequest::INITIATED_BY_SUPERVISOR 
                : SupervisionRelationshipUnbindRequest::INITIATED_BY_STUDENT;

            // Check for existing pending unbind request
            $existingPending = $relationship->activeUnbindRequest;
            if ($existingPending) {
                // Check if in cooldown
                if ($existingPending->isInCooldown()) {
                    throw ValidationException::withMessages([
                        'unbind' => __('You must wait until :date before submitting another unbind request.', [
                            'date' => $existingPending->cooldown_until->format('d/m/Y H:i'),
                        ]),
                    ]);
                }
                
                // If not in cooldown but still pending, update the attempt count
                $attemptCount = $existingPending->attempt_count + 1;
                $existingPending->delete(); // Remove old one
            } else {
                // Check for recently rejected requests with cooldown from this initiator
                $recentRejected = $relationship->unbindRequests()
                    ->where('initiated_by', $initiatedBy)
                    ->where('status', SupervisionRelationshipUnbindRequest::STATUS_REJECTED)
                    ->whereNotNull('cooldown_until')
                    ->where('cooldown_until', '>', now())
                    ->latest()
                    ->first();

                if ($recentRejected && $recentRejected->isInCooldown()) {
                    throw ValidationException::withMessages([
                        'unbind' => __('You must wait until :date before submitting another unbind request.', [
                            'date' => $recentRejected->cooldown_until->format('d/m/Y H:i'),
                        ]),
                    ]);
                }

                // Count all previous rejected attempts from this initiator
                $attemptCount = $relationship->unbindRequests()
                    ->where('initiated_by', $initiatedBy)
                    ->where('status', SupervisionRelationshipUnbindRequest::STATUS_REJECTED)
                    ->count() + 1;
            }

            // Determine if this is a force unbind (3rd attempt)
            $isForceUnbind = $attemptCount >= SupervisionRelationshipUnbindRequest::MAX_ATTEMPTS_BEFORE_FORCE;
            $status = $isForceUnbind ? SupervisionRelationshipUnbindRequest::STATUS_FORCE_UNBIND : SupervisionRelationshipUnbindRequest::STATUS_PENDING;

            // Create the unbind request
            $unbindRequest = SupervisionRelationshipUnbindRequest::create([
                'relationship_id' => $relationship->id,
                'initiated_by' => $initiatedBy,
                'reason' => $reason,
                'status' => $status,
                'attempt_count' => $attemptCount,
                'cooldown_until' => null, // Only set if rejected
            ]);

            // If force unbind, terminate relationship immediately
            if ($isForceUnbind) {
                $this->terminateRelationship($relationship, $unbindRequest);
            }

            // TODO: Send notification to the other party
            // if ($isSupervisor) {
            //     $relationship->student?->user?->notify(new UnbindRequestInitiated($unbindRequest));
            // } else {
            //     $relationship->academician?->user?->notify(new UnbindRequestInitiated($unbindRequest));
            // }

            return $unbindRequest;
        });
    }

    /**
     * Student approves the unbind request
     */
    public function approveUnbindRequest(SupervisionRelationshipUnbindRequest $unbindRequest, User $student): void
    {
        DB::transaction(function () use ($unbindRequest, $student) {
            // Validate status
            if ($unbindRequest->status !== SupervisionRelationshipUnbindRequest::STATUS_PENDING) {
                throw ValidationException::withMessages([
                    'unbind' => __('This unbind request is no longer pending.'),
                ]);
            }

            // Update unbind request
            $unbindRequest->update([
                'status' => SupervisionRelationshipUnbindRequest::STATUS_APPROVED,
                'student_approved_at' => now(),
            ]);

            // Terminate the relationship
            $this->terminateRelationship($unbindRequest->relationship, $unbindRequest);

            // TODO: Send notification to supervisor
            // $unbindRequest->relationship->academician?->user?->notify(new UnbindRequestApproved($unbindRequest));
        });
    }

    /**
     * Student rejects the unbind request (supervisor-initiated)
     */
    public function rejectUnbindRequest(SupervisionRelationshipUnbindRequest $unbindRequest, User $student): void
    {
        DB::transaction(function () use ($unbindRequest, $student) {
            // Validate status
            if ($unbindRequest->status !== SupervisionRelationshipUnbindRequest::STATUS_PENDING) {
                throw ValidationException::withMessages([
                    'unbind' => __('This unbind request is no longer pending.'),
                ]);
            }

            // Set cooldown period (e.g., 30 days)
            $cooldownDays = 30;
            $cooldownUntil = Carbon::now()->addDays($cooldownDays);

            // Update unbind request
            $unbindRequest->update([
                'status' => SupervisionRelationshipUnbindRequest::STATUS_REJECTED,
                'cooldown_until' => $cooldownUntil,
            ]);

            // TODO: Send notification to supervisor
            // $unbindRequest->relationship->academician?->user?->notify(new UnbindRequestRejected($unbindRequest));
        });
    }

    /**
     * Supervisor approves the unbind request (student-initiated)
     */
    public function supervisorApproveUnbindRequest(SupervisionRelationshipUnbindRequest $unbindRequest, User $supervisor): void
    {
        DB::transaction(function () use ($unbindRequest, $supervisor) {
            // Validate status
            if ($unbindRequest->status !== SupervisionRelationshipUnbindRequest::STATUS_PENDING) {
                throw ValidationException::withMessages([
                    'unbind' => __('This unbind request is no longer pending.'),
                ]);
            }

            // Validate it's a student-initiated request
            if ($unbindRequest->initiated_by !== SupervisionRelationshipUnbindRequest::INITIATED_BY_STUDENT) {
                throw ValidationException::withMessages([
                    'unbind' => __('Only student-initiated unbind requests can be approved by supervisor.'),
                ]);
            }

            // Update unbind request
            $unbindRequest->update([
                'status' => SupervisionRelationshipUnbindRequest::STATUS_APPROVED,
                'student_approved_at' => now(), // Using same field for approval timestamp
            ]);

            // Terminate the relationship
            $this->terminateRelationship($unbindRequest->relationship, $unbindRequest);

            // TODO: Send notification to student
            // $unbindRequest->relationship->student?->user?->notify(new UnbindRequestApproved($unbindRequest));
        });
    }

    /**
     * Supervisor rejects the unbind request (student-initiated)
     */
    public function supervisorRejectUnbindRequest(SupervisionRelationshipUnbindRequest $unbindRequest, User $supervisor): void
    {
        DB::transaction(function () use ($unbindRequest, $supervisor) {
            // Validate status
            if ($unbindRequest->status !== SupervisionRelationshipUnbindRequest::STATUS_PENDING) {
                throw ValidationException::withMessages([
                    'unbind' => __('This unbind request is no longer pending.'),
                ]);
            }

            // Validate it's a student-initiated request
            if ($unbindRequest->initiated_by !== SupervisionRelationshipUnbindRequest::INITIATED_BY_STUDENT) {
                throw ValidationException::withMessages([
                    'unbind' => __('Only student-initiated unbind requests can be rejected by supervisor.'),
                ]);
            }

            // Set cooldown period (e.g., 30 days)
            $cooldownDays = 30;
            $cooldownUntil = Carbon::now()->addDays($cooldownDays);

            // Update unbind request
            $unbindRequest->update([
                'status' => SupervisionRelationshipUnbindRequest::STATUS_REJECTED,
                'cooldown_until' => $cooldownUntil,
            ]);

            // TODO: Send notification to student
            // $unbindRequest->relationship->student?->user?->notify(new UnbindRequestRejected($unbindRequest));
        });
    }

    /**
     * Terminate the supervision relationship
     */
    protected function terminateRelationship(SupervisionRelationship $relationship, SupervisionRelationshipUnbindRequest $unbindRequest): void
    {
        $relationship->update([
            'status' => SupervisionRelationship::STATUS_TERMINATED,
            'terminated_at' => now(),
        ]);

        // TODO: Archive ScholarLab workspace if exists
        // TODO: Update conversation status if needed
        // TODO: Create timeline event
    }
}

