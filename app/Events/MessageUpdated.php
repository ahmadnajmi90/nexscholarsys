<?php

namespace App\Events;

use App\Models\Messaging\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The message instance.
     *
     * @var \App\Models\Messaging\Message
     */
    public $message;

    /**
     * The type of update (edited, deleted, etc.)
     *
     * @var string
     */
    public $updateType;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Message $message, string $updateType = 'updated')
    {
        $this->message = $message;
        $this->updateType = $updateType;
        
        // Load relationships for serialization
        $this->message->load(['sender']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('conversation.' . $this->message->conversation_id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'message.updated';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'id' => $this->message->id,
            'conversation_id' => $this->message->conversation_id,
            'user_id' => $this->message->user_id,
            'sender' => [
                'id' => $this->message->sender->id,
                'name' => $this->message->sender->name,
            ],
            'type' => $this->message->type,
            'body' => $this->message->body,
            'update_type' => $this->updateType,
            'deleted_at' => $this->message->deleted_at ? $this->message->deleted_at->toIso8601String() : null,
            'created_at' => $this->message->created_at->toIso8601String(),
            'updated_at' => $this->message->updated_at->toIso8601String(),
        ];
    }
}