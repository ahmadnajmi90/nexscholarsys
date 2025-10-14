<?php

namespace App\Notifications\Supervision;

use App\Models\CoSupervisorInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CoSupervisorApprovalNeeded extends Notification implements ShouldQueue
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
        $student = $relationship->student;
        $mainSupervisor = $relationship->academician;

        return (new MailMessage)
            ->subject('Co-Supervisor Invitation Needs Your Approval')
            ->markdown('emails.supervision.cosupervisor-approval-needed', [
                'invitation' => $this->invitation,
                'cosupervisor' => $cosupervisor,
                'student' => $student,
                'mainSupervisor' => $mainSupervisor,
                'approverRole' => $this->invitation->getApproverRole(),
            ]);
    }

    public function toArray($notifiable)
    {
        $cosupervisor = $this->invitation->cosupervisor;
        $initiator = $this->invitation->initiated_by === 'student' 
            ? $this->invitation->relationship->student->user->full_name
            : $this->invitation->relationship->academician->user->full_name;

        return [
            'type' => 'cosupervisor_approval_needed',
            'invitation_id' => $this->invitation->id,
            'relationship_id' => $this->invitation->relationship_id,
            'cosupervisor_name' => $cosupervisor->user->full_name,
            'cosupervisor_id' => $cosupervisor->academician_id,
            'initiator' => $initiator,
            'initiated_by' => $this->invitation->initiated_by,
            'message' => "{$cosupervisor->user->full_name} accepted the invitation from {$initiator}. Your approval is required.",
        ];
    }
}
