<?php

namespace App\Notifications;

use App\Models\Workspace;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkspaceInvitationReceived extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The workspace the user was invited to.
     *
     * @var \App\Models\Workspace
     */
    protected $workspace;

    /**
     * The user who sent the invitation.
     *
     * @var \App\Models\User
     */
    protected $inviter;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Workspace  $workspace
     * @param  \App\Models\User  $inviter
     * @return void
     */
    public function __construct(Workspace $workspace, User $inviter)
    {
        $this->workspace = $workspace;
        $this->inviter = $inviter;
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
            ->subject('Workspace Invitation - ' . $this->workspace->name)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('You have been invited to join the workspace "' . $this->workspace->name . '" by ' . $this->inviter->name . '.')
            ->line('This workspace will allow you to collaborate on projects and tasks with other team members.')
            ->action('View Workspace', route('project-hub.workspace.show', $this->workspace))
            ->line('Thank you for using Nexscholar!');
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
            'workspace_id' => $this->workspace->id,
            'workspace_name' => $this->workspace->name,
            'inviter_id' => $this->inviter->id,
            'inviter_name' => $this->inviter->name,
            'message' => 'You have been invited to join workspace "' . $this->workspace->name . '" by ' . $this->inviter->name,
        ];
    }
}
