<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SupervisionRequestAutoCancelled extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public SupervisionRequest $supervisionRequest)
    {
    }

    public function via($notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Supervision Request Auto-Cancelled')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your supervision request to ' . $this->supervisionRequest->academician->full_name . ' has been automatically cancelled.')
            ->line('Reason: The student has accepted another supervision offer.')
            ->line('**Student:** ' . $this->supervisionRequest->student->full_name)
            ->line('**Proposal:** ' . $this->supervisionRequest->proposal_title)
            ->line('You can still receive new supervision requests from other students.')
            ->action('View Dashboard', url('/dashboard'))
            ->line('Thank you for your consideration.');
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'supervision_request_auto_cancelled',
            'supervision_request_id' => $this->supervisionRequest->id,
            'student_id' => $this->supervisionRequest->student_id,
            'student_name' => $this->supervisionRequest->student->full_name,
            'proposal_title' => $this->supervisionRequest->proposal_title,
            'message' => 'Supervision request from ' . $this->supervisionRequest->student->full_name . ' was automatically cancelled (student accepted another offer)',
        ];
    }
}

