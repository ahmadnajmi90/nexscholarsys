<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;
use App\Models\Connection;

class ConnectionRequestReceived extends Notification
{
    use Queueable;

    protected $connectionRequest;
    protected $requester;

    /**
     * Create a new notification instance.
     * 
     * @param \App\Models\Connection|object $connection
     * @param \App\Models\User $requester
     */
    public function __construct($connection, User $requester)
    {
        $this->connectionRequest = $connection;
        $this->requester = $requester;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification for storage in the database.
     *
     * @param  mixed  $notifiable
     * @return array<string, mixed>
     */
    public function toDatabase($notifiable): array
    {
        // Get profile picture from requester's role model
        $profilePicture = null;
        if ($this->requester->academician) {
            $profilePicture = $this->requester->academician->profile_picture;
        } elseif ($this->requester->postgraduate) {
            $profilePicture = $this->requester->postgraduate->profile_picture;
        } elseif ($this->requester->undergraduate) {
            $profilePicture = $this->requester->undergraduate->profile_picture;
        }

        return [
            'connection_id' => $this->connectionRequest->id ?? '',
            'requester_id' => $this->requester->id,
            'requester_name' => $this->requester->full_name,
            'requester_profile_picture' => $profilePicture,
            'type' => 'connection_request',
            'message' => "{$this->requester->full_name} sent you a connection request."
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        // Get profile picture from requester's role model
        $profilePicture = null;
        if ($this->requester->academician) {
            $profilePicture = $this->requester->academician->profile_picture;
        } elseif ($this->requester->postgraduate) {
            $profilePicture = $this->requester->postgraduate->profile_picture;
        } elseif ($this->requester->undergraduate) {
            $profilePicture = $this->requester->undergraduate->profile_picture;
        }

        return [
            'connection_id' => $this->connectionRequest->id ?? '',
            'requester_id' => $this->requester->id,
            'requester_name' => $this->requester->full_name,
            'requester_profile_picture' => $profilePicture,
            'type' => 'connection_request',
            'message' => "{$this->requester->full_name} sent you a connection request."
        ];
    }
}
