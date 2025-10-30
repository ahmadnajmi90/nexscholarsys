<?php

namespace App\Events;

use App\Models\Board;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BoardCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The board that was created.
     *
     * @var \App\Models\Board
     */
    public $board;

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
     * The user who created the board.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Board  $board
     * @param  string  $parentType
     * @param  int  $parentId
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(Board $board, string $parentType, int $parentId, User $user)
    {
        $this->board = $board;
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
        return 'board.created';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'board' => [
                'id' => $this->board->id,
                'name' => $this->board->name,
                'boardable_id' => $this->board->boardable_id,
                'boardable_type' => $this->board->boardable_type,
            ],
            'parent_type' => $this->parentType,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}


