<?php

namespace App\Services;

use App\Exceptions\CannotDeleteException;
use App\Models\FieldOfResearch;

class FieldOfResearchService
{
    /**
     * Create a new field of research
     */
    public function create(array $data): FieldOfResearch
    {
        return FieldOfResearch::create($data);
    }
    
    /**
     * Update an existing field of research
     */
    public function update(FieldOfResearch $field, array $data): FieldOfResearch
    {
        $field->update($data);
        return $field;
    }
    
    /**
     * Delete a field of research
     */
    public function delete(FieldOfResearch $field): bool
    {
        // Check if field has related research areas
        if ($field->researchAreas()->count() > 0) {
            throw new CannotDeleteException('Cannot delete field of research with existing research areas. Delete the research areas first.');
        }
        
        return $field->delete();
    }
} 