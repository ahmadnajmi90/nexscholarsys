<?php

namespace App\Services\Supervision;

use App\Models\SupervisionRequest;
use App\Models\SupervisionRequestAttachment;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\PotentialSupervisor;
use App\Models\Messaging\Conversation;
use App\Notifications\Supervision\SupervisionRequestSubmitted;
use App\Services\Messaging\ConversationService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class SupervisionRequestService
{
    public function __construct(
        protected ConversationService $conversationService,
    ) {}

    public function submitRequest(Postgraduate $student, Academician $academician, array $data): SupervisionRequest
    {
        return DB::transaction(function () use ($student, $academician, $data) {
            $pendingCount = SupervisionRequest::where('student_id', $student->postgraduate_id)
                ->whereIn('status', [
                    SupervisionRequest::STATUS_PENDING,
                    SupervisionRequest::STATUS_ACCEPTED,
                ])->count();

            if ($pendingCount >= 5) {
                throw ValidationException::withMessages([
                    'academician_id' => __('You can only have up to five active supervision requests.'),
                ]);
            }

            // Check for existing active request (exclude cancelled, auto-cancelled, and rejected)
            // Students can re-submit requests after rejection
            $existingRequest = SupervisionRequest::where('student_id', $student->postgraduate_id)
                ->where('academician_id', $academician->academician_id)
                ->whereNotIn('status', [
                    SupervisionRequest::STATUS_CANCELLED,
                    SupervisionRequest::STATUS_AUTO_CANCELLED,
                    SupervisionRequest::STATUS_REJECTED,
                ])->first();

            if ($existingRequest) {
                throw ValidationException::withMessages([
                    'academician_id' => __('You already have an active request with this supervisor.'),
                ]);
            }

            $conversation = $this->conversationService->findDirectConversation(
                $student->user->id,
                $academician->user->id,
            );

            if (!$conversation) {
                $conversation = $this->conversationService->createDirectConversation(
                    $student->user,
                    $academician->user
                );
            }

            $request = SupervisionRequest::create([
                'student_id' => $student->postgraduate_id,
                'academician_id' => $academician->academician_id,
                'postgraduate_program_id' => $data['postgraduate_program_id'] ?? null,
                'proposal_title' => $data['proposal_title'],
                'motivation' => $data['motivation'],
                'status' => SupervisionRequest::STATUS_PENDING,
                'submitted_at' => now(),
                'conversation_id' => $conversation->id,
            ]);

            $this->syncAttachments($request, Arr::get($data, 'attachments', []));

            // Auto-add supervisor to potential supervisors list when request is submitted
            PotentialSupervisor::updateOrCreate(
                [
                    'student_id' => $student->postgraduate_id,
                    'academician_id' => $academician->academician_id,
                ],
                [
                    'postgraduate_program_id' => $data['postgraduate_program_id'] ?? null,
                ]
            );

            // Load student relationship for notification
            $request->load('student');

            $academician->user?->notify(new SupervisionRequestSubmitted($request));

            return $request;
        });
    }

    protected function syncAttachments(SupervisionRequest $request, array $attachments): void
    {
        foreach ($attachments as $type => $file) {
            // Check if the file is actually an UploadedFile instance
            if ($file && method_exists($file, 'store')) {
                // Store in the 'public' disk to make files accessible
                $path = $file->store('supervision/attachments', 'public');
                SupervisionRequestAttachment::create([
                    'supervision_request_id' => $request->id,
                    'type' => $type,
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            }
        }
    }
}

