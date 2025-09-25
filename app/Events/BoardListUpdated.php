<?php

namespace App\Events;

use App\Models\BoardList;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BoardListUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The board list that was updated.
     *
     * @var \App\Models\BoardList
     */
    public $boardList;

    /**
     * The user who updated the board list.
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
     * @param  \App\Models\BoardList  $boardList
     * @param  \App\Models\User  $user
     * @param  string  $updateType
     * @return void
     */
    public function __construct(BoardList $boardList, User $user, string $updateType = 'updated')
    {
        $this->boardList = $boardList;
        $this->user = $user;
        $this->updateType = $updateType;

        // Load necessary relationships
        $this->boardList->load(['board']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('boards.' . $this->boardList->board_id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'board-list.updated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'board_list' => [
                'id' => $this->boardList->id,
                'name' => $this->boardList->name,
                'board_id' => $this->boardList->board_id,
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
