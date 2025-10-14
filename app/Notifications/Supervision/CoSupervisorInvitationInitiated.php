<?php

namespace App\Notifications\Supervision;

use App\Models\CoSupervisorInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CoSupervisorInvitationInitiated extends Notification implements ShouldQueue
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
        $student = $relationship->student;
        $mainSupervisor = $relationship->academician;
        $cosupervisor = $this->invitation->cosupervisor;
        $initiator = $this->invitation->initiated_by === 'student' ? $student->user->full_name : $mainSupervisor->user->full_name;

        return (new MailMessage)
            ->subject('Co-Supervisor Invitation Initiated')
            ->markdown('emails.supervision.cosupervisor-invitation-initiated', [
                'invitation' => $this->invitation,
                'student' => $student,
                'mainSupervisor' => $mainSupervisor,
                'cosupervisor' => $cosupervisor,
                'initiator' => $initiator,
                'initiatorRole' => $this->invitation->initiated_by === 'student' ? 'Student' : 'Main Supervisor',
            ]);
    }

    public function toArray($notifiable)
    {
        $relationship = $this->invitation->relationship;
        $student = $relationship->student;
        $mainSupervisor = $relationship->academician;
        $cosupervisor = $this->invitation->cosupervisor;

        return [
            'type' => 'cosupervisor_invitation_initiated',
            'invitation_id' => $this->invitation->id,
            'relationship_id' => $relationship->id,
            'student_name' => $student->user->full_name,
            'student_id' => $student->postgraduate_id,
            'main_supervisor_name' => $mainSupervisor->user->full_name,
            'cosupervisor_name' => $cosupervisor->user->full_name,
            'initiated_by' => $this->invitation->initiated_by,
            'invitation_message' => $this->invitation->invitation_message,
            'message' => $this->invitation->initiated_by === 'student' 
                ? "{$student->user->full_name} wants to add {$cosupervisor->user->full_name} as a co-supervisor"
                : "{$mainSupervisor->user->full_name} wants to add {$cosupervisor->user->full_name} as co-supervisor for {$student->user->full_name}",
        ];
    }
}

