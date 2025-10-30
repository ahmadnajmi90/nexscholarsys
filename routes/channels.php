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

// Workspace channel - authorize members only
Broadcast::channel('workspaces.{id}', function ($user, $id) {
    // Check if user is a member of this workspace
    return \App\Models\Workspace::where('id', $id)
        ->whereHas('members', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })
        ->exists();
});

// Board channel - authorize board members only
Broadcast::channel('boards.{id}', function ($user, $id) {
    // Check if user is a member of this board
    // Board members are inherited from parent workspace/project
    $board = \App\Models\Board::with('boardable')->find($id);
    
    if (!$board) {
        return false;
    }
    
    // Check if user is a member of the parent (workspace or project)
    if ($board->boardable_type === 'App\Models\Workspace') {
        return $board->boardable->members()->where('users.id', $user->id)->exists();
    } elseif ($board->boardable_type === 'App\Models\Project') {
        return $board->boardable->members()->where('users.id', $user->id)->exists();
    }
    
    return false;
});

// Project channel - authorize members only
Broadcast::channel('projects.{id}', function ($user, $id) {
    return \App\Models\Project::where('id', $id)
        ->whereHas('members', function ($query) use ($user) {
            $query->where('users.id', $user->id);
        })
        ->exists();
});
