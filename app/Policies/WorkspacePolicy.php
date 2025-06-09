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
        // Only the owner can update the workspace
        return $user->id === $workspace->owner_id;
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
        // Check if the user has the admin role in this workspace
        $member = $workspace->members()->where('user_id', $user->id)->first();
        return $member && $member->pivot->role === 'admin';
    }

    /**
     * Determine whether the user can remove members from the workspace.
     */
    public function removeMember(User $user, Workspace $workspace): bool
    {
        // Check if the user has the admin role in this workspace
        $member = $workspace->members()->where('user_id', $user->id)->first();
        return $member && $member->pivot->role === 'admin';
    }
} 