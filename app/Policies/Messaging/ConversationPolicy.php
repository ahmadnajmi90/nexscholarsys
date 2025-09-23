<?php

namespace App\Policies\Messaging;

use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ConversationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Any authenticated user can view their conversations
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Conversation $conversation): bool
    {
        // User must be a participant of the conversation
        return $conversation->participants()
            ->where('user_id', $user->id)
            ->whereNull('left_at')
            ->exists();
    }

    /**
     * Determine whether the user can create models.
     * 
     * This method checks if the user has permission to create a conversation with the specified participants.
     * For direct messages, the participant must be an accepted connection of the user.
     * For group chats, all participants must be accepted connections of the user.
     */
    public function create(User $user, array $data = null): bool
    {
        // If no data is provided, we can't validate participants
        if (!$data) {
            return true;
        }

        // For direct messages, check if the participant is an accepted connection
        if (isset($data['type']) && $data['type'] === 'direct' && isset($data['user_id'])) {
            $participantId = $data['user_id'];
            return $this->isAcceptedConnection($user->id, $participantId);
        }

        // For group chats, check if all participants are accepted connections
        if (isset($data['type']) && $data['type'] === 'group' && isset($data['user_ids']) && is_array($data['user_ids'])) {
            foreach ($data['user_ids'] as $participantId) {
                // Skip checking the user themselves
                if ($participantId == $user->id) {
                    continue;
                }
                
                // If any participant is not an accepted connection, deny creation
                if (!$this->isAcceptedConnection($user->id, $participantId)) {
                    return false;
                }
            }
            return true;
        }

        // If we can't determine the type or participants, default to true
        // The validation rules will catch any issues with the request format
        return true;
    }
    
    /**
     * Check if two users have an accepted connection.
     * 
     * @param int $userA
     * @param int $userB
     * @return bool
     */
    protected function isAcceptedConnection(int $userA, int $userB): bool
    {
        // Check if there is an accepted connection between the two users
        return \App\Models\Connection::where(function ($query) use ($userA, $userB) {
                $query->where('requester_id', $userA)
                      ->where('recipient_id', $userB);
            })
            ->orWhere(function ($query) use ($userA, $userB) {
                $query->where('requester_id', $userB)
                      ->where('recipient_id', $userA);
            })
            ->where('status', 'accepted')
            ->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Conversation $conversation): bool
    {
        // Only admin, owner, or creator can update the conversation
        $participant = $conversation->participants()
            ->where('user_id', $user->id)
            ->whereNull('left_at')
            ->first();
            
        return $participant && 
            ($participant->role === 'admin' || 
             $participant->role === 'owner' || 
             $conversation->created_by === $user->id);
    }

    /**
     * Determine whether the user can send messages to the conversation.
     */
    public function send(User $user, Conversation $conversation): bool
    {
        // User must be an active participant
        $participant = $conversation->participants()
            ->where('user_id', $user->id)
            ->whereNull('left_at')
            ->first();
            
        // Check if the user has hidden the conversation
        return $participant && !$participant->archived_at;
    }

    /**
     * Determine whether the user can archive the conversation.
     */
    public function archive(User $user, Conversation $conversation): bool
    {
        // Any participant can archive a conversation for themselves
        return $conversation->participants()
            ->where('user_id', $user->id)
            ->whereNull('left_at')
            ->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Conversation $conversation): bool
    {
        // Only the creator can delete the entire conversation
        return $conversation->created_by === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Conversation $conversation): bool
    {
        return $conversation->created_by === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Conversation $conversation): bool
    {
        return $conversation->created_by === $user->id;
    }
}
