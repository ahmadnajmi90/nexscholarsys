<?php

namespace App\Events;

use App\Models\Messaging\ConversationParticipant;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationRead implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The conversation participant instance.
     *
     * @var \App\Models\Messaging\ConversationParticipant
     */
    public $participant;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(ConversationParticipant $participant)
    {
        $this->participant = $participant;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('conversation.' . $this->participant->conversation_id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'conversation.read';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'conversation_id' => $this->participant->conversation_id,
            'user_id' => $this->participant->user_id,
            'last_read_message_id' => $this->participant->last_read_message_id,
            'updated_at' => $this->participant->updated_at->toIso8601String(),
        ];
    }
}