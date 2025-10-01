<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PotentialSupervisor extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'academician_id',
        'postgraduate_program_id',
    ];

    public function student()
    {
        return $this->belongsTo(Postgraduate::class, 'student_id', 'postgraduate_id');
    }

    public function academician()
    {
        return $this->belongsTo(Academician::class, 'academician_id', 'academician_id');
    }

    public function postgraduateProgram()
    {
        return $this->belongsTo(PostgraduateProgram::class);
    }
}

