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

class BoardListDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The ID of the board list that was deleted.
     *
     * @var int
     */
    public $listId;

    /**
     * The ID of the board the list belonged to.
     *
     * @var int
     */
    public $boardId;

    /**
     * The user who deleted the board list.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param  int  $listId
     * @param  int  $boardId
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(int $listId, int $boardId, User $user)
    {
        $this->listId = $listId;
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
        return 'board-list.deleted';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'list_id' => $this->listId,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}


