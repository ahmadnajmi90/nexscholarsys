<?php

namespace App\Policies;

use App\Models\Messaging\Conversation;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ConversationPolicy
{
    /**
     * Determine whether the user can view any conversations.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the conversation.
     * Only participants can view a conversation.
     */
    public function view(User $user, Conversation $conversation): bool
    {
        return $conversation->hasParticipant($user->id);
    }

    /**
     * Determine whether the user can create conversations.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the conversation.
     * Only conversation owners and admins can update conversation details.
     */
    public function update(User $user, Conversation $conversation): bool
    {
        $participant = $conversation->getParticipant($user->id);
        
        if (!$participant || !$participant->isActive()) {
            return false;
        }

        return $participant->hasAdminPrivileges();
    }

    /**
     * Determine whether the user can delete/archive the conversation.
     * Only conversation owners can delete conversations.
     */
    public function delete(User $user, Conversation $conversation): bool
    {
        $participant = $conversation->getParticipant($user->id);
        
        if (!$participant || !$participant->isActive()) {
            return false;
        }

        return $participant->role === 'owner';
    }

    /**
     * Determine whether the user can add participants to the conversation.
     * Only owners and admins can add participants to group conversations.
     * Direct conversations cannot have participants added.
     */
    public function addParticipant(User $user, Conversation $conversation): bool
    {
        if ($conversation->type === 'direct') {
            return false;
        }

        $participant = $conversation->getParticipant($user->id);
        
        if (!$participant || !$participant->isActive()) {
            return false;
        }

        return $participant->hasAdminPrivileges();
    }

    /**
     * Determine whether the user can remove participants from the conversation.
     * Only owners and admins can remove participants from group conversations.
     */
    public function removeParticipant(User $user, Conversation $conversation): bool
    {
        if ($conversation->type === 'direct') {
            return false;
        }

        $participant = $conversation->getParticipant($user->id);
        
        if (!$participant || !$participant->isActive()) {
            return false;
        }

        return $participant->hasAdminPrivileges();
    }

    /**
     * Determine whether the user can leave the conversation.
     * All participants can leave a conversation.
     */
    public function leave(User $user, Conversation $conversation): bool
    {
        $participant = $conversation->getParticipant($user->id);
        
        return $participant && $participant->isActive();
    }

    /**
     * Determine whether the user can moderate the conversation.
     * Only system admins can moderate conversations (for content moderation).
     */
    public function moderate(User $user, Conversation $conversation): bool
    {
        return $user->isAn('Admin');
    }

    /**
     * Determine whether the user can restore the conversation.
     */
    public function restore(User $user, Conversation $conversation): bool
    {
        return $this->delete($user, $conversation);
    }

    /**
     * Determine whether the user can permanently delete the conversation.
     */
    public function forceDelete(User $user, Conversation $conversation): bool
    {
        return $user->isAn('Admin');
    }
}