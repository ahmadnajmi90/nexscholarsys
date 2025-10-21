<?php

namespace App\Notifications;

use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class TaskAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $task;
    protected $assigner;

    /**
     * Create a new notification instance.
     */
    public function __construct(Task $task, User $assigner)
    {
        $this->task = $task;
        $this->assigner = $assigner;
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
            if (!$this->task || !$this->assigner || !$notifiable) {
                Log::error('TaskAssignedNotification: Missing required data', [
                    'task_exists' => (bool)$this->task,
                    'assigner_exists' => (bool)$this->assigner,
                    'notifiable_exists' => (bool)$notifiable
                ]);
                
                return (new MailMessage)
                    ->subject('Task Assignment')
                    ->line('You have been assigned to a task, but some details are missing.')
                    ->line('Please check your tasks in NexLab.');
            }
            
            $taskTitle = $this->task->title ?? 'Unknown Task';
            $assignerName = $this->assigner->full_name ?? 'Unknown User';
            $notifiableName = $notifiable->full_name ?? 'User';
            $taskDescription = $this->task->description ?? 'No description provided';
            
            // Safely get the board URL
            $boardUrl = '#';
            try {
                if ($this->task->list && $this->task->list->board) {
                    $boardUrl = route('project-hub.boards.show', $this->task->list->board->id);
                }
            } catch (\Exception $e) {
                Log::error('TaskAssignedNotification: Error getting board URL', [
                    'task_id' => $this->task->id ?? 'unknown',
                    'error' => $e->getMessage()
                ]);
            }
            
            // Safely format the due date
            $dueDateLine = '';
            try {
                if ($this->task->due_date) {
                    $dueDateLine = "Due date: " . $this->task->due_date->format('F j, Y');
                }
            } catch (\Exception $e) {
                Log::error('TaskAssignedNotification: Error formatting due date', [
                    'task_id' => $this->task->id ?? 'unknown',
                    'error' => $e->getMessage()
                ]);
            }
            
            $message = (new MailMessage)
                ->subject("You've been assigned a new task")
                ->greeting("Hello {$notifiableName}!")
                ->line("{$assignerName} has assigned you to the task '{$taskTitle}'.")
                ->line("Description: {$taskDescription}");
                
            if ($dueDateLine) {
                $message->line($dueDateLine);
            }
            
            return $message
                ->action('View Task', $boardUrl)
                ->line('Thank you for using NexLab!');
        } catch (\Exception $e) {
            Log::error('TaskAssignedNotification: Exception in toMail', [
                'exception' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return (new MailMessage)
                ->subject('Task Assignment')
                ->line('You have been assigned to a task, but we encountered an error processing the details.')
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
            // Get assigner profile picture from role models
            $assignerProfilePicture = null;
            if ($this->assigner) {
                if ($this->assigner->academician) {
                    $assignerProfilePicture = $this->assigner->academician->profile_picture;
                } elseif ($this->assigner->postgraduate) {
                    $assignerProfilePicture = $this->assigner->postgraduate->profile_picture;
                } elseif ($this->assigner->undergraduate) {
                    $assignerProfilePicture = $this->assigner->undergraduate->profile_picture;
                }
            }

            // Get workspace and board names
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

            return [
                'type' => 'task_assigned',
                'task_id' => $this->task->id ?? null,
                'task_title' => $this->task->title ?? 'Unknown Task',
                'task_description' => $this->task->description ?? null,
                'task_due_date' => $this->task->due_date ? $this->task->due_date->format('Y-m-d') : null,
                'assigner_id' => $this->assigner->id ?? null,
                'assigner_name' => $this->assigner->full_name ?? 'Unknown User',
                'assigner_profile_picture' => $assignerProfilePicture,
                'board_id' => $boardId,
                'board_name' => $boardName,
                'workspace_name' => $workspaceName,
                'message' => ($this->assigner->full_name ?? 'Someone') . ' assigned you to task "' . ($this->task->title ?? 'Unknown Task') . '"',
            ];
        } catch (\Exception $e) {
            Log::error('TaskAssignedNotification: Exception in toArray', [
                'exception' => $e->getMessage()
            ]);
            
            return [
                'type' => 'task_assigned',
                'message' => 'You have been assigned to a task.',
            ];
        }
    }
}
