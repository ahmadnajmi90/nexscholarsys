<?php

namespace App\Notifications\Supervision;

use App\Models\CoSupervisorInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CoSupervisorApproved extends Notification implements ShouldQueue
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
            ->subject('Co-Supervisor Invitation Approved')
            ->markdown('emails.supervision.cosupervisor-approved', [
                'invitation' => $this->invitation,
                'cosupervisor' => $cosupervisor,
                'student' => $relationship->student,
                'mainSupervisor' => $relationship->academician,
            ]);
    }

    public function toArray($notifiable)
    {
        $cosupervisor = $this->invitation->cosupervisor;
        $approver = $this->invitation->getApproverRole() === 'student'
            ? $this->invitation->relationship->student->user->full_name
            : $this->invitation->relationship->academician->user->full_name;

        return [
            'type' => 'cosupervisor_approved',
            'invitation_id' => $this->invitation->id,
            'relationship_id' => $this->invitation->relationship_id,
            'cosupervisor_name' => $cosupervisor->user->full_name,
            'cosupervisor_id' => $cosupervisor->academician_id,
            'approver' => $approver,
            'message' => "The co-supervisor invitation for {$cosupervisor->user->full_name} has been approved by {$approver}.",
        ];
    }
}
