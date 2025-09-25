<?php

namespace App\Policies;

use App\Models\Board;
use App\Models\User;
use App\Models\Workspace;
use App\Models\Project;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Access\HandlesAuthorization;

class BoardPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a board within the given parent entity.
     *
     * @param  \App\Models\User  $user
     * @param  \Illuminate\Database\Eloquent\Model  $parent
     * @return bool
     */
    public function create(User $user, Model $parent): bool
    {
        // Rule 1: The owner can always create a board
        if ($user->id === $parent->owner_id) {
            return true;
        }

        // Rule 2: An 'admin' can also create a board
        // First, check if the user is a member at all
        $member = $parent->members()->where('user_id', $user->id)->first();

        // Return true only if they are a member AND their role is 'admin'
        return $member && $member->pivot->role === 'admin';
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
        
        // The owner of the parent entity (Workspace or Project) can always update
        if ($user->id === $boardable->owner_id) {
            return true;
        }
        
        // Check based on parent entity type for admin role
        if ($boardable instanceof Workspace || $boardable instanceof Project) {
            // User can update a board if they are an admin of its parent
            $member = $boardable->members()->where('user_id', $user->id)->first();
            return $member && $member->pivot->role === 'admin';
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