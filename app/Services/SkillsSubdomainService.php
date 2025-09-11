<?php

namespace App\Services;

use App\Models\SkillsSubdomain;
use App\Exceptions\CannotDeleteException;

class SkillsSubdomainService
{
    /**
     * Create a new skills subdomain
     */
    public function create(array $data): SkillsSubdomain
    {
        return SkillsSubdomain::create($data);
    }
    
    /**
     * Update an existing skills subdomain
     */
    public function update(SkillsSubdomain $subdomain, array $data): SkillsSubdomain
    {
        $subdomain->update($data);
        return $subdomain;
    }
    
    /**
     * Delete a skills subdomain
     */
    public function delete(SkillsSubdomain $subdomain): bool
    {
        // Check if subdomain has related skills
        if ($subdomain->skills()->count() > 0) {
            throw new CannotDeleteException('Cannot delete skills subdomain with existing skills. Delete the skills first.');
        }
        
        return $subdomain->delete();
    }
}