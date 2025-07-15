<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;
use App\Models\Connection;

class ConnectionRequestAccepted extends Notification
{
    use Queueable;

    protected $acceptedConnection;
    protected $recipient;

    /**
     * Create a new notification instance.
     * 
     * @param \App\Models\Connection|object $connection
     * @param \App\Models\User $recipient
     */
    public function __construct($connection, User $recipient)
    {
        $this->acceptedConnection = $connection;
        $this->recipient = $recipient;
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
        return [
            'connection_id' => $this->acceptedConnection->id ?? '',
            'recipient_id' => $this->recipient->id,
            'recipient_name' => $this->recipient->full_name,
            'type' => 'connection_accepted',
            'message' => "{$this->recipient->full_name} accepted your connection request."
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
        return [
            'connection_id' => $this->acceptedConnection->id ?? '',
            'recipient_id' => $this->recipient->id,
            'recipient_name' => $this->recipient->full_name,
            'type' => 'connection_accepted',
            'message' => "{$this->recipient->full_name} accepted your connection request."
        ];
    }
}
