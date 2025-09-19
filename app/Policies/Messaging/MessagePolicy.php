<?php

namespace App\Policies\Messaging;

use App\Models\Messaging\Message;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Config;

class MessagePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false; // Messages should be accessed through conversations
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Message $message): bool
    {
        // User must be a participant of the conversation
        return $message->conversation->participants()
            ->where('user_id', $user->id)
            ->whereNull('left_at')
            ->exists();
    }

    /**
     * Determine whether the user can create messages.
     */
    public function create(User $user, $conversation): bool
    {
        // Delegate to the conversation's send policy
        return app()->make(ConversationPolicy::class)->send($user, $conversation);
    }

    /**
     * Determine whether the user can edit the message.
     */
    public function edit(User $user, Message $message): bool
    {
        // User must be the sender and within the edit window
        if ($message->user_id !== $user->id) {
            return false;
        }
        
        $editWindowMinutes = Config::get('messaging.edit_window_minutes', 10);
        return $message->created_at->diffInMinutes(now()) <= $editWindowMinutes;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Message $message): bool
    {
        // Alias to edit
        return $this->edit($user, $message);
    }

    /**
     * Determine whether the user can delete the message for everyone.
     */
    public function deleteForEveryone(User $user, Message $message): bool
    {
        // User must be the sender and within the delete window
        if ($message->user_id !== $user->id) {
            return false;
        }
        
        $deleteWindowMinutes = Config::get('messaging.delete_window_minutes', 60);
        return $message->created_at->diffInMinutes(now()) <= $deleteWindowMinutes;
    }

    /**
     * Determine whether the user can delete the message for themselves.
     */
    public function deleteForMe(User $user, Message $message): bool
    {
        // User must be a participant of the conversation
        return $message->conversation->participants()
            ->where('user_id', $user->id)
            ->whereNull('left_at')
            ->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Message $message): bool
    {
        // Either can delete for everyone or for themselves
        return $this->deleteForEveryone($user, $message) || $this->deleteForMe($user, $message);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Message $message): bool
    {
        // Only sender can restore
        return $message->user_id === $user->id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Message $message): bool
    {
        // Only admins can force delete
        return $user->isAdmin();
    }
}
