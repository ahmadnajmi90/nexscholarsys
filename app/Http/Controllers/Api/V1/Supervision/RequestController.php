<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Http\Resources\Supervision\SupervisionRequestResource;
use App\Models\Academician;
use App\Models\SupervisionRequest;
use App\Models\Postgraduate;
use App\Services\Supervision\SupervisionRequestService;
use App\Notifications\Supervision\SupervisionRequestCancelled;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

class RequestController extends Controller
{
    public function __construct(protected SupervisionRequestService $requestService)
    {
        $this->middleware('auth');
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        if ($user->postgraduate) {
            $requests = SupervisionRequest::with([
                'academician.user',
                'academician.universityDetails',
                'academician.faculty',
                'attachments',
                'meetings'
            ])
                ->where('student_id', $user->postgraduate->postgraduate_id)
                ->orderByDesc('submitted_at')
                ->get();
        } elseif ($user->academician) {
            $requests = SupervisionRequest::with([
                'student.user',
                'student.universityDetails',
                'student.faculty',
                'attachments',
                'notes.author',
                'meetings'
            ])
                ->where('academician_id', $user->academician->academician_id)
                ->orderByDesc('submitted_at')
                ->get();
        } else {
            throw ValidationException::withMessages([
                'user' => __('Only postgraduates and academicians can access supervision requests.'),
            ]);
        }

        return SupervisionRequestResource::collection($requests);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'academician_id' => ['required', 'string'],
            'postgraduate_program_id' => ['nullable', 'exists:postgraduate_programs,id'],
            'proposal_title' => ['required', 'string', 'max:255'],
            'motivation' => ['required', 'string'],
            'attachments.proposal' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'attachments.transcript' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
            'attachments.background' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'attachments.portfolio' => ['nullable', 'file', 'max:10240'],
        ]);

        $student = $this->resolveStudent($request);
        $academician = Academician::where('academician_id', $data['academician_id'])->firstOrFail();

        $supervisionRequest = $this->requestService->submitRequest($student, $academician, $data);

        return new SupervisionRequestResource($supervisionRequest->load(['attachments', 'academician.user']));
    }

    public function cancel(Request $request, $requestId)
    {
        $student = $this->resolveStudent($request);

        $supervisionRequest = SupervisionRequest::findOrFail($requestId);

        if ($supervisionRequest->student_id !== $student->postgraduate_id) {
            abort(403, 'You do not have permission to cancel this request.');
        }

        if (!in_array($supervisionRequest->status, [SupervisionRequest::STATUS_PENDING])) {
            return response()->json([
                'message' => 'Only pending requests can be cancelled.'
            ], 422);
        }

        $supervisionRequest->update([
            'status' => SupervisionRequest::STATUS_CANCELLED,
            'decision_at' => now(),
            'cancel_reason' => 'student_cancelled',
        ]);

        // Load student for notification
        $supervisionRequest->load('student', 'academician');

        // Notify supervisor about the cancellation
        $supervisionRequest->academician?->user?->notify(new SupervisionRequestCancelled($supervisionRequest));

        return response()->json(['success' => true]);
    }

    protected function resolveStudent(Request $request): Postgraduate
    {
        $user = $request->user();
        if (!$user->postgraduate) {
            throw ValidationException::withMessages([
                'student' => __('Only postgraduates can submit supervision requests.'),
            ]);
        }

        return $user->postgraduate;
    }
}

