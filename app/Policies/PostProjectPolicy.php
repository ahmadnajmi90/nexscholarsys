<?php

namespace App\Policies;

use App\Models\PostProject;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostGrantPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PostProject $PostProject): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     */
    use HandlesAuthorization;

    public function update(User $user, PostProject $PostProject)
    {
        return $user->unique_id === $PostProject->author_id;
    }

    public function delete(User $user, PostProject $PostProject)
    {
        return $user->unique_id === $PostProject->author_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PostProject $PostProject): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PostProject $PostProject): bool
    {
        //
    }
}
