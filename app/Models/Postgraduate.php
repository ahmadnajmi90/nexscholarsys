<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Postgraduate extends Model
{
    use HasFactory;
    protected $table = 'postgraduates';

    protected $fillable = [
        'postgraduate_id',
        'phone_number',
        'full_name',
        'previous_degree',
        'bachelor',
        'CGPA_bachelor',
        'master',
        'master_type',
        'profile_picture',
        'nationality',
        'university',
        'faculty',
        'english_proficiency_level',
        'matric_no',
        'suggested_research_title',
        'suggested_research_description',
        'field_of_research',
        'CV_file',
        'supervisorAvailability',
        'grantAvailability',
        'website',
        'linkedin',
        'google_scholar',
        'researchgate',
        'bio',
        'funding_requirement',
        'current_postgraduate_status',
        'background_image',
        'skills'
    ];

    protected $casts = [
        'field_of_research' => 'array', // Cast field_of_study as an array
        'skills' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'postgraduate_id', 'unique_id');
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
