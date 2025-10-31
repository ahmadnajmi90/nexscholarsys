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

class BoardUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The board that was updated.
     *
     * @var \App\Models\Board
     */
    public $board;

    /**
     * The user who updated the board.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * The type of update (e.g., 'renamed').
     *
     * @var string
     */
    public $updateType;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Board  $board
     * @param  \App\Models\User  $user
     * @param  string  $updateType
     * @return void
     */
    public function __construct(Board $board, User $user, string $updateType = 'updated')
    {
        $this->board = $board;
        $this->user = $user;
        $this->updateType = $updateType;

        // Load necessary relationships
        $this->board->load(['boardable', 'members']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        $channels = [
            new PrivateChannel('boards.' . $this->board->id),
        ];
        
        // Also broadcast to parent workspace/project channel
        if ($this->board->boardable_type === 'App\Models\Workspace') {
            $channels[] = new PrivateChannel('workspaces.' . $this->board->boardable_id);
        } elseif ($this->board->boardable_type === 'App\Models\Project') {
            $channels[] = new PrivateChannel('projects.' . $this->board->boardable_id);
        }
        
        return $channels;
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'board.updated';
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
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'update_type' => $this->updateType,
            // Include timestamp to help with update conflicts
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
