<?php

namespace App\Notifications\Supervision;

use App\Models\CoSupervisorInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CoSupervisorAccepted extends Notification implements ShouldQueue
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
        $cosupervisor = $this->invitation->cosupervisor;

        return (new MailMessage)
            ->subject('Co-Supervisor Accepted Invitation')
            ->markdown('emails.supervision.cosupervisor-accepted', [
                'invitation' => $this->invitation,
                'cosupervisor' => $cosupervisor,
                'student' => $relationship->student,
                'mainSupervisor' => $relationship->academician,
            ]);
    }

    public function toArray($notifiable)
    {
        $cosupervisor = $this->invitation->cosupervisor;
        $approverRole = $this->invitation->getApproverRole();

        return [
            'type' => 'cosupervisor_accepted',
            'invitation_id' => $this->invitation->id,
            'relationship_id' => $this->invitation->relationship_id,
            'cosupervisor_name' => $cosupervisor->user->full_name,
            'cosupervisor_id' => $cosupervisor->academician_id,
            'cosupervisor_profile_picture' => $cosupervisor->profile_picture,
            'message' => "{$cosupervisor->user->full_name} has accepted the co-supervisor invitation. Waiting for " . 
                         ($approverRole === 'student' ? 'student' : 'main supervisor') . " approval.",
        ];
    }
}
