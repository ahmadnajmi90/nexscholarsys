<?php

namespace App\Services\Messaging;

use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ConversationService
{
    /**
     * Create a new conversation or return an existing one for direct messages.
     *
     * @param array $data
     * @param User $user
     * @return Conversation
     */
    public function create(array $data, User $user): Conversation
    {
        return DB::transaction(function () use ($data, $user) {
            // For direct conversations, check if one already exists between these users
            if ($data['type'] === 'direct' && isset($data['user_id'])) {
                $existingConversation = $this->findDirectConversation($user->id, $data['user_id']);
                if ($existingConversation) {
                    // Return the existing conversation instead of creating a new one
                    return $existingConversation;
                }
            }
            
            // Create the conversation
            $conversation = Conversation::create([
                'type' => $data['type'],
                'title' => $data['title'] ?? null,
                'created_by' => $user->id,
            ]);
            
            // Add the creator as a participant (owner for groups, member for direct)
            ConversationParticipant::create([
                'conversation_id' => $conversation->id,
                'user_id' => $user->id,
                'role' => $data['type'] === 'group' ? 'owner' : 'member',
            ]);
            
            // Add other participants
            if ($data['type'] === 'direct' && isset($data['user_id'])) {
                // For direct conversations, add the other user
                ConversationParticipant::create([
                    'conversation_id' => $conversation->id,
                    'user_id' => $data['user_id'],
                    'role' => 'member',
                ]);
            } elseif ($data['type'] === 'group' && isset($data['user_ids']) && is_array($data['user_ids'])) {
                // For group conversations, add all users
                foreach ($data['user_ids'] as $userId) {
                    if ($userId != $user->id) { // Skip creator as they're already added
                        ConversationParticipant::create([
                            'conversation_id' => $conversation->id,
                            'user_id' => $userId,
                            'role' => 'member',
                        ]);
                    }
                }
            }
            
            return $conversation;
        });
    }

    public function createDirectConversation(User $initiator, User $target): Conversation
    {
        return DB::transaction(function () use ($initiator, $target) {
            $existing = $this->findDirectConversation($initiator->id, $target->id);
            if ($existing) {
                return $existing;
            }

            $conversation = Conversation::create([
                'type' => 'direct',
                'title' => null,
                'created_by' => $initiator->id,
            ]);

            ConversationParticipant::insert([
                [
                    'conversation_id' => $conversation->id,
                    'user_id' => $initiator->id,
                    'role' => 'member',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'conversation_id' => $conversation->id,
                    'user_id' => $target->id,
                    'role' => 'member',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);

            return $conversation;
        });
    }
    
    /**
     * Find an existing direct conversation between two users.
     *
     * @param int $userAId
     * @param int $userBId
     * @return Conversation|null
     */
    public function findDirectConversation(int $userAId, int $userBId): ?Conversation
    {
        // Find conversations where both users are participants
        $conversationIds = ConversationParticipant::where('user_id', $userAId)
            ->whereNull('left_at')
            ->pluck('conversation_id');
            
        if ($conversationIds->isEmpty()) {
            return null;
        }
        
        $matchingConversations = ConversationParticipant::whereIn('conversation_id', $conversationIds)
            ->where('user_id', $userBId)
            ->whereNull('left_at')
            ->pluck('conversation_id');
            
        if ($matchingConversations->isEmpty()) {
            return null;
        }
        
        // Find a direct conversation among these
        return Conversation::whereIn('id', $matchingConversations)
            ->where('type', 'direct')
            ->first();
    }
    
    /**
     * Toggle archive status for a conversation participant.
     *
     * @param Conversation $conversation
     * @param User $user
     * @return ConversationParticipant
     */
    public function toggleArchive(Conversation $conversation, User $user): ConversationParticipant
    {
        $participant = $conversation->participants()
            ->where('user_id', $user->id)
            ->first();
            
        if (!$participant) {
            throw new \Exception('User is not a participant in this conversation.');
        }
        
        $participant->archived_at = $participant->archived_at ? null : now();
        $participant->save();
        
        return $participant;
    }
    
    /**
     * Get conversations for a user with unread counts and last message.
     *
     * @param User $user
     * @param array $filters
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getConversationsForUser(User $user, array $filters = [])
    {
        $query = Conversation::whereHas('participants', function ($q) use ($user) {
            $q->where('user_id', $user->id)
                ->whereNull('left_at');
        });
        
        // Filter by search term if provided
        if (!empty($filters['q'])) {
            $searchTerm = $filters['q'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
                    ->orWhereHas('participants.user', function ($q2) use ($searchTerm) {
                        $q2->where('name', 'like', "%{$searchTerm}%");
                    });
            });
        }
        
        // Filter by archived status if provided
        if (isset($filters['archived'])) {
            $isArchived = filter_var($filters['archived'], FILTER_VALIDATE_BOOLEAN);
            $query->whereHas('participants', function ($q) use ($user, $isArchived) {
                $q->where('user_id', $user->id)
                    ->where(function ($q2) use ($isArchived) {
                        if ($isArchived) {
                            $q2->whereNotNull('archived_at');
                        } else {
                            $q2->whereNull('archived_at');
                        }
                    });
            });
        }
        
        // Load relationships with role profiles for full_name and avatar_url accessors
        $query->with([
            'participants.user',
            'participants.user.academician:id,academician_id,full_name,profile_picture,url',
            'participants.user.postgraduate:id,postgraduate_id,full_name,profile_picture,url',
            'participants.user.undergraduate:id,undergraduate_id,full_name,profile_picture,url',
            'lastMessage.sender',
            'lastMessage.sender.academician:id,academician_id,full_name,profile_picture,url',
            'lastMessage.sender.postgraduate:id,postgraduate_id,full_name,profile_picture,url',
            'lastMessage.sender.undergraduate:id,undergraduate_id,full_name,profile_picture,url',
        ]);
        
        // Sort by last message time (or created_at if no messages)
        $query->leftJoin('messages', 'conversations.last_message_id', '=', 'messages.id')
            ->orderByRaw('COALESCE(messages.created_at, conversations.created_at) DESC')
            ->select('conversations.*');
        
        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Create a compact conversation delta payload for sidebar updates.
     *
     * @param Conversation $conversation
     * @param int|null $actorUserId
     * @param string $changeType
     * @return array
     */
    public function makeListDelta(Conversation $conversation, ?int $actorUserId = null, string $changeType = 'message_sent'): array
    {
        // Ensure relationships are loaded
        $conversation->loadMissing(['lastMessage.sender']);

        $payload = [
            'conversation_id' => $conversation->id,
            'updated_at' => $conversation->updated_at->toISOString(),
            'unread_delta' => $this->calculateUnreadDelta($changeType, $actorUserId),
        ];

        if ($conversation->title) {
            $payload['title'] = $conversation->title;
        }

        if ($conversation->icon_path) {
            $payload['icon_path'] = $conversation->icon_path;
        }

        if ($conversation->lastMessage) {
            $payload['last_message_preview'] = $this->getLastMessagePreview($conversation->lastMessage);
            $payload['last_message_type'] = $conversation->lastMessage->type;
            $payload['last_message_sender_id'] = $conversation->lastMessage->sender->id;
        }

        return $payload;
    }

    /**
     * Get the last message preview text.
     *
     * @param Message $message
     * @return string|null
     */
    protected function getLastMessagePreview($message): ?string
    {
        if ($message->type === 'text') {
            return substr($message->body, 0, 50) . (strlen($message->body) > 50 ? '...' : '');
        } elseif ($message->hasAttachments()) {
            return '📎 ' . $message->attachments->count() . ' file(s)';
        } else {
            return '📄 ' . ucfirst($message->type);
        }
    }

    /**
     * Calculate the unread delta based on change type and actor.
     *
     * @param string $changeType
     * @param int|null $actorUserId
     * @return int
     */
    protected function calculateUnreadDelta(string $changeType, ?int $actorUserId): int
    {
        switch ($changeType) {
            case 'message_sent':
                return $actorUserId ? 0 : 1; // 0 for actor, 1 for others
            case 'message_edited':
            case 'message_deleted':
                return 0; // No change
            default:
                return 0;
        }
    }
}
