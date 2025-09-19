<?php

namespace App\Events\Messaging;

use App\Models\Messaging\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageEdited implements ShouldBroadcastNow
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
     * The updated message body.
     *
     * @var string
     */
    public $body;

    /**
     * The edited timestamp.
     *
     * @var string
     */
    public $editedAt;

    /**
     * Create a new event instance.
     *
     * @param Message $message
     */
    public function __construct(Message $message)
    {
        $this->conversationId = $message->conversation_id;
        $this->messageId = $message->id;
        $this->body = $message->body;
        $this->editedAt = $message->edited_at;
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
            'body' => $this->body,
            'edited_at' => $this->editedAt,
        ];
    }
    
    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'MessageEdited';
    }
}
