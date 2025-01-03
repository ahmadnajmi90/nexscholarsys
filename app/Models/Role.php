<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $table = 'roles'; // Reference the roles table

    protected $fillable = ['name', 'title', 'scope'];

    public function abilities()
    {
        return $this->belongsToMany(Ability::class, 'permissions', 'entity_id', 'ability_id')
            ->wherePivot('entity_type', Role::class)
            ->select('abilities.id', 'abilities.name', 'abilities.title'); // Explicitly select columns from abilities
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class, 'entity_id')->where('entity_type', 'App\Models\Role');
    }

}

