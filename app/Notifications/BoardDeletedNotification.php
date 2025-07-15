<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class BoardDeletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $boardName;
    protected $parentName;
    protected $parentType;
    protected $deletedByName;
    protected $parentId;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $boardName, string $parentName, string $parentType, string $deletedByName, int $parentId)
    {
        $this->boardName = $boardName;
        $this->parentName = $parentName;
        $this->parentType = $parentType; // 'workspace' or 'project'
        $this->deletedByName = $deletedByName;
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
            if (!$this->boardName || !$this->parentName || !$this->parentType || 
                !$this->deletedByName || !$this->parentId || !$notifiable) {
                
                Log::error('BoardDeletedNotification: Missing required data', [
                    'board_name_exists' => (bool)$this->boardName,
                    'parent_name_exists' => (bool)$this->parentName,
                    'parent_type_exists' => (bool)$this->parentType,
                    'deleted_by_name_exists' => (bool)$this->deletedByName,
                    'parent_id_exists' => (bool)$this->parentId,
                    'notifiable_exists' => (bool)$notifiable
                ]);
                
                return (new MailMessage)
                    ->subject('Board Deleted')
                    ->line('A board has been deleted, but some details are missing.')
                    ->line('Please check your workspaces and projects in ScholarLab.');
            }
            
            $boardName = $this->boardName ?? 'Unknown Board';
            $parentName = $this->parentName ?? 'Unknown Parent';
            $parentType = $this->parentType ?? 'entity';
            $deletedByName = $this->deletedByName ?? 'Administrator';
            $notifiableName = $notifiable->full_name ?? 'User';
            
            // Verify the parent type is valid
            if (!in_array($parentType, ['workspace', 'project'])) {
                Log::error('BoardDeletedNotification: Invalid parent type', [
                    'parent_type' => $parentType
                ]);
                $parentType = 'entity';
            }
            
            // Use the correct route name with plural
            $routeName = $parentType === 'workspace' ? 'project-hub.workspaces.show' : 'project-hub.projects.show';
            
            try {
                $parentUrl = route($routeName, $this->parentId);
            } catch (\Exception $e) {
                Log::error('BoardDeletedNotification: Error generating URL', [
                    'route_name' => $routeName,
                    'parent_id' => $this->parentId,
                    'error' => $e->getMessage()
                ]);
                $parentUrl = '#';
            }
            
            return (new MailMessage)
                ->subject("Board '{$boardName}' has been deleted")
                ->greeting("Hello {$notifiableName}!")
                ->line("The board '{$boardName}' in {$parentType} '{$parentName}' has been deleted by {$deletedByName}.")
                ->line("All tasks within this board have also been deleted.")
                ->action("Go to {$parentName}", $parentUrl)
                ->line('Thank you for using ScholarLab!');
        } catch (\Exception $e) {
            Log::error('BoardDeletedNotification: Exception in toMail', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return (new MailMessage)
                ->subject('Board Deleted')
                ->line('A board has been deleted, but we encountered an error processing the details.')
                ->line('Please check your workspaces and projects in ScholarLab.');
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
            return [
                'board_name' => $this->boardName ?? 'Unknown Board',
                'parent_name' => $this->parentName ?? 'Unknown Parent',
                'parent_type' => $this->parentType ?? 'entity',
                'deleted_by' => $this->deletedByName ?? 'Administrator',
                'parent_id' => $this->parentId ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('BoardDeletedNotification: Exception in toArray', [
                'exception' => $e->getMessage()
            ]);
            
            return [
                'message' => 'A board has been deleted.',
            ];
        }
    }
}
