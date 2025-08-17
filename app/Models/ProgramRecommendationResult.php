<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramRecommendationResult extends Model
{
    protected $table = 'postgraduate_program_recommendations';

    protected $fillable = [
        'user_id',
        'postgraduate_program_id',
        'match_score',
        'justification',
    ];

    public function postgraduateProgram(): BelongsTo
    {
        return $this->belongsTo(PostgraduateProgram::class, 'postgraduate_program_id');
    }
}

