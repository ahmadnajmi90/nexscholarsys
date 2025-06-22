<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // Allow users to view the projects index
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id || $project->members->contains($user);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->academician()->exists();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id;
    }

    /**
     * Determine whether the user can add a member to the project.
     */
    public function addMember(User $user, Project $project): bool
    {
        return $user->id === $project->owner_id; // Only the owner can add members
    }

    /**
     * Determine whether the user can remove a member from the project.
     * 
     * @param User $user The authenticated user
     * @param Project $project The project
     * @param User $memberToRemove The user to be removed
     * @return bool
     */
    public function removeMember(User $user, Project $project, User $memberToRemove): bool
    {
        // Only the owner can remove members, and they cannot remove themselves
        return $user->id === $project->owner_id && $user->id !== $memberToRemove->id;
    }
}
