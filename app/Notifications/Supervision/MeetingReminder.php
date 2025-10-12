<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionMeeting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MeetingReminder extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected SupervisionMeeting $meeting, protected string $reminderType = '24h')
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

        $otherPartyName = $isSupervisor
            ? ($this->meeting->relationship?->student->full_name ?? $this->meeting->request?->student->full_name ?? 'Student')
            : ($this->meeting->relationship?->academician->full_name ?? $this->meeting->request?->academician->full_name ?? 'Supervisor');

        $reminderText = $this->reminderType === '1h' ? 'in 1 hour' : 'in 24 hours';

        return (new MailMessage)
            ->subject(__('Meeting Reminder: :title', ['title' => $this->meeting->title]))
            ->markdown('emails.supervision.meeting_reminder', [
                'meeting' => $this->meeting,
                'recipient' => $notifiable,
                'otherPartyName' => $otherPartyName,
                'reminderText' => $reminderText,
            ]);
    }

    public function toArray($notifiable)
    {
        $isSupervisor = $notifiable->academician && (
            $notifiable->academician->academician_id === $this->meeting->relationship?->academician_id ||
            $notifiable->academician->academician_id === $this->meeting->request?->academician_id
        );

        $otherPartyName = $isSupervisor
            ? ($this->meeting->relationship?->student->full_name ?? $this->meeting->request?->student->full_name ?? 'Student')
            : ($this->meeting->relationship?->academician->full_name ?? $this->meeting->request?->academician->full_name ?? 'Supervisor');

        $reminderText = $this->reminderType === '1h' ? 'in 1 hour' : 'in 24 hours';

        return [
            'type' => 'meeting_reminder',
            'meeting_id' => $this->meeting->id,
            'relationship_id' => $this->meeting->supervision_relationship_id,
            'request_id' => $this->meeting->supervision_request_id,
            'title' => $this->meeting->title,
            'scheduled_for' => $this->meeting->scheduled_for->toISOString(),
            'location_link' => $this->meeting->location_link,
            'other_party_name' => $otherPartyName,
            'reminder_type' => $this->reminderType,
            'message' => __('Reminder: Meeting with :name ":title" starting :when', [
                'name' => $otherPartyName,
                'title' => $this->meeting->title,
                'when' => $reminderText,
            ]),
        ];
    }
}

