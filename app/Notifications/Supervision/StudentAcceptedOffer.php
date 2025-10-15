<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRelationship;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentAcceptedOffer extends Notification implements ShouldQueue
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
            ->subject(__('Student Accepted Your Supervision Offer'))
            ->markdown('emails.supervision.student_accepted_offer', [
                'relationship' => $this->relationship,
                'supervisor' => $notifiable,
                'conversationUrl' => route('messaging.inbox', ['cid' => $this->relationship->conversation_id]),
            ]);
    }

    public function toArray($notifiable)
    {
        // Get student profile picture
        $studentProfilePicture = null;
        $student = $this->relationship->student;
        if ($student) {
            if ($student->postgraduate) {
                $studentProfilePicture = $student->postgraduate->profile_picture;
            } elseif ($student->undergraduate) {
                $studentProfilePicture = $student->undergraduate->profile_picture;
            }
        }

        return [
            'type' => 'student_accepted_offer',
            'relationship_id' => $this->relationship->id,
            'student_id' => $this->relationship->student_id,
            'academician_id' => $this->relationship->academician_id,
            'student_name' => $this->relationship->student->full_name ?? 'Student',
            'student_profile_picture' => $studentProfilePicture,
            'message' => __(':student has accepted your supervision offer! The relationship is now active.', [
                'student' => $this->relationship->student->full_name ?? 'A student',
            ]),
        ];
    }
}

