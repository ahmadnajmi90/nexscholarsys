<?php

namespace App\Policies;

use App\Models\Messaging\Message;
use App\Models\User;
use App\Models\Messaging\Conversation;
use Illuminate\Auth\Access\Response;

class MessagePolicy
{
    /**
     * Determine whether the user can view any messages.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the message.
     * Only participants of the conversation can view messages.
     */
    public function view(User $user, Message $message): bool
    {
        return $message->conversation->hasParticipant($user->id);
    }

    /**
     * Determine whether the user can create messages.
     * Only active participants can send messages to a conversation.
     */
    public function create(User $user, Conversation $conversation): bool
    {
        return $conversation->participants()
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Determine whether the user can send a message to a specific conversation.
     */
    public function send(User $user, $conversation): bool
    {
        $participant = $conversation->getParticipant($user->id);
        
        return $participant && $participant->isActive();
    }

    /**
     * Determine whether the user can update the message.
     * Only the sender can edit their own messages within the edit window.
     */
    public function update(User $user, Message $message): bool
    {
        if ($message->user_id !== $user->id) {
            return false;
        }

        return $message->canBeEditedBy($user->id);
    }

    /**
     * Determine whether the user can delete the message.
     * Senders can delete within the delete window, admins can moderate anytime.
     */
    public function delete(User $user, Message $message): bool
    {
        // System admins can always delete for moderation
        if ($user->isAn('Admin')) {
            return true;
        }

        // Conversation admins can delete messages for moderation
        $participant = $message->conversation->getParticipant($user->id);
        if ($participant && $participant->hasAdminPrivileges()) {
            return true;
        }

        // Senders can delete their own messages within the delete window
        if ($message->user_id === $user->id) {
            return $message->canBeDeletedBy($user->id);
        }

        return false;
    }

    /**
     * Determine whether the user can reply to the message.
     * Any conversation participant can reply to messages.
     */
    public function reply(User $user, Message $message): bool
    {
        return $message->conversation->hasParticipant($user->id);
    }

    /**
     * Determine whether the user can react to the message.
     * Any conversation participant can react to messages.
     */
    public function react(User $user, Message $message): bool
    {
        return $message->conversation->hasParticipant($user->id);
    }

    /**
     * Determine whether the user can moderate the message.
     * Only system admins and conversation admins can moderate messages.
     */
    public function moderate(User $user, Message $message): bool
    {
        // System admins can always moderate
        if ($user->isAn('Admin')) {
            return true;
        }

        // Conversation admins can moderate
        $participant = $message->conversation->getParticipant($user->id);
        
        return $participant && $participant->hasAdminPrivileges();
    }

    /**
     * Determine whether the user can restore the message.
     */
    public function restore(User $user, Message $message): bool
    {
        return $this->moderate($user, $message);
    }

    /**
     * Determine whether the user can permanently delete the message.
     */
    public function forceDelete(User $user, Message $message): bool
    {
        return $user->isAn('Admin');
    }
}