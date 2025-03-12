<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $table = 'skills';
    protected $fillable = ['name'];

    public function undergraduates()
    {
        return $this->belongsToMany(Undergraduate::class, 'skills');
    }


    public function postgraduates()
    {
        return $this->belongsToMany(Undergraduate::class, 'skills');
    }

}


