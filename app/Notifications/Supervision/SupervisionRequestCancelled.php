<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SupervisionRequestCancelled extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected SupervisionRequest $request)
    {
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(__('Supervision Request Cancelled'))
            ->markdown('emails.supervision.request_cancelled', [
                'request' => $this->request,
                'supervisor' => $notifiable,
                'conversationUrl' => route('messaging.inbox', ['cid' => $this->request->conversation_id]),
            ]);
    }

    public function toArray($notifiable)
    {
        // Get student profile picture
        $studentProfilePicture = null;
        $student = $this->request->student;
        if ($student) {
            if ($student->postgraduate) {
                $studentProfilePicture = $student->postgraduate->profile_picture;
            } elseif ($student->undergraduate) {
                $studentProfilePicture = $student->undergraduate->profile_picture;
            }
        }

        return [
            'type' => 'request_cancelled',
            'request_id' => $this->request->id,
            'student_id' => $this->request->student_id,
            'academician_id' => $this->request->academician_id,
            'student_name' => $this->request->student->full_name ?? 'Student',
            'student_profile_picture' => $studentProfilePicture,
            'proposal_title' => $this->request->proposal_title,
            'message' => __(':student has cancelled their supervision request for ":title".', [
                'student' => $this->request->student->full_name ?? 'A student',
                'title' => $this->request->proposal_title ?? 'the proposal',
            ]),
        ];
    }
}

