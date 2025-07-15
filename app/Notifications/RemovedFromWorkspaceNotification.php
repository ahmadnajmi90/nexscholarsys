<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RemovedFromWorkspaceNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $parentName;
    protected $parentType;
    protected $removedByName;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $parentName, string $parentType, string $removedByName)
    {
        $this->parentName = $parentName;
        $this->parentType = $parentType; // 'workspace' or 'project'
        $this->removedByName = $removedByName;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("You have been removed from {$this->parentName}")
            ->greeting("Hello {$notifiable->name}!")
            ->line("You have been removed from the {$this->parentType} '{$this->parentName}' by {$this->removedByName}.")
            ->line("You no longer have access to the boards, lists, and tasks within this {$this->parentType}.")
            ->action('Go to ScholarLab', route('project-hub.index'))
            ->line('Thank you for using ScholarLab!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'parent_name' => $this->parentName,
            'parent_type' => $this->parentType,
            'removed_by' => $this->removedByName,
        ];
    }
}
