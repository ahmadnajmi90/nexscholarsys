<?php

namespace App\Notifications\Supervision;

use App\Models\CoSupervisorInvitation;
use App\Models\SupervisionRelationship;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CoSupervisorAdded extends Notification implements ShouldQueue
{
    use Queueable;

    protected $invitation;
    protected $cosupervisorRelationship;

    public function __construct(CoSupervisorInvitation $invitation, SupervisionRelationship $cosupervisorRelationship)
    {
        $this->invitation = $invitation;
        $this->cosupervisorRelationship = $cosupervisorRelationship;
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
            ->subject('Co-Supervisor Successfully Added')
            ->markdown('emails.supervision.cosupervisor-added', [
                'invitation' => $this->invitation,
                'cosupervisor' => $cosupervisor,
                'student' => $relationship->student,
                'mainSupervisor' => $relationship->academician,
            ]);
    }

    public function toArray($notifiable)
    {
        $relationship = $this->invitation->relationship;
        $cosupervisor = $this->invitation->cosupervisor;
        $student = $relationship->student;

        return [
            'type' => 'cosupervisor_added',
            'invitation_id' => $this->invitation->id,
            'relationship_id' => $relationship->id,
            'cosupervisor_relationship_id' => $this->cosupervisorRelationship->id,
            'cosupervisor_name' => $cosupervisor->user->full_name,
            'cosupervisor_id' => $cosupervisor->academician_id,
            'student_name' => $student->user->full_name,
            'student_id' => $student->postgraduate_id,
            'message' => "{$cosupervisor->user->full_name} has been successfully added as co-supervisor for {$student->user->full_name}.",
        ];
    }
}
