<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisorInsight extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'academician_id',
        'postgraduate_program_id',
        'match_score',
        'justification',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function academician()
    {
        return $this->belongsTo(Academician::class);
    }

    public function postgraduateProgram()
    {
        return $this->belongsTo(\App\Models\PostgraduateProgram::class, 'postgraduate_program_id');
    }
}

