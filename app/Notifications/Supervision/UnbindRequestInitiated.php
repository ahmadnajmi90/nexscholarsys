<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRelationshipUnbindRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UnbindRequestInitiated extends Notification implements ShouldQueue
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
        $isSupervisorInitiated = $this->unbindRequest->initiated_by === 'supervisor';
        
        return (new MailMessage)
            ->subject(__('Supervision Relationship Termination Request'))
            ->markdown('emails.supervision.unbind_request_initiated', [
                'unbindRequest' => $this->unbindRequest,
                'relationship' => $this->unbindRequest->relationship,
                'recipient' => $notifiable,
                'isSupervisorInitiated' => $isSupervisorInitiated,
                'conversationUrl' => route('messaging.inbox', ['cid' => $this->unbindRequest->relationship->conversation_id]),
            ]);
    }

    public function toArray($notifiable)
    {
        $isSupervisorInitiated = $this->unbindRequest->initiated_by === 'supervisor';
        
        if ($isSupervisorInitiated) {
            $initiator = $this->unbindRequest->relationship->academician;
            $initiatorName = $initiator?->full_name ?? 'Your supervisor';
            $initiatorProfilePicture = $initiator?->profile_picture ?? null;
        } else {
            $initiator = $this->unbindRequest->relationship->student;
            $initiatorName = $initiator?->full_name ?? 'Your student';
            $initiatorProfilePicture = $initiator?->postgraduate?->profile_picture ?? $initiator?->undergraduate?->profile_picture ?? null;
        }

        return [
            'type' => 'unbind_request_initiated',
            'unbind_request_id' => $this->unbindRequest->id,
            'relationship_id' => $this->unbindRequest->relationship_id,
            'initiated_by' => $this->unbindRequest->initiated_by,
            'initiator_name' => $initiatorName,
            'initiator_profile_picture' => $initiatorProfilePicture,
            'reason' => $this->unbindRequest->reason,
            'attempt_count' => $this->unbindRequest->attempt_count,
            'is_force' => $this->unbindRequest->status === 'force_unbind',
            'message' => $this->unbindRequest->status === 'force_unbind'
                ? __(':initiator has terminated the supervision relationship (force unbind).', ['initiator' => $initiatorName])
                : __(':initiator has requested to terminate the supervision relationship.', ['initiator' => $initiatorName]),
        ];
    }
}

