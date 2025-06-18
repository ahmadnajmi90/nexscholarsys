<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use App\Models\BoardList;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create tasks in a given list.
     */
    public function create(User $user, BoardList $list): bool
    {
        // Get the parent of the board (which can be a Workspace or a Project)
        $boardable = $list->board->boardable;

        // If for some reason the parent doesn't exist, deny.
        if (!$boardable) {
            return false;
        }

        // A user can create a task if they are allowed to view the parent entity.
        // Laravel's Gate will automatically use the correct Policy (WorkspacePolicy or ProjectPolicy)
        // based on the model type of $boardable.
        return $user->can('view', $boardable);
    }

    /**
     * Determine whether the user can view the task.
     */
    public function view(User $user, Task $task): bool
    {
        // User can view a task if they can view its parent board
        return $user->can('view', $task->list->board);
    }

    /**
     * Determine whether the user can update the task.
     */
    public function update(User $user, Task $task): bool
    {
        // Any member of the parent entity can update a task
        return $user->can('view', $task->list->board);
    }

    /**
     * Determine whether the user can delete the task.
     */
    public function delete(User $user, Task $task): bool
    {
        // Any member of the parent entity can delete a task
        return $user->can('view', $task->list->board);
    }

    /**
     * Determine whether the user can add a comment to the task.
     */
    public function addComment(User $user, Task $task): bool
    {
        // Any member of the parent entity can add a comment
        return $user->can('view', $task->list->board);
    }
} 