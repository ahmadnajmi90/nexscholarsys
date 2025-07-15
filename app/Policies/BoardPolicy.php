<?php

namespace App\Policies;

use App\Models\Board;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Project;
use Illuminate\Auth\Access\HandlesAuthorization;

class BoardPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a board in the workspace.
     */
    public function create(User $user, $boardable): bool
    {
        // User can create a board if they are a member of the parent entity
        if ($boardable instanceof Workspace) {
            return $boardable->members->contains($user);
        } elseif ($boardable instanceof Project) {
            return $user->id === $boardable->owner_id || $boardable->members->contains($user);
        }
        
        return false;
    }

    /**
     * Determine whether the user can view the board.
     */
    public function view(User $user, Board $board): bool
    {
        // User can view a board if they can view its parent entity
        $board->load('boardable');
        return $user->can('view', $board->boardable);
    }

    /**
     * Determine whether the user can update the board.
     */
    public function update(User $user, Board $board): bool
    {
        // Load the boardable relationship
        $board->load('boardable');
        $boardable = $board->boardable;
        
        if (!$boardable) {
            return false;
        }
        
        // Check based on parent entity type
        if ($boardable instanceof Workspace) {
            // User can update a board if they are an admin of its parent workspace
            $member = $boardable->members()->where('user_id', $user->id)->first();
            return $member && $member->pivot->role === 'admin';
        } elseif ($boardable instanceof Project) {
            // Only the project owner can update boards
            return $user->id === $boardable->owner_id;
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the board.
     */
    public function delete(User $user, Board $board): bool
    {
        // Load the boardable relationship
        $board->load('boardable');
        $boardable = $board->boardable;
        
        if (!$boardable) {
            return false;
        }
        
        // Check based on parent entity type
        if ($boardable instanceof Workspace) {
            // User can delete a board if they are an admin of its parent workspace
            $member = $boardable->members()->where('user_id', $user->id)->first();
            return $member && $member->pivot->role === 'admin';
        } elseif ($boardable instanceof Project) {
            // User can delete a board if they are the project owner or an admin
            if ($user->id === $boardable->owner_id) {
                return true;
            }
            
            $member = $boardable->members()->where('user_id', $user->id)->first();
            return $member && $member->pivot->role === 'admin';
        }
        
        return false;
    }
} 