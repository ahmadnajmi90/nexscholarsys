<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Http\Resources\Supervision\SupervisionRelationshipResource;
use App\Models\SupervisionRequest;
use App\Notifications\Supervision\SupervisionRequestRejected;
use App\Notifications\Supervision\SupervisionOfferReceived;
use App\Notifications\Supervision\StudentRejectedOffer;
use App\Services\Supervision\SupervisionRelationshipService;
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
    public function accept(Request $request, SupervisionRequest $supervisionRequest = null)
    {
        $user = $request->user();
        
        Log::info('Accept Request Debug', [
            'user_id' => $user->id,
            'has_academician' => (bool)$user->academician,
            'user_academician_id' => $user->academician?->academician_id ?? null,
            'request_object_is_null' => is_null($supervisionRequest),
            'request_academician_id' => $supervisionRequest?->academician_id ?? null,
            'request_id' => $supervisionRequest?->id ?? null,
            'request_status' => $supervisionRequest?->status ?? null,
            'route_parameter' => $request->route('request'),
            'all_route_parameters' => $request->route()->parameters(),
        ]);
        
        if (!$supervisionRequest) {
            abort(404, 'Supervision request not found.');
        }
        
        if (!$user->academician) {
            abort(403, 'Only academicians can accept supervision requests.');
        }
        
        if ($user->academician->academician_id !== $supervisionRequest->academician_id) {
            abort(403, 'You can only accept supervision requests sent to you.');
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

        // Load academician relationship for notification
        $supervisionRequest->load('academician');

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
    public function reject(Request $request, SupervisionRequest $supervisionRequest)
    {
        $user = $request->user();
        
        if (!$user->academician) {
            abort(403, 'Only academicians can reject supervision requests.');
        }
        
        if ($user->academician->academician_id !== $supervisionRequest->academician_id) {
            abort(403, 'You can only reject supervision requests sent to you.');
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
        $user = $request->user();
        
        if (!$user->postgraduate) {
            abort(403, 'Only postgraduate students can accept supervision offers.');
        }
        
        if ($user->postgraduate->postgraduate_id !== $supervisionRequest->student_id) {
            abort(403, 'You can only accept your own supervision offers.');
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

    /**
     * Student rejects the supervisor's offer
     */
    public function studentReject(Request $request, SupervisionRequest $supervisionRequest)
    {
        $user = $request->user();
        
        if (!$user->postgraduate) {
            abort(403, 'Only postgraduate students can reject supervision offers.');
        }
        
        if ($user->postgraduate->postgraduate_id !== $supervisionRequest->student_id) {
            abort(403, 'You can only reject your own supervision offers.');
        }

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

