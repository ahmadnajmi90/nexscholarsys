<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TasksReordered implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $listId;
    public $boardId;
    public $taskOrder;
    public $user;

    public function __construct(int $listId, int $boardId, array $taskOrder, User $user)
    {
        $this->listId = $listId;
        $this->boardId = $boardId;
        $this->taskOrder = $taskOrder; // Array of task IDs in new order
        $this->user = $user;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('boards.' . $this->boardId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'tasks.reordered';
    }

    public function broadcastWith(): array
    {
        return [
            'list_id' => $this->listId,
            'task_order' => $this->taskOrder,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}

