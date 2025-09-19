<?php

use App\Models\Messaging\ConversationParticipant;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('conversation.{id}', function ($user, $id) {
    return ConversationParticipant::where('conversation_id', $id)
        ->where('user_id', $user->id)
        ->whereNull('left_at')
        ->exists();
});
