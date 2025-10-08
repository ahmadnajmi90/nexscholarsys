<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SupervisionRequestSubmitted extends Notification
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
            ->subject(__('New Supervision Request'))
            ->markdown('emails.supervision.request_submitted', [
                'request' => $this->request,
                'supervisor' => $notifiable,
                'conversationUrl' => route('messaging.inbox', ['cid' => $this->request->conversation_id]),
            ]);
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'request_submitted',
            'request_id' => $this->request->id,
            'student_id' => $this->request->student_id,
            'academician_id' => $this->request->academician_id,
            'student_name' => $this->request->student->full_name ?? 'Student',
            'proposal_title' => $this->request->proposal_title,
            'message' => __(':student submitted a new supervision request for ":title"', [
                'student' => $this->request->student->full_name ?? 'A student',
                'title' => $this->request->proposal_title ?? 'a research proposal',
            ]),
        ];
    }
}

