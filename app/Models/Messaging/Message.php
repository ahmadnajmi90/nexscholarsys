<?php

namespace App\Models\Messaging;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

/**
 * Message Model
 * 
 * Represents an individual message within a conversation.
 * 
 * @property int $id
 * @property int $conversation_id - ID of the conversation
 * @property int $user_id - ID of the message sender
 * @property string $type - 'text', 'image', 'file', or 'system'
 * @property string|null $body - Message content (required for text messages)
 * @property int|null $reply_to_id - ID of message being replied to
 * @property \Carbon\Carbon|null $delivered_at - When message was delivered
 * @property \Carbon\Carbon|null $read_at - When message was read (simplified tracking)
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * @property \Carbon\Carbon|null $deleted_at - Soft delete timestamp
 * 
 * @property-read Conversation $conversation
 * @property-read User $sender - User who sent the message
 * @property-read Message|null $replyTo - Message being replied to
 * @property-read \Illuminate\Database\Eloquent\Collection|Message[] $replies
 * @property-read \Illuminate\Database\Eloquent\Collection|MessageAttachment[] $attachments
 */
class Message extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'conversation_id',
        'user_id',
        'type',
        'body',
        'reply_to_id',
        'delivered_at',
        'read_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'delivered_at' => 'datetime',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the conversation this message belongs to.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the user who sent this message.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the message this is replying to.
     */
    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'reply_to_id');
    }

    /**
     * Get all replies to this message.
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Message::class, 'reply_to_id');
    }

    /**
     * Get all attachments for this message.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(MessageAttachment::class);
    }

    /**
     * Scope to get messages for a specific conversation.
     */
    public function scopeForConversation($query, int $conversationId)
    {
        return $query->where('conversation_id', $conversationId);
    }

    /**
     * Scope for keyset pagination - messages before a specific point.
     */
    public function scopeBefore($query, $beforeCreatedAt = null, $beforeId = null)
    {
        if ($beforeCreatedAt && $beforeId) {
            return $query->where(function ($q) use ($beforeCreatedAt, $beforeId) {
                $q->where('created_at', '<', $beforeCreatedAt)
                  ->orWhere(function ($q2) use ($beforeCreatedAt, $beforeId) {
                      $q2->where('created_at', '=', $beforeCreatedAt)
                         ->where('id', '<', $beforeId);
                  });
            });
        }
        
        return $query;
    }

    /**
     * Scope to order messages for pagination (newest to oldest).
     */
    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc')->orderBy('id', 'desc');
    }

    /**
     * Check if this message can be edited by the given user.
     */
    public function canBeEditedBy(int $userId): bool
    {
        if ($this->user_id !== $userId) {
            return false;
        }

        $editWindow = config('messaging.edit_window_minutes', 15);
        return $this->created_at->diffInMinutes(now()) <= $editWindow;
    }

    /**
     * Check if this message can be deleted by the given user.
     */
    public function canBeDeletedBy(int $userId): bool
    {
        if ($this->user_id !== $userId) {
            return false;
        }

        $deleteWindow = config('messaging.delete_window_minutes', 60);
        return $this->created_at->diffInMinutes(now()) <= $deleteWindow;
    }

    /**
     * Check if message has attachments.
     */
    public function hasAttachments(): bool
    {
        return $this->attachments()->exists();
    }
}