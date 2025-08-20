<?php

namespace App\Policies;

use App\Models\PostEvent;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostEventPolicy
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
    public function view(User $user, PostEvent $PostEvent): bool
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

    public function update(User $user, PostEvent $PostEvent)
    {
        return $user->unique_id === $PostEvent->author_id;
    }

    public function delete(User $user, PostEvent $PostEvent)
    {
        return $user->unique_id === $PostEvent->author_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PostEvent $PostEvent): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PostEvent $PostEvent): bool
    {
        //
    }
}
