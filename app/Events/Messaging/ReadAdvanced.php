<?php

namespace App\Events\Messaging;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReadAdvanced implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The conversation ID.
     *
     * @var int
     */
    public $conversationId;

    /**
     * The user ID.
     *
     * @var int
     */
    public $userId;

    /**
     * The last read message ID.
     *
     * @var int
     */
    public $lastReadMessageId;

    /**
     * Create a new event instance.
     *
     * @param int $conversationId
     * @param int $userId
     * @param int $lastReadMessageId
     */
    public function __construct(int $conversationId, int $userId, int $lastReadMessageId)
    {
        $this->conversationId = $conversationId;
        $this->userId = $userId;
        $this->lastReadMessageId = $lastReadMessageId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('conversation.' . $this->conversationId),
        ];
    }
    
    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversationId,
            'user_id' => $this->userId,
            'last_read_message_id' => $this->lastReadMessageId,
        ];
    }
    
    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'ReadAdvanced';
    }
}
