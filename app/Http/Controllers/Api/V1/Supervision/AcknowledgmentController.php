<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AcknowledgmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Student acknowledges rejection notification
     */
    public function acknowledgeRejection(Request $request)
    {
        $user = $request->user();

        if (!$user->postgraduate) {
            abort(403, 'Only students can acknowledge rejections.');
        }

        $data = $request->validate([
            'request_ids' => ['required', 'array', 'min:1'],
            'request_ids.*' => ['required', 'integer', 'exists:supervision_requests,id'],
        ]);

        // Update all provided request IDs
        SupervisionRequest::whereIn('id', $data['request_ids'])
            ->where('student_id', $user->postgraduate->postgraduate_id)
            ->where('status', SupervisionRequest::STATUS_REJECTED)
            ->whereNull('rejection_acknowledged_at')
            ->update([
                'rejection_acknowledged_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Rejection notifications acknowledged',
        ]);
    }

    /**
     * Student acknowledges supervisor offer notification
     */
    public function acknowledgeOffer(Request $request)
    {
        $user = $request->user();

        if (!$user->postgraduate) {
            abort(403, 'Only students can acknowledge offers.');
        }

        $data = $request->validate([
            'request_ids' => ['required', 'array', 'min:1'],
            'request_ids.*' => ['required', 'integer', 'exists:supervision_requests,id'],
        ]);

        // Update all provided request IDs
        SupervisionRequest::whereIn('id', $data['request_ids'])
            ->where('student_id', $user->postgraduate->postgraduate_id)
            ->where('status', SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE)
            ->whereNull('offer_acknowledged_at')
            ->update([
                'offer_acknowledged_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Offer notifications acknowledged',
        ]);
    }

    /**
     * Supervisor acknowledges student's response (accepted or rejected offer)
     */
    public function acknowledgeStudentResponse(Request $request)
    {
        $user = $request->user();

        if (!$user->academician) {
            abort(403, 'Only supervisors can acknowledge student responses.');
        }

        $data = $request->validate([
            'request_ids' => ['required', 'array', 'min:1'],
            'request_ids.*' => ['required', 'integer', 'exists:supervision_requests,id'],
        ]);

        // Update requests where student has responded (accepted or auto-cancelled)
        SupervisionRequest::whereIn('id', $data['request_ids'])
            ->where('academician_id', $user->academician->academician_id)
            ->whereIn('status', [
                SupervisionRequest::STATUS_ACCEPTED,
                SupervisionRequest::STATUS_AUTO_CANCELLED
            ])
            ->whereNull('student_response_acknowledged_at')
            ->update([
                'student_response_acknowledged_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Student response notifications acknowledged',
        ]);
    }
}

