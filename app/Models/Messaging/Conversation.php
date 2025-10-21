<?php

namespace App\Models\Messaging;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

/**
 * Conversation Model
 * 
 * Represents a conversation (direct or group chat) between users.
 * 
 * @property int $id
 * @property string $type - 'direct' or 'group'
 * @property string|null $title - Group conversation title (null for direct)
 * @property string|null $icon_path - Path to conversation icon/avatar
 * @property int $created_by - User ID who created the conversation
 * @property int|null $last_message_id - ID of the last message in conversation
 * @property bool $is_archived - Whether conversation is archived
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * 
 * @property-read User $creator - User who created the conversation
 * @property-read Message|null $lastMessage - Most recent message
 * @property-read \Illuminate\Database\Eloquent\Collection|Message[] $messages
 * @property-read \Illuminate\Database\Eloquent\Collection|ConversationParticipant[] $participants
 */
class Conversation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'title',
        'icon_path',
        'created_by',
        'last_message_id',
        'is_archived',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_archived' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who created this conversation.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the last message in this conversation.
     */
    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    /**
     * Get all messages in this conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * Get all participants in this conversation.
     */
    public function participants(): HasMany
    {
        return $this->hasMany(ConversationParticipant::class);
    }

    /**
     * Scope to get conversations for a specific user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->whereHas('participants', function ($q) use ($userId) {
            $q->where('user_id', $userId)->whereNull('left_at');
        });
    }

    /**
     * Check if a user is a participant in this conversation.
     */
    public function hasParticipant(int $userId): bool
    {
        return $this->participants()->where('user_id', $userId)->whereNull('left_at')->exists();
    }

    /**
     * Get the participant record for a specific user.
     */
    public function getParticipant(int $userId): ?ConversationParticipant
    {
        return $this->participants()->where('user_id', $userId)->first();
    }

    /**
     * Get the unread message count for a specific user.
     */
    public function getUnreadCountForUser(int $userId): int
    {
        $participant = $this->getParticipant($userId);
        
        if (!$participant) {
            return 0;
        }

        $lastReadMessageId = $participant->last_read_message_id ?? 0;
        
        return $this->messages()
            ->where('id', '>', $lastReadMessageId)
            ->where('user_id', '!=', $userId)
            ->count();
    }
}