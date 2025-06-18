<?php

namespace App\Policies;

use App\Models\Connection;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ConnectionPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Connection $connection): bool
    {
        return $user->id === $connection->requester_id || $user->id === $connection->recipient_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can accept a connection request.
     * A user can accept a request only if they are the recipient and the status is pending.
     */
    public function accept(User $user, Connection $connection): bool
    {
        return $user->id === $connection->recipient_id && $connection->status === 'pending';
    }

    /**
     * Determine whether the user can reject a connection request.
     * A user can reject a request only if they are the recipient and the status is pending.
     */
    public function reject(User $user, Connection $connection): bool
    {
        return $user->id === $connection->recipient_id && $connection->status === 'pending';
    }

    /**
     * Determine whether the user can delete the model.
     * A user can delete a connection if they are either the requester or the recipient.
     */
    public function delete(User $user, Connection $connection): bool
    {
        return $user->id === $connection->requester_id || $user->id === $connection->recipient_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Connection $connection): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Connection $connection): bool
    {
        return false;
    }
}
