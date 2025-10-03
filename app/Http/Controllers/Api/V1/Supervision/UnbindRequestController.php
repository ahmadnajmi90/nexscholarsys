<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionRelationship;
use App\Models\SupervisionRelationshipUnbindRequest;
use App\Services\Supervision\UnbindRequestService;
use Illuminate\Http\Request;

class UnbindRequestController extends Controller
{
    public function __construct(protected UnbindRequestService $unbindService)
    {
        $this->middleware('auth');
    }

    /**
     * Supervisor or Student initiates unbind request
     */
    public function initiate(Request $request, SupervisionRelationship $relationship)
    {
        $user = $request->user();

        // Authorization: Either supervisor or student of this relationship can initiate unbind
        $isSupervisor = $user->academician && $user->academician->academician_id === $relationship->academician_id;
        $isStudent = $user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id;

        if (!$isSupervisor && !$isStudent) {
            abort(403, 'You can only unbind your own supervision relationships.');
        }

        $data = $request->validate([
            'reason' => ['required', 'string', 'min:10', 'max:1000'],
        ]);

        try {
            $unbindRequest = $this->unbindService->initiateUnbindRequest($relationship, $user, $data['reason']);

            $approverRole = $isSupervisor ? 'student' : 'supervisor';
            
            return response()->json([
                'success' => true,
                'message' => $unbindRequest->status === SupervisionRelationshipUnbindRequest::STATUS_FORCE_UNBIND
                    ? __('Relationship has been terminated (3rd unbind request).')
                    : __('Unbind request sent to :role for approval.', ['role' => $approverRole]),
                'data' => [
                    'unbind_request' => $unbindRequest,
                    'is_force_unbind' => $unbindRequest->status === SupervisionRelationshipUnbindRequest::STATUS_FORCE_UNBIND,
                    'attempt_count' => $unbindRequest->attempt_count,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Student approves unbind request
     */
    public function approve(Request $request, SupervisionRelationshipUnbindRequest $unbindRequest)
    {
        $user = $request->user();

        // Authorization: Only the student in this relationship can approve
        $relationship = $unbindRequest->relationship;
        if (!$user->postgraduate || $user->postgraduate->postgraduate_id !== $relationship->student_id) {
            abort(403, 'You can only approve unbind requests for your own supervision relationships.');
        }

        try {
            $this->unbindService->approveUnbindRequest($unbindRequest, $user);

            return response()->json([
                'success' => true,
                'message' => __('Supervision relationship has been terminated.'),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Student rejects unbind request
     */
    public function reject(Request $request, SupervisionRelationshipUnbindRequest $unbindRequest)
    {
        $user = $request->user();

        // Authorization: Only the student in this relationship can reject
        $relationship = $unbindRequest->relationship;
        if (!$user->postgraduate || $user->postgraduate->postgraduate_id !== $relationship->student_id) {
            abort(403, 'You can only reject unbind requests for your own supervision relationships.');
        }

        try {
            $this->unbindService->rejectUnbindRequest($unbindRequest, $user);

            return response()->json([
                'success' => true,
                'message' => __('Unbind request rejected. Supervisor can request again after cooldown period.'),
                'data' => [
                    'cooldown_until' => $unbindRequest->fresh()->cooldown_until,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Supervisor approves unbind request (student-initiated)
     */
    public function supervisorApprove(Request $request, SupervisionRelationshipUnbindRequest $unbindRequest)
    {
        $user = $request->user();

        // Authorization: Only the supervisor in this relationship can approve
        $relationship = $unbindRequest->relationship;
        if (!$user->academician || $user->academician->academician_id !== $relationship->academician_id) {
            abort(403, 'You can only approve unbind requests for your own supervision relationships.');
        }

        try {
            $this->unbindService->supervisorApproveUnbindRequest($unbindRequest, $user);

            return response()->json([
                'success' => true,
                'message' => __('Supervision relationship has been terminated.'),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Supervisor rejects unbind request (student-initiated)
     */
    public function supervisorReject(Request $request, SupervisionRelationshipUnbindRequest $unbindRequest)
    {
        $user = $request->user();

        // Authorization: Only the supervisor in this relationship can reject
        $relationship = $unbindRequest->relationship;
        if (!$user->academician || $user->academician->academician_id !== $relationship->academician_id) {
            abort(403, 'You can only reject unbind requests for your own supervision relationships.');
        }

        try {
            $this->unbindService->supervisorRejectUnbindRequest($unbindRequest, $user);

            return response()->json([
                'success' => true,
                'message' => __('Unbind request rejected. Student can request again after cooldown period.'),
                'data' => [
                    'cooldown_until' => $unbindRequest->fresh()->cooldown_until,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * Get unbind requests for current user (both as supervisor and student)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $unbindRequests = collect();

        // Get unbind requests where user is the supervisor
        if ($user->academician) {
            $supervisorRequests = SupervisionRelationshipUnbindRequest::whereHas('relationship', function ($query) use ($user) {
                $query->where('academician_id', $user->academician->academician_id);
            })->with(['relationship.student.user'])->get();
            $unbindRequests = $unbindRequests->merge($supervisorRequests);
        }

        // Get unbind requests where user is the student
        if ($user->postgraduate) {
            $studentRequests = SupervisionRelationshipUnbindRequest::whereHas('relationship', function ($query) use ($user) {
                $query->where('student_id', $user->postgraduate->postgraduate_id);
            })->with(['relationship.academician.user'])->get();
            $unbindRequests = $unbindRequests->merge($studentRequests);
        }

        return response()->json([
            'success' => true,
            'data' => $unbindRequests->unique('id')->values(),
        ]);
    }
}

