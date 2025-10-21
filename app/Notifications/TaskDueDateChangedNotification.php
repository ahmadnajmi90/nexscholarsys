<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class TaskDueDateChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $task;
    protected $oldDueDate;
    protected $changedByUser;

    /**
     * Create a new notification instance.
     */
    public function __construct(Task $task, $oldDueDate, $changedByUser = null)
    {
        $this->task = $task;
        $this->oldDueDate = $oldDueDate;
        $this->changedByUser = $changedByUser; // Now accepts User object
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
            if (!$this->task || !$notifiable) {
                Log::error('TaskDueDateChangedNotification: Missing required data', [
                    'task_exists' => (bool)$this->task,
                    'notifiable_exists' => (bool)$notifiable
                ]);
                
                return (new MailMessage)
                    ->subject('Task Due Date Changed')
                    ->line('A task due date has been changed, but some details are missing.')
                    ->line('Please check your tasks in NexLab.');
            }
            
            $taskTitle = $this->task->title ?? 'Unknown Task';
            $notifiableName = $notifiable->full_name ?? 'User';
            
            // Safely get the board URL
            $boardUrl = '#';
            try {
                if ($this->task->list && $this->task->list->board) {
                    $boardUrl = route('project-hub.boards.show', $this->task->list->board->id);
                }
            } catch (\Exception $e) {
                Log::error('TaskDueDateChangedNotification: Error getting board URL', [
                    'task_id' => $this->task->id ?? 'unknown',
                    'error' => $e->getMessage()
                ]);
            }
            
            // Safely format the dates
            $formattedOldDate = 'No due date';
            $formattedNewDate = 'No due date';
            
            try {
                if ($this->oldDueDate) {
                    $formattedOldDate = date('F j, Y', strtotime($this->oldDueDate));
                }
            } catch (\Exception $e) {
                Log::error('TaskDueDateChangedNotification: Error formatting old date', [
                    'old_date' => $this->oldDueDate,
                    'error' => $e->getMessage()
                ]);
            }
            
            try {
                if ($this->task->due_date) {
                    $formattedNewDate = $this->task->due_date->format('F j, Y');
                }
            } catch (\Exception $e) {
                Log::error('TaskDueDateChangedNotification: Error formatting new date', [
                    'task_id' => $this->task->id ?? 'unknown',
                    'error' => $e->getMessage()
                ]);
            }
            
            return (new MailMessage)
                ->subject("Due date changed for task: {$taskTitle}")
                ->greeting("Hello {$notifiableName}!")
                ->line("The due date for task '{$taskTitle}' has been changed.")
                ->line("Previous due date: {$formattedOldDate}")
                ->line("New due date: {$formattedNewDate}")
                ->action('View Task', $boardUrl)
                ->line('Thank you for using NexLab!');
        } catch (\Exception $e) {
            Log::error('TaskDueDateChangedNotification: Exception in toMail', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return (new MailMessage)
                ->subject('Task Due Date Changed')
                ->line('A task due date has been changed, but we encountered an error processing the details.')
                ->line('Please check your tasks in NexLab.');
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
            $changerName = null;
            
            if ($this->changedByUser) {
                $changerName = $this->changedByUser->full_name ?? 'Someone';
                
                if ($this->changedByUser->academician) {
                    $changerProfilePicture = $this->changedByUser->academician->profile_picture;
                } elseif ($this->changedByUser->postgraduate) {
                    $changerProfilePicture = $this->changedByUser->postgraduate->profile_picture;
                } elseif ($this->changedByUser->undergraduate) {
                    $changerProfilePicture = $this->changedByUser->undergraduate->profile_picture;
                }
            }
            
            // Get board and workspace names
            $boardName = null;
            $workspaceName = null;
            $boardId = null;
            
            if ($this->task->list && $this->task->list->board) {
                $boardName = $this->task->list->board->name;
                $boardId = $this->task->list->board->id;
                
                if ($this->task->list->board->workspace) {
                    $workspaceName = $this->task->list->board->workspace->name;
                } elseif ($this->task->list->board->project) {
                    $workspaceName = $this->task->list->board->project->name;
                }
            }

            // Format dates consistently
            $formattedOldDate = $this->oldDueDate ? date('d/m/Y', strtotime($this->oldDueDate)) : null;
            $formattedNewDate = $this->task->due_date ? $this->task->due_date->format('d/m/Y') : null;

            return [
                'type' => 'task_due_date_changed',
                'task_id' => $this->task->id ?? null,
                'task_title' => $this->task->title ?? 'Unknown Task',
                'old_due_date' => $this->oldDueDate,
                'new_due_date' => $this->task->due_date ? $this->task->due_date->format('Y-m-d') : null,
                'old_due_date_formatted' => $formattedOldDate,
                'new_due_date_formatted' => $formattedNewDate,
                'changed_by' => $changerName,
                'changed_by_profile_picture' => $changerProfilePicture,
                'board_id' => $boardId,
                'board_name' => $boardName,
                'workspace_name' => $workspaceName,
                'message' => 'Due date changed for task "' . ($this->task->title ?? 'Unknown Task') . '"',
            ];
        } catch (\Exception $e) {
            Log::error('TaskDueDateChangedNotification: Exception in toArray', [
                'exception' => $e->getMessage()
            ]);
            
            return [
                'type' => 'task_due_date_changed',
                'message' => 'A task due date has been changed.',
            ];
        }
    }
}
