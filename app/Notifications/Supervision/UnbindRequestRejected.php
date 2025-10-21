<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRelationshipUnbindRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UnbindRequestRejected extends Notification implements ShouldQueue
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
        
        if ($isSupervisorRecipient) {
            $otherParty = $this->unbindRequest->relationship->student;
            $otherPartyName = $otherParty?->full_name ?? 'Student';
            $otherPartyProfilePicture = $otherParty?->postgraduate?->profile_picture ?? $otherParty?->undergraduate?->profile_picture ?? null;
        } else {
            $otherParty = $this->unbindRequest->relationship->academician;
            $otherPartyName = $otherParty?->full_name ?? 'Supervisor';
            $otherPartyProfilePicture = $otherParty?->profile_picture ?? null;
        }

        return [
            'type' => 'unbind_request_rejected',
            'unbind_request_id' => $this->unbindRequest->id,
            'relationship_id' => $this->unbindRequest->relationship_id,
            'initiated_by' => $this->unbindRequest->initiated_by,
            'other_party_name' => $otherPartyName,
            'other_party_profile_picture' => $otherPartyProfilePicture,
            'cooldown_until' => $this->unbindRequest->cooldown_until?->toISOString(),
            'message' => __(':name has declined your termination request. Cooldown period: :days days.', [
                'name' => $otherPartyName,
                'days' => 30,
            ]),
        ];
    }
}

