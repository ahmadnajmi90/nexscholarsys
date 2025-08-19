<?php

namespace App\Services;

use App\Models\PostgraduateProgram;

class PostgraduateProgramService
{
    /**
     * Create a new postgraduate program
     */
    public function create(array $data): PostgraduateProgram
    {
        return PostgraduateProgram::create($data);
    }
    
    /**
     * Update an existing postgraduate program
     */
    public function update(PostgraduateProgram $program, array $data): PostgraduateProgram
    {
        $program->update($data);
        return $program;
    }
    
    /**
     * Delete a postgraduate program
     */
    public function delete(PostgraduateProgram $program): bool
    {
        return $program->delete();
    }
} 