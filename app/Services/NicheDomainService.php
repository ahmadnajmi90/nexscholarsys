<?php

namespace App\Services;

use App\Models\NicheDomain;

class NicheDomainService
{
    /**
     * Create a new niche domain
     */
    public function create(array $data): NicheDomain
    {
        return NicheDomain::create($data);
    }
    
    /**
     * Update an existing niche domain
     */
    public function update(NicheDomain $nicheDomain, array $data): NicheDomain
    {
        $nicheDomain->update($data);
        return $nicheDomain;
    }
    
    /**
     * Delete a niche domain
     */
    public function delete(NicheDomain $nicheDomain): bool
    {
        return $nicheDomain->delete();
    }
} 