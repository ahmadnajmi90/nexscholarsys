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
        'skills' => 'array',
        'supervisorAvailability' => 'boolean', // Cast to boolean
        'grantAvailability' => 'boolean' // Cast to boolean
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

    /**
     * Get the profile status attribute.
     * 
     * @return string
     */
    public function getProfileStatusAttribute()
    {
        // Check if bio is not null and not empty
        $hasBio = !empty($this->bio);
        
        // Check if profile picture is not null and not the default
        $hasCustomProfilePicture = !empty($this->profile_picture) && $this->profile_picture !== 'profile_pictures/default.jpg';
        
        // Check if field of research is not null and not empty
        $hasFieldOfResearch = !empty($this->field_of_research);
        
        // Return 'Complete' if all criteria are met, otherwise 'Needs Update'
        return ($hasBio && $hasCustomProfilePicture && $hasFieldOfResearch) ? 'Complete' : 'Needs Update';
    }
    
    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['profile_status'];

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'skills' );
    }

    /**
     * Get all bookmarks for this postgraduate.
     */
    public function bookmarks()
    {
        return $this->morphMany(Bookmark::class, 'bookmarkable');
    }
}
