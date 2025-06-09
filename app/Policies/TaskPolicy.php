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
     * Determine whether the user can create a task in the given list.
     */
    public function create(User $user, BoardList $list): bool
    {
        // User can create a task if they are a member of the list's board's workspace
        return $list->board->workspace->members->contains($user);
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
        // Any member of the workspace can update a task
        return $user->can('view', $task->list->board);
    }

    /**
     * Determine whether the user can delete the task.
     */
    public function delete(User $user, Task $task): bool
    {
        // Any member of the workspace can delete a task
        return $user->can('view', $task->list->board);
    }

    /**
     * Determine whether the user can add a comment to the task.
     */
    public function addComment(User $user, Task $task): bool
    {
        // Any member of the workspace can add a comment
        return $user->can('view', $task->list->board);
    }
} 