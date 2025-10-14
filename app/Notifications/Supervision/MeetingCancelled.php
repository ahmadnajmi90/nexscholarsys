<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionMeeting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MeetingCancelled extends Notification implements ShouldQueue
{
    use Queueable;

    protected $meetingData;

    public function __construct(SupervisionMeeting|array $meeting)
    {
        // Store meeting data as array since the model might be deleted
        $this->meetingData = is_array($meeting) ? $meeting : [
            'id' => $meeting->id,
            'title' => $meeting->title,
            'scheduled_for' => $meeting->scheduled_for,
            'location_link' => $meeting->location_link,
            'relationship_id' => $meeting->supervision_relationship_id,
            'request_id' => $meeting->supervision_request_id,
            'relationship' => $meeting->relationship,
            'request' => $meeting->request,
        ];
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $relationship = $this->meetingData['relationship'] ?? null;
        $request = $this->meetingData['request'] ?? null;

        $isSupervisor = $notifiable->academician && (
            $notifiable->academician->academician_id === $relationship?->academician_id ||
            $notifiable->academician->academician_id === $request?->academician_id
        );

        $cancellerName = $isSupervisor
            ? ($relationship?->student->full_name ?? $request?->student->full_name ?? 'Student')
            : ($relationship?->academician->full_name ?? $request?->academician->full_name ?? 'Supervisor');

        return (new MailMessage)
            ->subject(__('Meeting Cancelled: :title', ['title' => $this->meetingData['title']]))
            ->markdown('emails.supervision.meeting_cancelled', [
                'meetingData' => $this->meetingData,
                'recipient' => $notifiable,
                'cancellerName' => $cancellerName,
            ]);
    }

    public function toArray($notifiable)
    {
        $relationship = $this->meetingData['relationship'] ?? null;
        $request = $this->meetingData['request'] ?? null;

        $isSupervisor = $notifiable->academician && (
            $notifiable->academician->academician_id === $relationship?->academician_id ||
            $notifiable->academician->academician_id === $request?->academician_id
        );

        $cancellerName = $isSupervisor
            ? ($relationship?->student->full_name ?? $request?->student->full_name ?? 'Student')
            : ($relationship?->academician->full_name ?? $request?->academician->full_name ?? 'Supervisor');

        return [
            'type' => 'meeting_cancelled',
            'meeting_id' => $this->meetingData['id'],
            'relationship_id' => $this->meetingData['relationship_id'],
            'request_id' => $this->meetingData['request_id'],
            'title' => $this->meetingData['title'],
            'was_scheduled_for' => $this->meetingData['scheduled_for'] instanceof \Carbon\Carbon
                ? $this->meetingData['scheduled_for']->toISOString()
                : $this->meetingData['scheduled_for'],
            'canceller_name' => $cancellerName,
            'message' => __(':canceller has cancelled the meeting ":title"', [
                'canceller' => $cancellerName,
                'title' => $this->meetingData['title'],
            ]),
        ];
    }
}

