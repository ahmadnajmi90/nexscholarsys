<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Http\Resources\Supervision\SupervisionRelationshipResource;
use App\Models\SupervisionRequest;
use App\Notifications\Supervision\SupervisionRequestRejected;
use App\Notifications\Supervision\SupervisionOfferReceived;
use App\Notifications\Supervision\StudentRejectedOffer;
use App\Services\Supervision\SupervisionRelationshipService;
use App\Http\Requests\Supervision\AcceptSupervisionRequestRequest;
use App\Http\Requests\Supervision\RejectSupervisionRequestRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class DecisionController extends Controller
{
    public function __construct(protected SupervisionRelationshipService $relationshipService)
    {
        $this->middleware('auth');
    }

    /**
     * Supervisor accepts the request - changes status to pending_student_acceptance
     */
    public function accept(AcceptSupervisionRequestRequest $request, SupervisionRequest $supervisionRequest = null)
    {
        if (!$supervisionRequest) {
            abort(404, 'Supervision request not found.');
        }

        if ($supervisionRequest->status !== SupervisionRequest::STATUS_PENDING) {
            throw ValidationException::withMessages([
                'status' => __('This request is no longer pending.'),
            ]);
        }

        $data = $request->validated();

        // Store offer details for when student accepts
        $supervisionRequest->update([
            'status' => SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE,
            'welcome_message' => $data['welcome_message'] ?? null,
            'offer_details' => [
                'cohort_start_term' => $data['cohort_start_term'],
                'supervision_role' => $data['supervision_role'] === 'main_supervisor' ? 'main' : 'co',
                'meeting_cadence' => $data['meeting_cadence'],
                'create_scholarlab' => $data['create_scholarlab'] ?? false,
                'onboarding_checklist' => $data['onboarding_checklist'] ?? [],
            ],
        ]);

        // Eager load relationships for notification (prevent N+1)
        $supervisionRequest->load(['academician.user', 'student.user']);

        // Notify student about the offer
        $supervisionRequest->student?->user?->notify(new SupervisionOfferReceived($supervisionRequest));

        return response()->json([
            'success' => true,
            'message' => 'Supervision offer sent to student',
            'data' => $supervisionRequest->fresh(),
        ]);
    }

    /**
     * Supervisor rejects the request
     */
    public function reject(RejectSupervisionRequestRequest $request, SupervisionRequest $supervisionRequest)
    {
        if ($supervisionRequest->status !== SupervisionRequest::STATUS_PENDING) {
            throw ValidationException::withMessages([
                'status' => __('This request is no longer pending.'),
            ]);
        }

        $data = $request->validated();

        $supervisionRequest->update([
            'status' => SupervisionRequest::STATUS_REJECTED,
            'decision_at' => now(),
            'cancel_reason' => $data['reason'],
            'rejection_feedback' => $data['feedback'] ?? null,
            'recommended_supervisors' => $data['recommended_supervisors'] ?? null,
            'suggested_keywords' => $data['suggested_keywords'] ?? null,
        ]);

        // Load academician relationship for email template
        $supervisionRequest->load('academician');

        $supervisionRequest->student?->user?->notify(new SupervisionRequestRejected($supervisionRequest));

        return response()->json([
            'success' => true,
            'message' => 'Supervision request rejected and student notified',
        ]);
    }

    /**
     * Student accepts the supervisor's offer - creates the relationship
     */
    public function studentAccept(Request $request, SupervisionRequest $supervisionRequest)
    {
        // Use policy for authorization
        $this->authorize('acceptOffer', $supervisionRequest);

        if ($supervisionRequest->status !== SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE) {
            throw ValidationException::withMessages([
                'status' => __('This offer is not available for acceptance.'),
            ]);
        }

        // Now create the supervision relationship using the stored offer details
        $offerDetails = $supervisionRequest->offer_details ?? [];
        
        $relationship = $this->relationshipService->createRelationshipFromOffer(
            $supervisionRequest,
            $offerDetails
        );

        return new SupervisionRelationshipResource($relationship->load(['student.user', 'academician.user', 'onboardingChecklistItems']));
    }

    /**
     * Student rejects the supervisor's offer
     */
    public function studentReject(Request $request, SupervisionRequest $supervisionRequest)
    {
        // Use policy for authorization
        $this->authorize('rejectOffer', $supervisionRequest);

        if ($supervisionRequest->status !== SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE) {
            throw ValidationException::withMessages([
                'status' => __('This offer is not available for rejection.'),
            ]);
        }

        // Update request status to rejected
        $supervisionRequest->update([
            'status' => SupervisionRequest::STATUS_REJECTED,
            'decision_at' => now(),
        ]);

        // Load academician for notification
        $supervisionRequest->load('academician', 'student');

        // Notify supervisor about the rejection
        $supervisionRequest->academician?->user?->notify(new StudentRejectedOffer($supervisionRequest));

        return response()->json([
            'success' => true,
            'message' => 'Supervision offer rejected',
        ]);
    }
}

