<?php

namespace App\Notifications\Supervision;

use App\Models\CoSupervisorInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CoSupervisorInvitationSent extends Notification implements ShouldQueue
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
        $initiator = $this->invitation->initiated_by === 'student' ? $student->user->full_name : $mainSupervisor->user->full_name;

        return (new MailMessage)
            ->subject('Co-Supervisor Invitation')
            ->markdown('emails.supervision.cosupervisor-invitation-sent', [
                'invitation' => $this->invitation,
                'student' => $student,
                'mainSupervisor' => $mainSupervisor,
                'initiator' => $initiator,
                'initiatorRole' => $this->invitation->initiated_by === 'student' ? 'Student' : 'Main Supervisor',
            ]);
    }

    public function toArray($notifiable)
    {
        $relationship = $this->invitation->relationship;
        $student = $relationship->student;
        $mainSupervisor = $relationship->academician;

        return [
            'type' => 'cosupervisor_invitation_sent',
            'invitation_id' => $this->invitation->id,
            'relationship_id' => $relationship->id,
            'student_name' => $student->user->full_name,
            'student_id' => $student->postgraduate_id,
            'main_supervisor_name' => $mainSupervisor->user->full_name,
            'initiated_by' => $this->invitation->initiated_by,
            'invitation_message' => $this->invitation->invitation_message,
            'message' => $this->invitation->initiated_by === 'student' 
                ? "{$student->user->full_name} has invited you to be their co-supervisor"
                : "{$mainSupervisor->user->full_name} has invited you to be co-supervisor for {$student->user->full_name}",
        ];
    }
}
