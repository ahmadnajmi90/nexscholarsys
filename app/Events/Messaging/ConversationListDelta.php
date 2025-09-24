<?php

namespace App\Events\Messaging;

use App\Models\Messaging\Conversation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversationListDelta implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The conversation instance.
     *
     * @var Conversation
     */
    public $conversation;

    /**
     * The actor user ID (who triggered the change).
     *
     * @var int|null
     */
    public $actorUserId;

    /**
     * The type of change ('message_sent', 'message_edited', 'message_deleted').
     *
     * @var string
     */
    public $changeType;

    /**
     * Create a new event instance.
     *
     * @param Conversation $conversation
     * @param int|null $actorUserId
     * @param string $changeType
     */
    public function __construct(Conversation $conversation, ?int $actorUserId = null, string $changeType = 'message_sent')
    {
        $this->conversation = $conversation;
        $this->actorUserId = $actorUserId;
        $this->changeType = $changeType;

        // Load necessary relationships
        $this->conversation->load(['participants', 'lastMessage.sender']);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $channels = [];

        // Get active participants except the actor
        $participants = $this->conversation->participants()->active()->get();

        foreach ($participants as $participant) {
            if ($this->actorUserId && $participant->user_id === $this->actorUserId) {
                continue; // Exclude the actor
            }
            $channels[] = new PrivateChannel('App.Models.User.' . $participant->user_id);
        }

        return $channels;
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        $payload = [
            'conversation_id' => $this->conversation->id,
            'updated_at' => $this->conversation->updated_at->toISOString(),
            'unread_delta' => $this->getUnreadDelta(),
        ];

        if ($this->conversation->title) {
            $payload['title'] = $this->conversation->title;
        }

        if ($this->conversation->icon_path) {
            $payload['icon_path'] = $this->conversation->icon_path;
        }

        if ($this->conversation->lastMessage) {
            $payload['last_message_preview'] = $this->getLastMessagePreview();
            $payload['last_message_type'] = $this->conversation->lastMessage->type;
            $payload['last_message_sender_id'] = $this->conversation->lastMessage->sender->id;
        }

        return $payload;
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'ConversationListDelta';
    }

    /**
     * Get the last message preview text.
     *
     * @return string|null
     */
    protected function getLastMessagePreview(): ?string
    {
        if (!$this->conversation->lastMessage) {
            return null;
        }

        $message = $this->conversation->lastMessage;

        if ($message->type === 'text') {
            return substr($message->body, 0, 50) . (strlen($message->body) > 50 ? '...' : '');
        } elseif ($message->hasAttachments()) {
            return '📎 ' . $message->attachments->count() . ' file(s)';
        } else {
            return '📄 ' . ucfirst($message->type);
        }
    }

    /**
     * Get the unread delta for this event.
     *
     * @return int
     */
    protected function getUnreadDelta(): int
    {
        switch ($this->changeType) {
            case 'message_sent':
                return 1; // Increment unread for receivers
            case 'message_edited':
            case 'message_deleted':
                return 0; // No change to unread count
            default:
                return 0;
        }
    }
}
