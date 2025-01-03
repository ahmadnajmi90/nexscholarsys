<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    protected $table = 'permissions'; // Reference the permissions table

    protected $fillable = ['ability_id', 'entity_id', 'entity_type', 'forbidden'];

    // Disable timestamps
    public $timestamps = false;
}

