<?php

namespace App\Events;

use App\Models\Task;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskMoved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The task that was moved.
     *
     * @var \App\Models\Task
     */
    public $task;

    /**
     * The user who moved the task.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Task  $task
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(Task $task, User $user)
    {
        $this->task = $task;
        $this->user = $user;
        
        // Make sure we have the board relationship loaded
        // This is needed for the broadcastOn method
        if (!$this->task->relationLoaded('list') || !$this->task->list->relationLoaded('board')) {
            $this->task->load('list.board');
        }
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('boards.' . $this->task->list->board_id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'task.moved';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'task' => [
                'id' => $this->task->id,
                'title' => $this->task->title,
                'description' => $this->task->description,
                'order' => $this->task->order,
                'due_date' => $this->task->due_date,
                'priority' => $this->task->priority,
                'list_id' => $this->task->list_id,
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            // Include timestamp to help with update conflicts
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
