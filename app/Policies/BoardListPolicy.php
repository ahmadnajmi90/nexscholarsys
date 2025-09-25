<?php

namespace App\Policies;

use App\Models\Board;
use App\Models\BoardList;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BoardListPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create a list in the board.
     */
    public function create(User $user, Board $board): bool
    {
        // User can create a list if they can view the board
        return $user->can('view', $board);
    }

    /**
     * Determine whether the user can update the list.
     */
    public function update(User $user, BoardList $boardList): bool
    {
        // A user can update a list if they have permission to update the parent board.
        // This correctly delegates the permission check to the BoardPolicy.
        return $user->can('update', $boardList->board);
    }

    /**
     * Determine whether the user can delete the list.
     */
    public function delete(User $user, BoardList $boardList): bool
    {
        // A user can delete a list if they have permission to update the parent board.
        // This keeps the permissions consistent for update and delete actions.
        return $user->can('update', $boardList->board);
    }
} 