<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class FacultyAdminInvitation extends Notification
{
    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Faculty Admin Invitation')
            ->greeting('Hello!')
            ->line('You have been invited to join as a Faculty Admin.')
            ->line('You can log in to your account using the following credentials:')
            ->line('**Email:** ' . $this->user->email)
            ->line('**Password:** password')
            ->line('For security purposes, please log in and change your password immediately.')
            ->action('Login to Your Account', route('faculty-admins.confirm', $this->user->id))
            ->line('Thank you for joining us!');
    }
}
