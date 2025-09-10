<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SkillsSubdomain extends Model
{
    protected $table = 'skills_subdomain';
    
    protected $fillable = [
        'skills_domain_id', 'name'
    ];
    
    /**
     * Get the domain that owns this subdomain.
     */
    public function domain(): BelongsTo
    {
        return $this->belongsTo(SkillsDomain::class, 'skills_domain_id');
    }
    
    /**
     * Get the skills for this subdomain.
     */
    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class)
            ->orderBy('name');
    }
}
