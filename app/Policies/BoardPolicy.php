<?php

namespace App\Policies;

use App\Models\Board;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\HandlesAuthorization;

class BoardPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a board in the workspace.
     */
    public function create(User $user, Workspace $workspace): bool
    {
        // User can create a board if they are a member of the workspace
        return $workspace->members->contains($user);
    }

    /**
     * Determine whether the user can view the board.
     */
    public function view(User $user, Board $board): bool
    {
        // User can view a board if they can view its parent workspace
        return $user->can('view', $board->workspace);
    }

    /**
     * Determine whether the user can update the board.
     */
    public function update(User $user, Board $board): bool
    {
        // User can update a board if they are an admin of its parent workspace
        $member = $board->workspace->members()->where('user_id', $user->id)->first();
        return $member && $member->pivot->role === 'admin';
    }

    /**
     * Determine whether the user can delete the board.
     */
    public function delete(User $user, Board $board): bool
    {
        // User can delete a board if they are an admin of its parent workspace
        $member = $board->workspace->members()->where('user_id', $user->id)->first();
        return $member && $member->pivot->role === 'admin';
    }
} 