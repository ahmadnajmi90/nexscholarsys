<?php

namespace App\Services;

use App\Exceptions\CannotDeleteException;
use App\Models\FacultyList;

class FacultyService
{
    /**
     * Create a new faculty
     */
    public function create(array $data): FacultyList
    {
        return FacultyList::create($data);
    }
    
    /**
     * Update an existing faculty
     */
    public function update(FacultyList $faculty, array $data): FacultyList
    {
        $faculty->update($data);
        return $faculty;
    }
    
    /**
     * Delete a faculty
     */
    public function delete(FacultyList $faculty): bool
    {
        // Check if faculty has related users
        if ($faculty->academicians()->count() > 0 || 
            $faculty->postgraduates()->count() > 0 || 
            $faculty->undergraduates()->count() > 0) {
            throw new CannotDeleteException('Cannot delete faculty with existing users. Reassign users first.');
        }
        
        return $faculty->delete();
    }
} 