<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Http\Resources\Supervision\SupervisionRelationshipResource;
use App\Models\SupervisionRequest;
use App\Notifications\Supervision\SupervisionRequestRejected;
use App\Services\Supervision\SupervisionRelationshipService;
use Illuminate\Http\Request;
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
    public function accept(Request $request, SupervisionRequest $supervisionRequest)
    {
        $user = $request->user();
        if (!$user->academician || $user->academician->academician_id !== $supervisionRequest->academician_id) {
            abort(403);
        }

        if ($supervisionRequest->status !== SupervisionRequest::STATUS_PENDING) {
            throw ValidationException::withMessages([
                'status' => __('This request is no longer pending.'),
            ]);
        }

        $data = $request->validate([
            'cohort_start_term' => ['required', 'string', 'max:255'],
            'supervision_role' => ['required', 'in:main_supervisor,co_supervisor'],
            'meeting_cadence' => ['required', 'string', 'max:255'],
            'welcome_message' => ['nullable', 'string', 'max:1000'],
            'create_scholarlab' => ['nullable', 'boolean'],
            'onboarding_checklist' => ['nullable', 'array'],
            'onboarding_checklist.*.task' => ['required', 'string'],
            'onboarding_checklist.*.completed' => ['boolean'],
        ]);

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

        // Notify student about the offer
        $supervisionRequest->student?->user?->notify(new \App\Notifications\Supervision\SupervisionOfferReceived($supervisionRequest));

        return response()->json([
            'success' => true,
            'message' => 'Supervision offer sent to student',
            'data' => $supervisionRequest->fresh(),
        ]);
    }

    /**
     * Supervisor rejects the request
     */
    public function reject(Request $request, SupervisionRequest $supervisionRequest)
    {
        $user = $request->user();
        if (!$user->academician || $user->academician->academician_id !== $supervisionRequest->academician_id) {
            abort(403);
        }

        if ($supervisionRequest->status !== SupervisionRequest::STATUS_PENDING) {
            throw ValidationException::withMessages([
                'status' => __('This request is no longer pending.'),
            ]);
        }

        $data = $request->validate([
            'reason' => ['required', 'string'],
            'feedback' => ['nullable', 'string'],
            'recommend_alternatives' => ['nullable', 'boolean'],
            'recommended_supervisors' => ['nullable', 'array'],
            'suggested_keywords' => ['nullable', 'string'],
        ]);

        $supervisionRequest->update([
            'status' => SupervisionRequest::STATUS_REJECTED,
            'decision_at' => now(),
            'cancel_reason' => $data['reason'],
            'rejection_feedback' => $data['feedback'] ?? null,
            'recommended_supervisors' => $data['recommended_supervisors'] ?? null,
            'suggested_keywords' => $data['suggested_keywords'] ?? null,
        ]);

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
        $user = $request->user();
        if (!$user->postgraduate || $user->postgraduate->postgraduate_id !== $supervisionRequest->student_id) {
            abort(403);
        }

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
}

