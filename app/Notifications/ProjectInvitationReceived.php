<?php

namespace App\Notifications;

use App\Models\Project;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

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
        try {
            // Check if required data exists
            if (!$this->project || !$this->inviter || !$notifiable) {
                Log::error('ProjectInvitationReceived: Missing required data', [
                    'project_exists' => (bool)$this->project,
                    'inviter_exists' => (bool)$this->inviter,
                    'notifiable_exists' => (bool)$notifiable
                ]);
                
                return (new MailMessage)
                    ->subject('Project Invitation')
                    ->line('You have received a project invitation, but some details are missing.')
                    ->line('Please contact support if you have questions.');
            }
            
            $projectName = $this->project->name ?? 'Unknown Project';
            $inviterName = $this->inviter->full_name ?? 'Unknown User';
            $notifiableName = $notifiable->full_name ?? 'User';
            
            // Use the correct route name (projects plural, not project singular)
            $routeName = 'project-hub.projects.show';
            
            // Pass the ID instead of the whole object to avoid serialization issues
            $projectId = $this->project->id ?? null;
            
            if (!$projectId) {
                Log::error('ProjectInvitationReceived: Missing project ID');
                return (new MailMessage)
                    ->subject('Project Invitation')
                    ->line('You have received a project invitation, but some details are missing.')
                    ->line('Please contact support if you have questions.');
            }
            
            return (new MailMessage)
                ->subject('Project Invitation - ' . $projectName)
                ->greeting('Hello ' . $notifiableName . '!')
                ->line('You have been invited to join the project "' . $projectName . '" by ' . $inviterName . '.')
                ->line('This project will allow you to collaborate on research tasks and manage project deliverables.')
                ->action('View Project', route($routeName, $projectId))
                ->line('Thank you for using Nexscholar!');
        } catch (\Exception $e) {
            Log::error('ProjectInvitationReceived: Exception in toMail', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return (new MailMessage)
                ->subject('Project Invitation')
                ->line('You have received a project invitation, but we encountered an error processing it.')
                ->line('Please contact support if you have questions.');
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        try {
            return [
                'project_id' => $this->project->id ?? null,
                'project_name' => $this->project->name ?? 'Unknown Project',
                'inviter_id' => $this->inviter->id ?? null,
                'inviter_name' => $this->inviter->full_name ?? 'Unknown User',
                'message' => 'You have been invited to join project "' . 
                    ($this->project->name ?? 'Unknown Project') . '" by ' . 
                    ($this->inviter->full_name ?? 'Unknown User'),
            ];
        } catch (\Exception $e) {
            Log::error('ProjectInvitationReceived: Exception in toArray', [
                'exception' => $e->getMessage()
            ]);
            
            return [
                'message' => 'You have received a project invitation.',
            ];
        }
    }
}
