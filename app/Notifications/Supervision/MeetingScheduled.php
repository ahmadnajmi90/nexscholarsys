<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionMeeting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MeetingScheduled extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected SupervisionMeeting $meeting)
    {
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $isSupervisor = $notifiable->academician && (
            $notifiable->academician->academician_id === $this->meeting->relationship?->academician_id ||
            $notifiable->academician->academician_id === $this->meeting->request?->academician_id
        );

        $schedulerName = $isSupervisor
            ? ($this->meeting->relationship?->student->full_name ?? $this->meeting->request?->student->full_name ?? 'Student')
            : ($this->meeting->relationship?->academician->full_name ?? $this->meeting->request?->academician->full_name ?? 'Supervisor');

        return (new MailMessage)
            ->subject(__('New Supervision Meeting Scheduled'))
            ->markdown('emails.supervision.meeting_scheduled', [
                'meeting' => $this->meeting,
                'recipient' => $notifiable,
                'schedulerName' => $schedulerName,
                'isSupervisor' => $isSupervisor,
            ]);
    }

    public function toArray($notifiable)
    {
        $isSupervisor = $notifiable->academician && (
            $notifiable->academician->academician_id === $this->meeting->relationship?->academician_id ||
            $notifiable->academician->academician_id === $this->meeting->request?->academician_id
        );

        // Get scheduler (opposite of recipient)
        if ($isSupervisor) {
            $scheduler = $this->meeting->relationship?->student ?? $this->meeting->request?->student;
            $schedulerName = $scheduler?->full_name ?? 'Student';
            $schedulerProfilePicture = $scheduler?->postgraduate?->profile_picture ?? $scheduler?->undergraduate?->profile_picture ?? null;
        } else {
            $scheduler = $this->meeting->relationship?->academician ?? $this->meeting->request?->academician;
            $schedulerName = $scheduler?->full_name ?? 'Supervisor';
            $schedulerProfilePicture = $scheduler?->profile_picture ?? null;
        }

        return [
            'type' => 'meeting_scheduled',
            'meeting_id' => $this->meeting->id,
            'relationship_id' => $this->meeting->supervision_relationship_id,
            'request_id' => $this->meeting->supervision_request_id,
            'title' => $this->meeting->title,
            'scheduled_for' => $this->meeting->scheduled_for->toISOString(),
            'location_link' => $this->meeting->location_link,
            'scheduler_name' => $schedulerName,
            'scheduler_profile_picture' => $schedulerProfilePicture,
            'message' => __(':scheduler has scheduled a meeting: ":title" on :date', [
                'scheduler' => $schedulerName,
                'title' => $this->meeting->title,
                'date' => $this->meeting->scheduled_for->format('d/m/Y H:i'),
            ]),
        ];
    }
}

