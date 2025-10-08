<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRelationshipUnbindRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UnbindRequestRejected extends Notification
{
    use Queueable;

    public function __construct(protected SupervisionRelationshipUnbindRequest $unbindRequest)
    {
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(__('Termination Request Declined'))
            ->markdown('emails.supervision.unbind_request_rejected', [
                'unbindRequest' => $this->unbindRequest,
                'relationship' => $this->unbindRequest->relationship,
                'recipient' => $notifiable,
                'conversationUrl' => route('messaging.inbox', ['cid' => $this->unbindRequest->relationship->conversation_id]),
            ]);
    }

    public function toArray($notifiable)
    {
        $isSupervisorRecipient = $notifiable->academician && 
                                 $notifiable->academician->academician_id === $this->unbindRequest->relationship->academician_id;
        $otherPartyName = $isSupervisorRecipient
            ? ($this->unbindRequest->relationship->student->full_name ?? 'Student')
            : ($this->unbindRequest->relationship->academician->full_name ?? 'Supervisor');

        return [
            'type' => 'unbind_request_rejected',
            'unbind_request_id' => $this->unbindRequest->id,
            'relationship_id' => $this->unbindRequest->relationship_id,
            'initiated_by' => $this->unbindRequest->initiated_by,
            'cooldown_until' => $this->unbindRequest->cooldown_until?->toISOString(),
            'message' => __(':name has declined your termination request. Cooldown period: :days days.', [
                'name' => $otherPartyName,
                'days' => 30,
            ]),
        ];
    }
}

