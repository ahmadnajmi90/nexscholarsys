<?php

namespace App\Notifications;

use App\Models\Workspace;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class WorkspaceInvitationReceived extends Notification
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
        Log::info('Attempting to send WorkspaceInvitationReceived email to: ' . ($notifiable->email ?? 'unknown email'));
        
        try {
            // Check if required data exists
            if (!$this->workspace || !$this->inviter || !$notifiable) {
                Log::error('WorkspaceInvitationReceived: Missing required data', [
                    'workspace_exists' => (bool)$this->workspace,
                    'inviter_exists' => (bool)$this->inviter,
                    'notifiable_exists' => (bool)$notifiable
                ]);
                
                // Log the error but continue with a generic message
                return (new MailMessage)
                    ->subject('Workspace Invitation')
                    ->line('You have received a workspace invitation, but some details are missing.')
                    ->line('Please contact support if you have questions.');
            }
            
            $workspaceName = $this->workspace->name ?? 'Unknown Workspace';
            $inviterName = $this->inviter->full_name ?? 'Unknown User';
            $notifiableName = $notifiable->full_name ?? 'User';
            
            // Use the correct route name (workspaces plural, not workspace singular)
            $routeName = 'project-hub.workspaces.show';
            
            // Pass the ID instead of the whole object to avoid serialization issues
            $workspaceId = $this->workspace->id ?? null;
            
            if (!$workspaceId) {
                Log::error('WorkspaceInvitationReceived: Missing workspace ID');
                return (new MailMessage)
                    ->subject('Workspace Invitation')
                    ->line('You have received a workspace invitation, but some details are missing.')
                    ->line('Please contact support if you have questions.');
            }
            
            return (new MailMessage)
                ->subject('Workspace Invitation - ' . $workspaceName)
                ->greeting('Hello ' . $notifiableName . '!')
                ->line('You have been invited to join the workspace "' . $workspaceName . '" by ' . $inviterName . '.')
                ->line('This workspace will allow you to collaborate on projects and tasks with other team members.')
                ->action('View Workspace', route($routeName, $workspaceId))
                ->line('Thank you for using Nexscholar!');
        } catch (\Exception $e) {
            Log::error('WorkspaceInvitationReceived: Exception in toMail', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Return a generic message instead of failing
            return (new MailMessage)
                ->subject('Workspace Invitation')
                ->line('You have received a workspace invitation, but we encountered an error processing it.')
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
                'workspace_id' => $this->workspace->id ?? null,
                'workspace_name' => $this->workspace->name ?? 'Unknown Workspace',
                'inviter_id' => $this->inviter->id ?? null,
                'inviter_name' => $this->inviter->full_name ?? 'Unknown User',
                'message' => 'You have been invited to join workspace "' . 
                    ($this->workspace->name ?? 'Unknown Workspace') . '" by ' . 
                    ($this->inviter->full_name ?? 'Unknown User'),
            ];
        } catch (\Exception $e) {
            Log::error('WorkspaceInvitationReceived: Exception in toArray', [
                'exception' => $e->getMessage()
            ]);
            
            return [
                'message' => 'You have received a workspace invitation.',
            ];
        }
    }
}
