<?php

namespace App\Services;

use App\Models\SkillsDomain;
use App\Exceptions\CannotDeleteException;

class SkillsDomainService
{
    /**
     * Create a new skills domain
     */
    public function create(array $data): SkillsDomain
    {
        return SkillsDomain::create($data);
    }
    
    /**
     * Update an existing skills domain
     */
    public function update(SkillsDomain $domain, array $data): SkillsDomain
    {
        $domain->update($data);
        return $domain;
    }
    
    /**
     * Delete a skills domain
     */
    public function delete(SkillsDomain $domain): bool
    {
        // Check if domain has related subdomains
        if ($domain->subdomains()->count() > 0) {
            throw new CannotDeleteException('Cannot delete skills domain with existing subdomains. Delete the subdomains first.');
        }
        
        return $domain->delete();
    }
}