<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BoardDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The ID of the board that was deleted.
     *
     * @var int
     */
    public $boardId;

    /**
     * The name of the board that was deleted.
     *
     * @var string
     */
    public $boardName;

    /**
     * The parent type (workspace or project).
     *
     * @var string
     */
    public $parentType;

    /**
     * The ID of the parent (workspace_id or project_id).
     *
     * @var int
     */
    public $parentId;

    /**
     * The user who deleted the board.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param  int  $boardId
     * @param  string  $boardName
     * @param  string  $parentType
     * @param  int  $parentId
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(int $boardId, string $boardName, string $parentType, int $parentId, User $user)
    {
        $this->boardId = $boardId;
        $this->boardName = $boardName;
        $this->parentType = $parentType;
        $this->parentId = $parentId;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        $channel = $this->parentType === 'workspace' ? 'workspaces.' : 'projects.';
        return new PrivateChannel($channel . $this->parentId);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'board.deleted';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'board_id' => $this->boardId,
            'board_name' => $this->boardName,
            'parent_type' => $this->parentType,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}


