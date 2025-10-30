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

class BoardListCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The board list that was created.
     *
     * @var \App\Models\BoardList
     */
    public $boardList;

    /**
     * The user who created the board list.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\BoardList  $boardList
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(BoardList $boardList, User $user)
    {
        $this->boardList = $boardList;
        $this->user = $user;
        
        // Load necessary relationships
        if (!$this->boardList->relationLoaded('board')) {
            $this->boardList->load('board');
        }
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
        return 'board-list.created';
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
                'order' => $this->boardList->order,
                'tasks' => [],
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}


