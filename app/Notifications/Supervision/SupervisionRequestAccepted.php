<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRelationship;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SupervisionRequestAccepted extends Notification
{
    use Queueable;

    public function __construct(protected SupervisionRelationship $relationship)
    {
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(__('Supervision Request Accepted'))
            ->markdown('emails.supervision.request_accepted', [
                'relationship' => $this->relationship,
                'student' => $notifiable,
                'conversationUrl' => route('messaging.inbox', ['cid' => $this->relationship->conversation_id]),
            ]);
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'request_accepted',
            'relationship_id' => $this->relationship->id,
            'student_id' => $this->relationship->student_id,
            'academician_id' => $this->relationship->academician_id,
        ];
    }
}

