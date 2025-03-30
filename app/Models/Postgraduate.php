<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

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
        'skills',
        'url'
    ];

    protected $casts = [
        'field_of_research' => 'array', // Cast field_of_study as an array
        'skills' => 'array'
    ];

    protected static function booted()
    {
        static::creating(function ($postgraduate) {
            if (!$postgraduate->url) {
                $slug = Str::slug($postgraduate->full_name);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->exists()) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $postgraduate->url = $slug;
            }
        });

        static::updating(function ($postgraduate) {
            if ($postgraduate->isDirty('full_name') || !$postgraduate->url) {
                $slug = Str::slug($postgraduate->full_name);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->where('id', '!=', $postgraduate->id)->exists()) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $postgraduate->url = $slug;
            }
        });
    }

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

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'skills' );
    }

}
