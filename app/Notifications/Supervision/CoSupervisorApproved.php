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
        $relationship = $this->invitation->relationship;
        
        // Get approver details
        if ($this->invitation->getApproverRole() === 'student') {
            $approver = $relationship->student->user->full_name;
            $approverProfilePicture = $relationship->student->profile_picture;
        } else {
            $approver = $relationship->academician->user->full_name;
            $approverProfilePicture = $relationship->academician->profile_picture;
        }

        return [
            'type' => 'cosupervisor_approved',
            'invitation_id' => $this->invitation->id,
            'relationship_id' => $this->invitation->relationship_id,
            'cosupervisor_name' => $cosupervisor->user->full_name,
            'cosupervisor_id' => $cosupervisor->academician_id,
            'cosupervisor_profile_picture' => $cosupervisor->profile_picture,
            'approver' => $approver,
            'approver_profile_picture' => $approverProfilePicture,
            'message' => "The co-supervisor invitation for {$cosupervisor->user->full_name} has been approved by {$approver}.",
        ];
    }
}
