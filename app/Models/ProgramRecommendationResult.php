<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramRecommendationResult extends Model
{
    protected $table = 'program_recommendation_results';

    protected $fillable = [
        'user_id',
        'phd_program_id',
        'match_score',
        'justification',
    ];

    public function phdProgram(): BelongsTo
    {
        return $this->belongsTo(PhDProgram::class);
    }
}

