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
            'participants.user.academician:academician_id,full_name,profile_picture',
            'participants.user.postgraduate:postgraduate_id,full_name,profile_picture',
            'participants.user.undergraduate:undergraduate_id,full_name,profile_picture',
            'lastMessage.sender',
            'lastMessage.sender.academician:academician_id,full_name,profile_picture',
            'lastMessage.sender.postgraduate:postgraduate_id,full_name,profile_picture',
            'lastMessage.sender.undergraduate:undergraduate_id,full_name,profile_picture',
        ]);
        
        // Sort by last message time (or created_at if no messages)
        $query->leftJoin('messages', 'conversations.last_message_id', '=', 'messages.id')
            ->orderByRaw('COALESCE(messages.created_at, conversations.created_at) DESC')
            ->select('conversations.*');
        
        return $query->paginate($filters['per_page'] ?? 15);
    }
}
