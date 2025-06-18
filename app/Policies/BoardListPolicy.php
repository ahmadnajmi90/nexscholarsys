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
        // User can update a list if they can view the parent board
        return $user->can('view', $boardList->board);
    }

    /**
     * Determine whether the user can delete the list.
     */
    public function delete(User $user, BoardList $boardList): bool
    {
        // User can delete a list if they can view the parent board
        return $user->can('view', $boardList->board);
    }
} 