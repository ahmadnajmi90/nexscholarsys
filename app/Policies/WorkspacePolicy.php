<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Auth\Access\HandlesAuthorization;

class WorkspacePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the workspace.
     */
    public function view(User $user, Workspace $workspace): bool
    {
        // User can view the workspace if they are a member
        return $workspace->members->contains($user);
    }

    /**
     * Determine whether the user can update the workspace.
     */
    public function update(User $user, Workspace $workspace): bool
    {
        // Get the member record for the user in this workspace
        $member = $workspace->members()->where('user_id', $user->id)->first();

        // Allow update if the user is the owner OR has an 'admin' role
        return $user->id === $workspace->owner_id || ($member && $member->pivot->role === 'admin');
    }

    /**
     * Determine whether the user can delete the workspace.
     */
    public function delete(User $user, Workspace $workspace): bool
    {
        // Only the owner can delete the workspace
        return $user->id === $workspace->owner_id;
    }

    /**
     * Determine whether the user can add members to the workspace.
     */
    public function addMember(User $user, Workspace $workspace): bool
    {
        // Only the owner can add members to the workspace
        return $user->id === $workspace->owner_id;
    }

    /**
     * Determine whether the user can remove members from the workspace.
     * 
     * @param User $user The authenticated user
     * @param Workspace $workspace The workspace
     * @param User $memberToRemove The user to be removed
     * @return bool
     */
    public function removeMember(User $user, Workspace $workspace, User $memberToRemove): bool
    {
        // Only the owner can remove members, and they cannot remove themselves
        return $user->id === $workspace->owner_id && $user->id !== $memberToRemove->id;
    }
} 