<?php

namespace App\Models\Messaging;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

/**
 * ConversationParticipant Model
 * 
 * Represents a user's participation in a conversation with role and tracking data.
 * 
 * @property int $id
 * @property int $conversation_id - ID of the conversation
 * @property int $user_id - ID of the participating user
 * @property string $role - 'owner', 'admin', or 'member'
 * @property int|null $last_read_message_id - ID of last message read by user
 * @property bool $pinned - Whether conversation is pinned for this user
 * @property \Carbon\Carbon|null $muted_until - When mute expires (null = not muted)
 * @property \Carbon\Carbon $joined_at - When user joined the conversation
 * @property \Carbon\Carbon|null $left_at - When user left (null = still active)
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * 
 * @property-read Conversation $conversation
 * @property-read User $user
 * @property-read Message|null $lastReadMessage
 */
class ConversationParticipant extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'conversation_id',
        'user_id',
        'role',
        'last_read_message_id',
        'pinned',
        'muted_until',
        'joined_at',
        'left_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'pinned' => 'boolean',
        'muted_until' => 'datetime',
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the conversation this participant belongs to.
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the user who is participating.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the last message read by this participant.
     */
    public function lastReadMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_read_message_id');
    }

    /**
     * Check if this participant is currently muted.
     */
    public function isMuted(): bool
    {
        return $this->muted_until && $this->muted_until->isFuture();
    }

    /**
     * Check if this participant has admin privileges (owner or admin).
     */
    public function hasAdminPrivileges(): bool
    {
        return in_array($this->role, ['owner', 'admin']);
    }

    /**
     * Check if this participant is still active in the conversation.
     */
    public function isActive(): bool
    {
        return is_null($this->left_at);
    }

    /**
     * Scope to get only active participants.
     */
    public function scopeActive($query)
    {
        return $query->whereNull('left_at');
    }

    /**
     * Mark this participant as having read up to a specific message.
     */
    public function markAsRead(int $messageId): bool
    {
        return $this->update(['last_read_message_id' => $messageId]);
    }
}