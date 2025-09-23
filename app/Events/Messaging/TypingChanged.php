<?php

namespace App\Events\Messaging;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TypingChanged implements ShouldBroadcastNow
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
     * Whether the user is typing.
     *
     * @var bool
     */
    public $isTyping;

    /**
     * Create a new event instance.
     *
     * @param int $conversationId
     * @param int $userId
     * @param bool $isTyping
     */
    public function __construct(int $conversationId, int $userId, bool $isTyping)
    {
        $this->conversationId = $conversationId;
        $this->userId = $userId;
        $this->isTyping = $isTyping;
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
            'is_typing' => $this->isTyping,
        ];
    }
    
    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'TypingChanged';
    }
}
