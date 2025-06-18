<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Connection;

class ConnectionStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The connection instance.
     *
     * @var \App\Models\Connection
     */
    public $connection;

    /**
     * The status type.
     *
     * @var string
     */
    public $statusType;

    /**
     * Create a new event instance.
     *
     * @param \App\Models\Connection|object $connection
     * @param string $statusType - Options are 'requested', 'accepted', 'rejected'
     */
    public function __construct($connection, string $statusType)
    {
        $this->connection = $connection;
        $this->statusType = $statusType;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
