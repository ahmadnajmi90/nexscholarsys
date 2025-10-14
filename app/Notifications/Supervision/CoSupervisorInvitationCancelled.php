<?php

namespace App\Notifications\Supervision;

use App\Models\CoSupervisorInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CoSupervisorInvitationCancelled extends Notification implements ShouldQueue
{
    use Queueable;

    protected $invitation;

    public function __construct(CoSupervisorInvitation $invitation)
    {
        $this->invitation = $invitation;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $relationship = $this->invitation->relationship;
        $initiator = $this->invitation->initiated_by === 'student'
            ? $relationship->student->user->full_name
            : $relationship->academician->user->full_name;

        return (new MailMessage)
            ->subject('Co-Supervisor Invitation Cancelled')
            ->markdown('emails.supervision.cosupervisor-invitation-cancelled', [
                'invitation' => $this->invitation,
                'initiator' => $initiator,
                'student' => $relationship->student,
                'mainSupervisor' => $relationship->academician,
            ]);
    }

    public function toArray($notifiable)
    {
        $relationship = $this->invitation->relationship;
        $initiator = $this->invitation->initiated_by === 'student'
            ? $relationship->student->user->full_name
            : $relationship->academician->user->full_name;

        return [
            'type' => 'cosupervisor_invitation_cancelled',
            'invitation_id' => $this->invitation->id,
            'relationship_id' => $this->invitation->relationship_id,
            'initiator' => $initiator,
            'initiated_by' => $this->invitation->initiated_by,
            'message' => "The co-supervisor invitation has been cancelled by {$initiator}.",
        ];
    }
}
