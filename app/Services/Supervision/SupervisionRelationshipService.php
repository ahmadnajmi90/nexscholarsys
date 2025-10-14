<?php

namespace App\Services\Supervision;

use App\Models\SupervisionRelationship;
use App\Models\SupervisionRequest;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Messaging\Conversation;
use App\Models\Connection;
use App\Services\Messaging\ConversationService;
use App\Notifications\Supervision\SupervisionRequestAccepted;
use App\Notifications\Supervision\SupervisionRequestRejected;
use App\Notifications\Supervision\StudentAcceptedOffer;
use App\Notifications\Supervision\SupervisionRequestAutoCancelled;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SupervisionRelationshipService
{
    public function __construct(
        protected ConversationService $conversationService,
        protected ScholarLabSupervisionService $scholarLabService,
    ) {}

    public function acceptRequest(SupervisionRequest $request, array $data): SupervisionRelationship
    {
        return DB::transaction(function () use ($request, $data) {
            if ($request->status !== SupervisionRequest::STATUS_PENDING) {
                throw ValidationException::withMessages([
                    'status' => __('This request is no longer pending.'),
                ]);
            }

            $student = Postgraduate::where('postgraduate_id', $request->student_id)->firstOrFail();
            $academician = Academician::where('academician_id', $request->academician_id)->firstOrFail();

            $existingMain = SupervisionRelationship::where('student_id', $student->postgraduate_id)
                ->where('role', SupervisionRelationship::ROLE_MAIN)
                ->where('status', SupervisionRelationship::STATUS_ACTIVE)
                ->first();

            if ($data['role'] === SupervisionRelationship::ROLE_MAIN && $existingMain) {
                throw ValidationException::withMessages([
                    'role' => __('Student already has a main supervisor'),
                ]);
            }

            $relationship = SupervisionRelationship::create([
                'student_id' => $student->postgraduate_id,
                'academician_id' => $academician->academician_id,
                'role' => $data['role'],
                'status' => SupervisionRelationship::STATUS_ACTIVE,
                'start_date' => $data['start_date'] ?? now()->toDateString(),
                'cohort' => $data['cohort'] ?? null,
                'meeting_cadence' => $data['meeting_cadence'] ?? null,
                'conversation_id' => $request->conversation_id,
                'accepted_at' => now(),
            ]);

            $request->update([
                'status' => SupervisionRequest::STATUS_ACCEPTED,
                'decision_at' => now(),
            ]);

            SupervisionRequest::where('student_id', $student->postgraduate_id)
                ->whereIn('status', [
                    SupervisionRequest::STATUS_PENDING,
                    SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE,
                ])
                ->where('id', '!=', $request->id)
                ->each(function ($pending) {
                    $pending->update([
                        'status' => SupervisionRequest::STATUS_AUTO_CANCELLED,
                        'decision_at' => now(),
                        'cancel_reason' => 'accepted_elsewhere',
                    ]);
                    $pending->academician?->user?->notify(new SupervisionRequestAutoCancelled($pending));
                });

            $this->ensureConnection($student->user->id, $academician->user->id);

            if (!empty($data['create_scholarlab_board'])) {
                $this->scholarLabService->createSupervisionWorkspace($relationship, $student, $academician, $data);
            }

            $student->user?->notify(new SupervisionRequestAccepted($relationship));

            return $relationship;
        });
    }

    protected function ensureConnection(int $studentUserId, int $academicianUserId): void
    {
        $existing = Connection::where(function ($q) use ($studentUserId, $academicianUserId) {
            $q->where('requester_id', $studentUserId)
                ->where('recipient_id', $academicianUserId);
        })->orWhere(function ($q) use ($studentUserId, $academicianUserId) {
            $q->where('requester_id', $academicianUserId)
                ->where('recipient_id', $studentUserId);
        })->first();

        if (!$existing) {
            Connection::create([
                'requester_id' => $academicianUserId,
                'recipient_id' => $studentUserId,
                'status' => 'accepted',
            ]);
        } elseif ($existing->status !== 'accepted') {
            $existing->update(['status' => 'accepted']);
        }
    }

    /**
     * Create supervision relationship from student's acceptance of supervisor's offer
     */
    public function createRelationshipFromOffer(SupervisionRequest $request, array $offerDetails): SupervisionRelationship
    {
        // Create core relationship in transaction
        $relationship = DB::transaction(function () use ($request, $offerDetails) {
            $student = Postgraduate::where('postgraduate_id', $request->student_id)->firstOrFail();
            $academician = Academician::where('academician_id', $request->academician_id)->firstOrFail();

            $role = $offerDetails['supervision_role'] ?? SupervisionRelationship::ROLE_MAIN;
            
            // Check if student already has a main supervisor
            $existingMain = SupervisionRelationship::where('student_id', $student->postgraduate_id)
                ->where('role', SupervisionRelationship::ROLE_MAIN)
                ->where('status', SupervisionRelationship::STATUS_ACTIVE)
                ->first();

            if ($role === SupervisionRelationship::ROLE_MAIN && $existingMain) {
                throw ValidationException::withMessages([
                    'role' => __('Student already has a main supervisor'),
                ]);
            }

            // Create the relationship
            $relationship = SupervisionRelationship::create([
                'student_id' => $student->postgraduate_id,
                'academician_id' => $academician->academician_id,
                'role' => $role,
                'status' => SupervisionRelationship::STATUS_ACTIVE,
                'start_date' => now()->toDateString(),
                'cohort' => $offerDetails['cohort_start_term'] ?? null,
                'meeting_cadence' => $offerDetails['meeting_cadence'] ?? null,
                'conversation_id' => $request->conversation_id,
                'accepted_at' => now(),
            ]);

            // Create onboarding checklist items
            if (!empty($offerDetails['onboarding_checklist'])) {
                foreach ($offerDetails['onboarding_checklist'] as $index => $item) {
                    \App\Models\SupervisionOnboardingChecklistItem::create([
                        'supervision_relationship_id' => $relationship->id,
                        'task' => $item['task'],
                        'completed' => false,
                        'order' => $index,
                    ]);
                }
            }

            // Update request status
            $request->update([
                'status' => SupervisionRequest::STATUS_ACCEPTED,
                'decision_at' => now(),
            ]);

            // Create timeline event for relationship creation
            try {
                \App\Models\SupervisionTimeline::create([
                    'entity_type' => SupervisionRelationship::class,
                    'entity_id' => $relationship->id,
                    'user_id' => $student->user_id ?? null,
                    'event_type' => 'relationship_created',
                    'description' => "Supervision relationship created as {$role} supervisor",
                    'metadata' => [
                        'request_id' => $request->id,
                        'role' => $role,
                        'cohort' => $offerDetails['cohort_start_term'] ?? null,
                        'meeting_cadence' => $offerDetails['meeting_cadence'] ?? null,
                    ],
                ]);
            } catch (\Exception $e) {
                \Log::error('Failed to create timeline event for relationship creation', [
                    'relationship_id' => $relationship->id,
                    'error' => $e->getMessage(),
                ]);
            }

            // Auto-cancel other pending requests
            SupervisionRequest::where('student_id', $student->postgraduate_id)
                ->whereIn('status', [
                    SupervisionRequest::STATUS_PENDING,
                    SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE,
                ])
                ->where('id', '!=', $request->id)
                ->each(function ($pending) {
                    $pending->update([
                        'status' => SupervisionRequest::STATUS_AUTO_CANCELLED,
                        'decision_at' => now(),
                        'cancel_reason' => 'accepted_elsewhere',
                    ]);
                    $pending->academician?->user?->notify(new SupervisionRequestAutoCancelled($pending));
                });

            // Ensure connection between student and supervisor
            $this->ensureConnection($student->user->id, $academician->user->id);

            return $relationship;
        });

        // Handle ScholarLab creation outside transaction to prevent rollback of core relationship
        if (!empty($offerDetails['create_scholarlab'])) {
            try {
                $student = $relationship->student;
                $academician = $relationship->academician;
                $this->scholarLabService->createSupervisionWorkspace($relationship, $student, $academician, $offerDetails);
            } catch (\Exception $e) {
                \Log::error('ScholarLab creation failed but relationship created successfully', [
                    'relationship_id' => $relationship->id,
                    'student_id' => $relationship->student_id,
                    'academician_id' => $relationship->academician_id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                // Could queue a job to retry ScholarLab creation
                // dispatch(new CreateScholarLabWorkspace($relationship, $offerDetails))->delay(now()->addMinutes(5));
            }
        }

        // Send notifications
        $relationship->student->user?->notify(new SupervisionRequestAccepted($relationship));
        $relationship->academician->user?->notify(new StudentAcceptedOffer($relationship));

        return $relationship;
    }
}

