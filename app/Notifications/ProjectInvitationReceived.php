<?php

namespace App\Notifications;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectInvitationReceived extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The project the user was invited to.
     *
     * @var \App\Models\Project
     */
    protected $project;

    /**
     * The user who sent the invitation.
     *
     * @var \App\Models\User
     */
    protected $inviter;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Project  $project
     * @param  \App\Models\User  $inviter
     * @return void
     */
    public function __construct(Project $project, User $inviter)
    {
        $this->project = $project;
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
            ->subject('Project Invitation - ' . $this->project->name)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('You have been invited to join the project "' . $this->project->name . '" by ' . $this->inviter->name . '.')
            ->line('This project will allow you to collaborate on research tasks and manage project deliverables.')
            ->action('View Project', route('project-hub.project.show', $this->project))
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
            'project_id' => $this->project->id,
            'project_name' => $this->project->name,
            'inviter_id' => $this->inviter->id,
            'inviter_name' => $this->inviter->name,
            'message' => 'You have been invited to join project "' . $this->project->name . '" by ' . $this->inviter->name,
        ];
    }
}
