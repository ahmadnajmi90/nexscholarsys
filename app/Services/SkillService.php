<?php

namespace App\Services;

use App\Models\Skill;
use App\Exceptions\CannotDeleteException;

class SkillService
{
    /**
     * Create a new skill
     */
    public function create(array $data): Skill
    {
        return Skill::create($data);
    }
    
    /**
     * Update an existing skill
     */
    public function update(Skill $skill, array $data): Skill
    {
        $skill->update($data);
        return $skill;
    }
    
    /**
     * Delete a skill
     */
    public function delete(Skill $skill): bool
    {
        // Check if skill is being used by users through profile_skills pivot table
        if ($skill->users()->count() > 0) {
            throw new CannotDeleteException('Cannot delete skill that is assigned to users. Remove the skill from user profiles first.');
        }
        
        return $skill->delete();
    }
}