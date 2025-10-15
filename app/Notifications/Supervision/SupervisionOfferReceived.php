<?php

namespace App\Notifications\Supervision;

use App\Models\SupervisionRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SupervisionOfferReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(protected SupervisionRequest $request)
    {
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject(__('Supervision Offer Received'))
            ->markdown('emails.supervision.offer_received', [
                'request' => $this->request,
                'student' => $notifiable,
                'conversationUrl' => route('messaging.inbox', ['cid' => $this->request->conversation_id]),
            ]);
    }

    public function toArray($notifiable)
    {
        // Get supervisor profile picture
        $supervisorProfilePicture = null;
        $academician = $this->request->academician;
        if ($academician && $academician->profile_picture) {
            $supervisorProfilePicture = $academician->profile_picture;
        }

        return [
            'type' => 'offer_received',
            'request_id' => $this->request->id,
            'student_id' => $this->request->student_id,
            'academician_id' => $this->request->academician_id,
            'supervisor_name' => $this->request->academician->full_name ?? 'Your supervisor',
            'supervisor_profile_picture' => $supervisorProfilePicture,
            'proposal_title' => $this->request->proposal_title,
            'message' => __(':supervisor has accepted your supervision request and sent you an offer!', [
                'supervisor' => $this->request->academician->full_name ?? 'A supervisor',
            ]),
        ];
    }
}

