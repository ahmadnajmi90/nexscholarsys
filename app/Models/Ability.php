<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ability extends Model
{
    protected $table = 'abilities'; // Reference the abilities table

    protected $fillable = ['name', 'title'];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'permissions', 'ability_id', 'entity_id')
            ->wherePivot('entity_type', Role::class);
    }
}

