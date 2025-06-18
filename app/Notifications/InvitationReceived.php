<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvitationReceived extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The user who sent the invitation.
     *
     * @var \App\Models\User
     */
    protected $requester;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\User  $requester
     * @return void
     */
    public function __construct(User $requester)
    {
        $this->requester = $requester;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Connection Request')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('You have been invited to connect by ' . $this->requester->name . '.')
            ->action('View Connection Request', route('connections.index'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'requester_id' => $this->requester->id,
            'requester_name' => $this->requester->name,
            'message' => 'You have received a connection request from ' . $this->requester->name,
        ];
    }
} 