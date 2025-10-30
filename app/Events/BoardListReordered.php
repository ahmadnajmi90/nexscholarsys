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

class BoardListReordered implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The array of lists with their new order.
     *
     * @var array
     */
    public $lists;

    /**
     * The ID of the board the lists belong to.
     *
     * @var int
     */
    public $boardId;

    /**
     * The user who reordered the board lists.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param  array  $lists
     * @param  int  $boardId
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(array $lists, int $boardId, User $user)
    {
        $this->lists = $lists;
        $this->boardId = $boardId;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('boards.' . $this->boardId);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'board-list.reordered';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'lists' => $this->lists,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}


