<?php

namespace App\Events\Messaging;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The conversation ID.
     *
     * @var int
     */
    public $conversationId;

    /**
     * The message ID.
     *
     * @var int
     */
    public $messageId;

    /**
     * The deletion scope.
     *
     * @var string
     */
    public $scope;

    /**
     * Create a new event instance.
     *
     * @param int $conversationId
     * @param int $messageId
     * @param string $scope
     */
    public function __construct(int $conversationId, int $messageId, string $scope = 'all')
    {
        $this->conversationId = $conversationId;
        $this->messageId = $messageId;
        $this->scope = $scope;
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
            'id' => $this->messageId,
            'scope' => $this->scope,
        ];
    }
    
    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'MessageDeleted';
    }
}
