<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionMeeting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MeetingUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected SupervisionMeeting $meeting, protected array $changes = [])
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

        $updaterName = $isSupervisor
            ? ($this->meeting->relationship?->student->full_name ?? $this->meeting->request?->student->full_name ?? 'Student')
            : ($this->meeting->relationship?->academician->full_name ?? $this->meeting->request?->academician->full_name ?? 'Supervisor');

        return (new MailMessage)
            ->subject(__('Meeting Updated: :title', ['title' => $this->meeting->title]))
            ->markdown('emails.supervision.meeting_updated', [
                'meeting' => $this->meeting,
                'recipient' => $notifiable,
                'updaterName' => $updaterName,
                'changes' => $this->changes,
            ]);
    }

    public function toArray($notifiable)
    {
        $isSupervisor = $notifiable->academician && (
            $notifiable->academician->academician_id === $this->meeting->relationship?->academician_id ||
            $notifiable->academician->academician_id === $this->meeting->request?->academician_id
        );

        // Get updater (opposite of recipient)
        if ($isSupervisor) {
            $updater = $this->meeting->relationship?->student ?? $this->meeting->request?->student;
            $updaterName = $updater?->full_name ?? 'Student';
            $updaterProfilePicture = $updater?->postgraduate?->profile_picture ?? $updater?->undergraduate?->profile_picture ?? null;
        } else {
            $updater = $this->meeting->relationship?->academician ?? $this->meeting->request?->academician;
            $updaterName = $updater?->full_name ?? 'Supervisor';
            $updaterProfilePicture = $updater?->profile_picture ?? null;
        }

        return [
            'type' => 'meeting_updated',
            'meeting_id' => $this->meeting->id,
            'relationship_id' => $this->meeting->supervision_relationship_id,
            'request_id' => $this->meeting->supervision_request_id,
            'title' => $this->meeting->title,
            'scheduled_for' => $this->meeting->scheduled_for->toISOString(),
            'location_link' => $this->meeting->location_link,
            'updater_name' => $updaterName,
            'updater_profile_picture' => $updaterProfilePicture,
            'changes' => $this->changes,
            'message' => __(':updater has updated the meeting ":title"', [
                'updater' => $updaterName,
                'title' => $this->meeting->title,
            ]),
        ];
    }
}

