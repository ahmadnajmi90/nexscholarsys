<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SupervisionRequestRejected extends Notification implements ShouldQueue
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
            ->subject(__('Supervision Request Update'))
            ->markdown('emails.supervision.request_rejected', [
                'request' => $this->request,
                'student' => $notifiable,
                'conversationUrl' => route('messaging.inbox', ['cid' => $this->request->conversation_id]),
            ]);
    }

    public function toArray($notifiable)
    {
        // Get supervisor profile picture
        $supervisorProfilePicture = null;
        $supervisor = $this->request->supervisor;
        if ($supervisor && $supervisor->academician) {
            $supervisorProfilePicture = $supervisor->academician->profile_picture;
        }

        return [
            'type' => 'request_rejected',
            'request_id' => $this->request->id,
            'student_id' => $this->request->student_id,
            'academician_id' => $this->request->academician_id,
            'reason' => $this->request->cancel_reason,
            'supervisor_name' => $supervisor->full_name ?? 'Supervisor',
            'supervisor_profile_picture' => $supervisorProfilePicture,
        ];
    }
}

