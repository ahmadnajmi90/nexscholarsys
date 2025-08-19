<?php

namespace App\Services;

use App\Exceptions\CannotDeleteException;
use App\Models\ResearchArea;

class ResearchAreaService
{
    /**
     * Create a new research area
     */
    public function create(array $data): ResearchArea
    {
        return ResearchArea::create($data);
    }
    
    /**
     * Update an existing research area
     */
    public function update(ResearchArea $researchArea, array $data): ResearchArea
    {
        $researchArea->update($data);
        return $researchArea;
    }
    
    /**
     * Delete a research area
     */
    public function delete(ResearchArea $researchArea): bool
    {
        // Check if research area has related niche domains
        if ($researchArea->nicheDomains()->count() > 0) {
            throw new CannotDeleteException('Cannot delete research area with existing niche domains. Delete the niche domains first.');
        }
        
        return $researchArea->delete();
    }
} 