<?php

namespace App\Services\Supervision;

use App\Models\SupervisionRelationship;
use App\Models\SupervisionRelationshipUnbindRequest;
use App\Models\User;
use App\Notifications\Supervision\UnbindRequestInitiated;
use App\Notifications\Supervision\UnbindRequestApproved;
use App\Notifications\Supervision\UnbindRequestRejected;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
            // Lock relationship to prevent race conditions
            $relationship = SupervisionRelationship::lockForUpdate()->find($relationship->id);
            
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

            // Determine if this is a force unbind (from config)
            $maxAttempts = config('supervision.unbind_max_attempts', 3);
            $isForceUnbind = $attemptCount >= $maxAttempts;
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
                Log::warning('Force unbind initiated after max attempts', [
                    'unbind_request_id' => $unbindRequest->id,
                    'relationship_id' => $relationship->id,
                    'attempt_count' => $attemptCount,
                ]);
                $this->terminateRelationship($relationship, $unbindRequest);
            } else {
                Log::info('Unbind request initiated', [
                    'unbind_request_id' => $unbindRequest->id,
                    'relationship_id' => $relationship->id,
                    'initiated_by' => $initiatedBy,
                    'attempt_count' => $attemptCount,
                ]);
            }

            // Eager load relationships for notification (prevent N+1)
            $relationship->load(['student.user', 'academician.user']);

            // Send notification to the other party
            if ($isSupervisor) {
                $relationship->student?->user?->notify(new UnbindRequestInitiated($unbindRequest));
            } else {
                $relationship->academician?->user?->notify(new UnbindRequestInitiated($unbindRequest));
            }

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

            // Send notification to supervisor
            $unbindRequest->relationship->academician?->user?->notify(new UnbindRequestApproved($unbindRequest));
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

            // Set cooldown period from config
            $cooldownDays = config('supervision.unbind_cooldown_days', 7);
            $cooldownUntil = Carbon::now()->addDays($cooldownDays);

            // Update unbind request
            $unbindRequest->update([
                'status' => SupervisionRelationshipUnbindRequest::STATUS_REJECTED,
                'cooldown_until' => $cooldownUntil,
            ]);

            // Send notification to supervisor
            $unbindRequest->relationship->academician?->user?->notify(new UnbindRequestRejected($unbindRequest));
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

            // Eager load relationships for notification (prevent N+1)
            $unbindRequest->relationship->load(['student.user', 'academician.user']);

            // Send notification to student
            $unbindRequest->relationship->student?->user?->notify(new UnbindRequestApproved($unbindRequest));
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

            // Set cooldown period from config
            $cooldownDays = config('supervision.unbind_cooldown_days', 7);
            $cooldownUntil = Carbon::now()->addDays($cooldownDays);

            // Update unbind request
            $unbindRequest->update([
                'status' => SupervisionRelationshipUnbindRequest::STATUS_REJECTED,
                'cooldown_until' => $cooldownUntil,
            ]);

            // Eager load relationships for notification (prevent N+1)
            $unbindRequest->relationship->load(['student.user', 'academician.user']);

            // Send notification to student
            $unbindRequest->relationship->student?->user?->notify(new UnbindRequestRejected($unbindRequest));
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

        // Archive ScholarLab workspace if exists
        if ($relationship->scholarlab_workspace_id) {
            try {
                $workspace = \App\Models\Workspace::find($relationship->scholarlab_workspace_id);
                if ($workspace) {
                    $workspace->update(['archived_at' => now()]);
                    Log::info('ScholarLab workspace archived on relationship termination', [
                        'workspace_id' => $workspace->id,
                        'relationship_id' => $relationship->id,
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Failed to archive ScholarLab workspace on termination', [
                    'relationship_id' => $relationship->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        // Cancel pending meetings
        try {
            $cancelledCount = $relationship->meetings()
                ->where('scheduled_for', '>', now())
                ->whereNull('cancelled_at')  // Only cancel non-cancelled meetings
                ->update(['cancelled_at' => now()]);
            
            if ($cancelledCount > 0) {
                Log::info('Cancelled pending meetings on relationship termination', [
                    'relationship_id' => $relationship->id,
                    'cancelled_count' => $cancelledCount,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to cancel meetings on termination', [
                'relationship_id' => $relationship->id,
                'error' => $e->getMessage(),
            ]);
        }

        // Create timeline event
        try {
            \App\Models\SupervisionTimeline::create([
                'entity_type' => SupervisionRelationship::class,
                'entity_id' => $relationship->id,
                'user_id' => $unbindRequest->initiated_by === SupervisionRelationshipUnbindRequest::INITIATED_BY_SUPERVISOR 
                    ? $relationship->academician->user_id ?? null
                    : $relationship->student->user_id ?? null,
                'event_type' => 'relationship_terminated',
                'description' => 'Supervision relationship terminated',
                'metadata' => [
                    'unbind_request_id' => $unbindRequest->id,
                    'reason' => $unbindRequest->reason,
                    'initiated_by' => $unbindRequest->initiated_by,
                    'attempt_count' => $unbindRequest->attempt_count,
                    'status' => $unbindRequest->status,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to create timeline event on termination', [
                'relationship_id' => $relationship->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}

