<?php

namespace App\Services\Supervision;

use App\Models\Academician;
use App\Models\CoSupervisorInvitation;
use App\Models\SupervisionRelationship;
use App\Notifications\Supervision\CoSupervisorInvitationSent;
use App\Notifications\Supervision\CoSupervisorInvitationInitiated;
use App\Notifications\Supervision\CoSupervisorAccepted;
use App\Notifications\Supervision\CoSupervisorRejected;
use App\Notifications\Supervision\CoSupervisorApprovalNeeded;
use App\Notifications\Supervision\CoSupervisorApproved;
use App\Notifications\Supervision\CoSupervisorRejectedByApprover;
use App\Notifications\Supervision\CoSupervisorAdded;
use App\Notifications\Supervision\CoSupervisorInvitationCancelled;
use App\Services\Messaging\ConversationService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CoSupervisorService
{
    public const MAX_COSUPERVISORS = 2;

    protected ConversationService $conversationService;

    public function __construct(ConversationService $conversationService)
    {
        $this->conversationService = $conversationService;
    }

    /**
     * Initiate a co-supervisor invitation
     */
    public function initiateInvitation(
        SupervisionRelationship $relationship,
        string $cosupervisorAcademicianId,
        string $initiatedBy,
        ?string $message = null
    ) {
        // Validate the relationship is active and main supervisor
        if (!$relationship->isMainSupervisor()) {
            throw new \Exception('Only main supervision relationships can add co-supervisors.');
        }

        if ($relationship->status !== SupervisionRelationship::STATUS_ACTIVE) {
            throw new \Exception('Can only add co-supervisors to active relationships.');
        }

        // Check if co-supervisor is the same as main supervisor
        if ($relationship->academician_id === $cosupervisorAcademicianId) {
            throw new \Exception('Main supervisor cannot be added as co-supervisor.');
        }

        // Check max co-supervisors limit
        $existingCosupervisorsCount = SupervisionRelationship::where('student_id', $relationship->student_id)
            ->where('role', SupervisionRelationship::ROLE_CO)
            ->where('status', SupervisionRelationship::STATUS_ACTIVE)
            ->count();

        $pendingInvitationsCount = CoSupervisorInvitation::where('relationship_id', $relationship->id)
            ->where(function ($query) {
                $query->where('cosupervisor_status', CoSupervisorInvitation::STATUS_PENDING)
                    ->orWhere(function ($q) {
                        $q->where('cosupervisor_status', CoSupervisorInvitation::STATUS_ACCEPTED)
                            ->where('approver_status', CoSupervisorInvitation::STATUS_PENDING);
                    });
            })
            ->whereNull('cancelled_at')
            ->count();

        if (($existingCosupervisorsCount + $pendingInvitationsCount) >= self::MAX_COSUPERVISORS) {
            throw new \Exception('Maximum of ' . self::MAX_COSUPERVISORS . ' co-supervisors allowed.');
        }

        // Check for duplicate invitation
        $existingInvitation = CoSupervisorInvitation::where('relationship_id', $relationship->id)
            ->where('cosupervisor_academician_id', $cosupervisorAcademicianId)
            ->where(function ($query) {
                $query->where('cosupervisor_status', CoSupervisorInvitation::STATUS_PENDING)
                    ->orWhere(function ($q) {
                        $q->where('cosupervisor_status', CoSupervisorInvitation::STATUS_ACCEPTED)
                            ->where('approver_status', CoSupervisorInvitation::STATUS_PENDING);
                    });
            })
            ->whereNull('cancelled_at')
            ->exists();

        if ($existingInvitation) {
            throw new \Exception('An invitation to this co-supervisor is already pending.');
        }

        // Check if already a co-supervisor
        $alreadyCosupervisor = SupervisionRelationship::where('student_id', $relationship->student_id)
            ->where('academician_id', $cosupervisorAcademicianId)
            ->where('role', SupervisionRelationship::ROLE_CO)
            ->where('status', SupervisionRelationship::STATUS_ACTIVE)
            ->exists();

        if ($alreadyCosupervisor) {
            throw new \Exception('This academician is already a co-supervisor.');
        }

        // Create invitation
        $invitation = CoSupervisorInvitation::create([
            'relationship_id' => $relationship->id,
            'cosupervisor_academician_id' => $cosupervisorAcademicianId,
            'initiated_by' => $initiatedBy,
            'invitation_message' => $message,
            'cosupervisor_status' => CoSupervisorInvitation::STATUS_PENDING,
            'approver_status' => CoSupervisorInvitation::STATUS_PENDING,
        ]);

        // Load relationships
        $invitation->load(['relationship.student', 'relationship.academician', 'cosupervisor']);

        // Send notification to co-supervisor
        $cosupervisor = Academician::where('academician_id', $cosupervisorAcademicianId)->first();
        $cosupervisor->user->notify(new CoSupervisorInvitationSent($invitation));

        // Send notification to approver (immediately, not after co-supervisor accepts)
        $approver = $initiatedBy === 'student' 
            ? $relationship->academician->user  // Main supervisor needs to know
            : $relationship->student->user;     // Student needs to know
        $approver->notify(new CoSupervisorInvitationInitiated($invitation));

        return $invitation;
    }

    /**
     * Co-supervisor responds to invitation
     */
    public function cosupervisorRespond(
        CoSupervisorInvitation $invitation,
        string $response,
        ?string $rejectionReason = null
    ) {
        if ($invitation->cosupervisor_status !== CoSupervisorInvitation::STATUS_PENDING) {
            throw new \Exception('This invitation has already been responded to.');
        }

        if ($invitation->isCancelled()) {
            throw new \Exception('This invitation has been cancelled.');
        }

        DB::beginTransaction();
        try {
            $invitation->update([
                'cosupervisor_status' => $response,
                'rejection_reason' => $rejectionReason,
                'cosupervisor_responded_at' => now(),
            ]);

            $invitation->load(['relationship.student', 'relationship.academician', 'cosupervisor']);

            if ($response === CoSupervisorInvitation::STATUS_REJECTED) {
                // Notify initiator and the other party
                $this->notifyRejection($invitation);
            } else {
                // Co-supervisor accepted, now need approver's approval
                $this->notifyApprovalNeeded($invitation);
            }

            DB::commit();
            return $invitation;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in co-supervisor response: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Approver responds to invitation (after co-supervisor accepted)
     */
    public function approverRespond(
        CoSupervisorInvitation $invitation,
        string $response,
        ?string $rejectionReason = null
    ) {
        if ($invitation->cosupervisor_status !== CoSupervisorInvitation::STATUS_ACCEPTED) {
            throw new \Exception('Co-supervisor must accept first.');
        }

        if ($invitation->approver_status !== CoSupervisorInvitation::STATUS_PENDING) {
            throw new \Exception('This invitation has already been approved or rejected.');
        }

        if ($invitation->isCancelled()) {
            throw new \Exception('This invitation has been cancelled.');
        }

        DB::beginTransaction();
        try {
            $invitation->update([
                'approver_status' => $response,
                'rejection_reason' => $rejectionReason,
                'approver_responded_at' => now(),
            ]);

            $invitation->load(['relationship.student', 'relationship.academician', 'cosupervisor']);

            if ($response === CoSupervisorInvitation::STATUS_REJECTED) {
                // Notify all parties
                $this->notifyRejectedByApprover($invitation);
            } else {
                // Both accepted, create co-supervisor relationship
                $this->createCoSupervisorRelationship($invitation);
            }

            DB::commit();
            return $invitation;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in approver response: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Cancel a pending invitation
     */
    public function cancelInvitation(CoSupervisorInvitation $invitation)
    {
        if (!$invitation->isPending()) {
            throw new \Exception('Can only cancel pending invitations.');
        }

        if ($invitation->isCancelled()) {
            throw new \Exception('This invitation has already been cancelled.');
        }

        $invitation->update([
            'cancelled_at' => now(),
        ]);

        $invitation->load(['relationship.student', 'relationship.academician', 'cosupervisor']);

        // Notify the co-supervisor if they haven't responded yet
        if ($invitation->cosupervisor_status === CoSupervisorInvitation::STATUS_PENDING) {
            $invitation->cosupervisor->user->notify(new CoSupervisorInvitationCancelled($invitation));
        }

        return $invitation;
    }

    /**
     * Remove a co-supervisor (terminate their relationship)
     */
    public function removeCosupervisor(SupervisionRelationship $cosupervisorRelationship)
    {
        if (!$cosupervisorRelationship->isCoSupervisor()) {
            throw new \Exception('Can only remove co-supervisor relationships.');
        }

        $cosupervisorRelationship->update([
            'status' => SupervisionRelationship::STATUS_TERMINATED,
            'terminated_at' => now(),
        ]);

        // Remove from group conversation if it exists
        $student = $cosupervisorRelationship->student;
        if ($student && $student->supervision_group_conversation_id) {
            try {
                $groupConversation = $student->supervisionGroupConversation;
                $cosupervisor = $cosupervisorRelationship->academician;
                
                if ($groupConversation && $cosupervisor && $cosupervisor->user) {
                    $this->conversationService->removeParticipant($groupConversation, $cosupervisor->user);
                    
                    Log::info('Removed co-supervisor from group conversation', [
                        'conversation_id' => $groupConversation->id,
                        'cosupervisor_id' => $cosupervisor->academician_id,
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Failed to remove co-supervisor from group conversation: ' . $e->getMessage());
            }
        }

        // Remove from workspace if it exists
        $mainRelationship = SupervisionRelationship::where('student_id', $cosupervisorRelationship->student_id)
            ->where('role', SupervisionRelationship::ROLE_MAIN)
            ->where('status', SupervisionRelationship::STATUS_ACTIVE)
            ->first();

        if ($mainRelationship && $mainRelationship->scholarlab_workspace_id) {
            try {
                $workspace = \App\Models\Workspace::find($mainRelationship->scholarlab_workspace_id);
                $cosupervisor = $cosupervisorRelationship->academician;
                
                if ($workspace && $cosupervisor && $cosupervisor->user) {
                    $workspace->members()->detach($cosupervisor->user->id);
                    
                    Log::info('Removed co-supervisor from workspace', [
                        'workspace_id' => $workspace->id,
                        'cosupervisor_id' => $cosupervisor->academician_id,
                    ]);

                    // Also remove from board
                    if ($mainRelationship->scholarlab_board_id) {
                        $board = \App\Models\Board::find($mainRelationship->scholarlab_board_id);
                        if ($board) {
                            $board->members()->detach($cosupervisor->user->id);
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error('Failed to remove co-supervisor from workspace: ' . $e->getMessage());
            }
        }

        return $cosupervisorRelationship;
    }

    /**
     * Create co-supervisor relationship after full approval
     */
    protected function createCoSupervisorRelationship(CoSupervisorInvitation $invitation)
    {
        $mainRelationship = $invitation->relationship;

        // Create co-supervisor relationship
        $cosupervisorRelationship = SupervisionRelationship::create([
            'student_id' => $mainRelationship->student_id,
            'academician_id' => $invitation->cosupervisor_academician_id,
            'role' => SupervisionRelationship::ROLE_CO,
            'status' => SupervisionRelationship::STATUS_ACTIVE,
            'start_date' => now(),
            'accepted_at' => now(),
        ]);

        // Create conversation between student and co-supervisor
        $student = $mainRelationship->student;
        $cosupervisor = $invitation->cosupervisor;
        
        if ($student && $student->user && $cosupervisor && $cosupervisor->user) {
            try {
                $conversation = $this->conversationService->createDirectConversation(
                    $student->user,
                    $cosupervisor->user
                );
                
                // Store conversation ID in the relationship
                $cosupervisorRelationship->update([
                    'conversation_id' => $conversation->id,
                ]);
                
                Log::info('Created conversation for co-supervisor relationship', [
                    'conversation_id' => $conversation->id,
                    'student_id' => $student->postgraduate_id,
                    'cosupervisor_id' => $cosupervisor->academician_id,
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to create conversation for co-supervisor: ' . $e->getMessage());
            }
        }

        // Check if this is the first co-supervisor - if so, create group conversation
        $existingCosupervisors = SupervisionRelationship::where('student_id', $mainRelationship->student_id)
            ->where('role', SupervisionRelationship::ROLE_CO)
            ->where('status', SupervisionRelationship::STATUS_ACTIVE)
            ->where('id', '!=', $cosupervisorRelationship->id)
            ->count();

        Log::info('Checking for group conversation creation', [
            'student_id' => $student->postgraduate_id,
            'existing_cosupervisors' => $existingCosupervisors,
            'is_first_cosupervisor' => $existingCosupervisors === 0,
        ]);

        if ($existingCosupervisors === 0) {
            // This is the first co-supervisor, create group conversation
            try {
                Log::info('Attempting to create group conversation', [
                    'student_user_id' => $student->user?->id,
                    'main_sv_user_id' => $mainRelationship->academician->user?->id,
                    'co_sv_user_id' => $cosupervisor->user?->id,
                ]);

                $groupConversation = $this->conversationService->createGroupConversation(
                    $student->user,
                    [$mainRelationship->academician->user, $cosupervisor->user],
                    'Supervision Team - ' . $student->full_name
                );

                Log::info('Group conversation created successfully', [
                    'conversation_id' => $groupConversation->id,
                ]);

                // Update student record with group conversation
                $student->update([
                    'supervision_group_conversation_id' => $groupConversation->id,
                ]);

                // Reload to verify
                $student->refresh();

                Log::info('Updated student with group conversation', [
                    'conversation_id' => $groupConversation->id,
                    'student_id' => $student->postgraduate_id,
                    'student_group_conv_id' => $student->supervision_group_conversation_id,
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to create group conversation: ' . $e->getMessage(), [
                    'exception' => get_class($e),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        } else {
            // Group conversation already exists, add this co-supervisor
            if ($student->supervision_group_conversation_id) {
                try {
                    $groupConversation = $student->supervisionGroupConversation;
                    if ($groupConversation) {
                        $this->conversationService->addParticipant($groupConversation, $cosupervisor->user);
                        
                        Log::info('Added co-supervisor to existing group conversation', [
                            'conversation_id' => $groupConversation->id,
                            'cosupervisor_id' => $cosupervisor->academician_id,
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error('Failed to add co-supervisor to group conversation: ' . $e->getMessage());
                }
            }
        }

        // Add co-supervisor to workspace if it exists
        if ($mainRelationship->scholarlab_workspace_id) {
            try {
                $workspace = \App\Models\Workspace::find($mainRelationship->scholarlab_workspace_id);
                if ($workspace) {
                    // Add as member if not already in workspace
                    if (!$workspace->members()->where('user_id', $cosupervisor->user->id)->exists()) {
                        $workspace->members()->attach($cosupervisor->user->id, ['role' => 'member']);
                        
                        Log::info('Added co-supervisor to workspace', [
                            'workspace_id' => $workspace->id,
                            'cosupervisor_id' => $cosupervisor->academician_id,
                        ]);
                    }

                    // Add to board as well
                    if ($mainRelationship->scholarlab_board_id) {
                        $board = \App\Models\Board::find($mainRelationship->scholarlab_board_id);
                        if ($board) {
                            $board->members()->syncWithoutDetaching([$cosupervisor->user->id]);
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error('Failed to add co-supervisor to workspace: ' . $e->getMessage());
            }
        }

        $invitation->update([
            'completed_at' => now(),
        ]);

        // Notify all parties
        $this->notifyCoSupervisorAdded($invitation, $cosupervisorRelationship);
    }

    /**
     * Notify when co-supervisor rejects
     */
    protected function notifyRejection(CoSupervisorInvitation $invitation)
    {
        $relationship = $invitation->relationship;

        // Notify student
        $relationship->student->user->notify(new CoSupervisorRejected($invitation));

        // Notify main supervisor
        $relationship->academician->user->notify(new CoSupervisorRejected($invitation));
    }

    /**
     * Notify approver that their approval is needed
     */
    protected function notifyApprovalNeeded(CoSupervisorInvitation $invitation)
    {
        $relationship = $invitation->relationship;

        // Send to student or main supervisor based on who initiated
        if ($invitation->initiated_by === CoSupervisorInvitation::INITIATED_BY_STUDENT) {
            // Main supervisor needs to approve
            $relationship->academician->user->notify(new CoSupervisorApprovalNeeded($invitation));
        } else {
            // Student needs to approve
            $relationship->student->user->notify(new CoSupervisorApprovalNeeded($invitation));
        }

        // Also notify the initiator that co-supervisor accepted
        if ($invitation->initiated_by === CoSupervisorInvitation::INITIATED_BY_STUDENT) {
            $relationship->student->user->notify(new CoSupervisorAccepted($invitation));
        } else {
            $relationship->academician->user->notify(new CoSupervisorAccepted($invitation));
        }
    }

    /**
     * Notify when approver rejects
     */
    protected function notifyRejectedByApprover(CoSupervisorInvitation $invitation)
    {
        $relationship = $invitation->relationship;

        // Notify co-supervisor
        $invitation->cosupervisor->user->notify(new CoSupervisorRejectedByApprover($invitation));

        // Notify initiator
        if ($invitation->initiated_by === CoSupervisorInvitation::INITIATED_BY_STUDENT) {
            $relationship->student->user->notify(new CoSupervisorRejectedByApprover($invitation));
        } else {
            $relationship->academician->user->notify(new CoSupervisorRejectedByApprover($invitation));
        }
    }

    /**
     * Notify all parties when co-supervisor is added
     */
    protected function notifyCoSupervisorAdded(CoSupervisorInvitation $invitation, SupervisionRelationship $cosupervisorRelationship)
    {
        $relationship = $invitation->relationship;

        // Notify student
        $relationship->student->user->notify(new CoSupervisorAdded($invitation, $cosupervisorRelationship));

        // Notify main supervisor
        $relationship->academician->user->notify(new CoSupervisorAdded($invitation, $cosupervisorRelationship));

        // Notify co-supervisor
        $invitation->cosupervisor->user->notify(new CoSupervisorAdded($invitation, $cosupervisorRelationship));
    }
}

