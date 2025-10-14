<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkspaceDeletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $workspaceName;
    protected $deletedByName;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $workspaceName, string $deletedByName)
    {
        $this->workspaceName = $workspaceName;
        $this->deletedByName = $deletedByName;
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
            ->subject("Workspace '{$this->workspaceName}' has been deleted")
            ->greeting("Hello {$notifiable->name}!")
            ->line("The workspace '{$this->workspaceName}' you were a member of has been deleted by {$this->deletedByName}.")
            ->line("All boards, lists, and tasks within this workspace have also been removed.")
            ->action('Go to NexLab', route('project-hub.index'))
            ->line('Thank you for using NexLab!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'workspace_name' => $this->workspaceName,
            'deleted_by' => $this->deletedByName,
        ];
    }
}
