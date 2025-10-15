<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRelationship;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SupervisionRequestAccepted extends Notification implements ShouldQueue
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
        // Get supervisor profile picture
        $supervisorProfilePicture = null;
        $supervisor = $this->relationship->supervisor;
        if ($supervisor && $supervisor->academician) {
            $supervisorProfilePicture = $supervisor->academician->profile_picture;
        }

        return [
            'type' => 'request_accepted',
            'relationship_id' => $this->relationship->id,
            'student_id' => $this->relationship->student_id,
            'academician_id' => $this->relationship->academician_id,
            'supervisor_name' => $supervisor->full_name ?? 'Supervisor',
            'supervisor_profile_picture' => $supervisorProfilePicture,
        ];
    }
}

