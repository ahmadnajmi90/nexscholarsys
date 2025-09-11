<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

/**
 * Private channel for conversation - only participants can subscribe
 */
Broadcast::channel('private.conversation.{id}', function ($user, $id) {
    $conversation = Conversation::find($id);
    
    if (!$conversation) {
        return false;
    }
    
    return $conversation->hasParticipant($user->id);
});

/**
 * Presence channel for conversation - provides participant list
 */
Broadcast::channel('presence.conversation.{id}', function ($user, $id) {
    $conversation = Conversation::find($id);
    
    if (!$conversation) {
        return false;
    }
    
    if (!$conversation->hasParticipant($user->id)) {
        return false;
    }
    
    // Get participant info for presence channel
    $participant = $conversation->getParticipant($user->id);
    
    return [
        'id' => $user->id,
        'name' => $user->name,
        'role' => $participant ? $participant->role : 'member',
        'is_muted' => $participant ? $participant->isMuted() : false,
    ];
});
