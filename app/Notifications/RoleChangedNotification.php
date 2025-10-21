<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class RoleChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $parentName;
    protected $parentType;
    protected $newRole;
    protected $changedByUser;
    protected $parentId;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $parentName, string $parentType, string $newRole, $changedByUser, int $parentId)
    {
        $this->parentName = $parentName;
        $this->parentType = $parentType; // 'workspace' or 'project'
        $this->newRole = $newRole;
        $this->changedByUser = $changedByUser; // Now accepts User object
        $this->parentId = $parentId;
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
        try {
            // Check if required data exists
            if (!$this->parentName || !$this->parentType || !$this->newRole || 
                !$this->changedByName || !$this->parentId || !$notifiable) {
                
                Log::error('RoleChangedNotification: Missing required data', [
                    'parent_name_exists' => (bool)$this->parentName,
                    'parent_type_exists' => (bool)$this->parentType,
                    'new_role_exists' => (bool)$this->newRole,
                    'changed_by_name_exists' => (bool)$this->changedByName,
                    'parent_id_exists' => (bool)$this->parentId,
                    'notifiable_exists' => (bool)$notifiable
                ]);
                
                return (new MailMessage)
                    ->subject('Role Changed')
                    ->line('Your role has been changed, but some details are missing.')
                    ->line('Please contact support if you have questions.');
            }
            
            $notifiableName = $notifiable->full_name ?? 'User';
            $parentName = $this->parentName ?? 'Unknown';
            $parentType = $this->parentType ?? 'entity';
            $newRole = $this->newRole ?? 'member';
            $changedByName = $this->changedByName ?? 'Administrator';
            
            // Verify the parent type is valid
            if (!in_array($parentType, ['workspace', 'project'])) {
                Log::error('RoleChangedNotification: Invalid parent type', [
                    'parent_type' => $parentType
                ]);
                $parentType = 'entity';
            }
            
            // Use the correct route name with plural
            $routeName = $parentType === 'workspace' ? 'project-hub.workspaces.show' : 'project-hub.projects.show';
            
            try {
                $parentUrl = route($routeName, $this->parentId);
            } catch (\Exception $e) {
                Log::error('RoleChangedNotification: Error generating URL', [
                    'route_name' => $routeName,
                    'parent_id' => $this->parentId,
                    'error' => $e->getMessage()
                ]);
                $parentUrl = '#';
            }
            
            return (new MailMessage)
                ->subject("Your role has been changed in {$parentName}")
                ->greeting("Hello {$notifiableName}!")
                ->line("Your role in {$parentType} '{$parentName}' has been changed to '{$newRole}' by {$changedByName}.")
                ->when($newRole === 'admin', function ($message) {
                    return $message->line('As an admin, you can now manage members, boards, and settings.');
                })
                ->when($newRole === 'member', function ($message) {
                    return $message->line('As a member, you can create and edit content on boards you have access to.');
                })
                ->action("Go to {$parentName}", $parentUrl)
                ->line('Thank you for using NexLab!');
        } catch (\Exception $e) {
            Log::error('RoleChangedNotification: Exception in toMail', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return (new MailMessage)
                ->subject('Role Changed')
                ->line('Your role has been changed, but we encountered an error processing the details.')
                ->line('Please contact support if you have questions.');
        }
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        try {
            // Get changer profile picture and full name
            $changerProfilePicture = null;
            $changerName = 'Administrator';
            
            if ($this->changedByUser) {
                $changerName = $this->changedByUser->full_name ?? 'Administrator';
                
                if ($this->changedByUser->academician) {
                    $changerProfilePicture = $this->changedByUser->academician->profile_picture;
                } elseif ($this->changedByUser->postgraduate) {
                    $changerProfilePicture = $this->changedByUser->postgraduate->profile_picture;
                } elseif ($this->changedByUser->undergraduate) {
                    $changerProfilePicture = $this->changedByUser->undergraduate->profile_picture;
                }
            }
            
            return [
                'type' => 'role_changed',
                'parent_name' => $this->parentName ?? 'Unknown',
                'parent_type' => $this->parentType ?? 'entity',
                'new_role' => ucfirst($this->newRole ?? 'member'), // Capitalize role
                'changed_by' => $changerName,
                'changed_by_profile_picture' => $changerProfilePicture,
                'parent_id' => $this->parentId ?? null,
                'message' => 'Your role in ' . ($this->parentType ?? 'entity') . ' "' . 
                    ($this->parentName ?? 'Unknown') . '" changed to ' . ucfirst($this->newRole ?? 'member'),
            ];
        } catch (\Exception $e) {
            Log::error('RoleChangedNotification: Exception in toArray', [
                'exception' => $e->getMessage()
            ]);
            
            return [
                'type' => 'role_changed',
                'message' => 'Your role has been changed.',
            ];
        }
    }
}
