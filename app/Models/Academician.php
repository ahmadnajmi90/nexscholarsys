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
        'field_of_research',
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

    protected $casts = [
        'field_of_study' => 'array', // Cast field_of_study as an array
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
