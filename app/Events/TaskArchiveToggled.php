<?php

namespace App\Events;

use App\Models\Task;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskArchiveToggled implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;
    public $user;

    public function __construct(Task $task, User $user)
    {
        $this->task = $task;
        $this->user = $user;
        $this->task->load('list.board');
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('boards.' . $this->task->list->board_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'task.archive.toggled';
    }

    public function broadcastWith(): array
    {
        return [
            'task_id' => $this->task->id,
            'is_archived' => $this->task->is_archived,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
