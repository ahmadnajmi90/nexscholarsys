<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class SkillsDomain extends Model
{
    protected $table = 'skills_domain';
    
    protected $fillable = [
        'name'
    ];
    
    /**
     * Get the subdomains for this domain.
     */
    public function subdomains(): HasMany
    {
        return $this->hasMany(SkillsSubdomain::class)
            ->orderBy('name');
    }
    
    /**
     * Get all skills through subdomains.
     */
    public function skills(): HasManyThrough
    {
        return $this->hasManyThrough(Skill::class, SkillsSubdomain::class)
            ->orderBy('skills.name');
    }
}
