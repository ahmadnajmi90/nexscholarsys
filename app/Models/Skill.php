<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skill extends Model
{
    protected $fillable = [
        'skills_subdomain_id', 'name', 'description'
    ];
    
    /**
     * Get the subdomain that owns this skill.
     */
    public function subdomain(): BelongsTo
    {
        return $this->belongsTo(SkillsSubdomain::class, 'skills_subdomain_id');
    }
    
    /**
     * Get the domain through subdomain.
     */
    public function domain(): BelongsTo
    {
        return $this->subdomain()->getRelated()->domain();
    }
    
    /**
     * Get users who have this skill.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'profile_skills', 'skill_id', 'unique_id', 'id', 'unique_id')
            ->withTimestamps();
    }
    
    /**
     * Get the full hierarchical name of the skill.
     */
    public function getFullNameAttribute(): string
    {
        if ($this->relationLoaded('subdomain') && $this->subdomain && 
            $this->subdomain->relationLoaded('domain') && $this->subdomain->domain) {
            return $this->subdomain->domain->name . ' → ' . $this->subdomain->name . ' → ' . $this->name;
        }
        
        // Fallback: load relationships if not already loaded
        $this->load('subdomain.domain');
        if ($this->subdomain && $this->subdomain->domain) {
            return $this->subdomain->domain->name . ' → ' . $this->subdomain->name . ' → ' . $this->name;
        }
        
        return $this->name;
    }
}


