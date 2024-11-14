<?php

namespace App\Models;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Academician extends Model
{
    use HasFactory;
    
    protected $table = 'academicians';
    protected $fillable = [
        'academician_id',
        'phone_number',
        'full_name',
        'profile_picture',
        'current_position',
        'department',
        'university',
        'highest_degree',
        'field_of_study',
        'research_interests',
        'ongoing_research',
        'website',
        'linkedin',
        'google_scholar',
        'researchgate',
        'orcid',
        'bio',
        'verified',
        'availability_for_collaboration',
        'availability_as_supervisor',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'academician_id', 'unique_id');
    }
}
