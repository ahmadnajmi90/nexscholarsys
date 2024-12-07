<?php

namespace App\Models;

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
        'faculty',
        'highest_degree',
        'field_of_study',
        'research_expertise',
        'website',
        'linkedin',
        'google_scholar',
        'researchgate',
        'bio',
        'verified',
        'availability_for_collaboration',
        'availability_as_supervisor',
    ];

    protected $casts = [
        'research_expertise' => 'array', // Cast research_expertise as an array
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'academician_id', 'unique_id');
    }

    public function universityDetails()
    {
        return $this->belongsTo(UniversityList::class, 'university', 'id');
    }

    public function faculty()
    {
        return $this->belongsTo(FacultyList::class, 'faculty');
    }
}
