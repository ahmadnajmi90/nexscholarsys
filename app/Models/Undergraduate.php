<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Undergraduate extends Model
{
    use HasFactory;
    protected $table = 'undergraduates';

    protected $fillable = [
        'undergraduate_id',
        'full_name',
        'phone_number',
        'bio',
        'bachelor',
        'CGPA_bachelor',
        'nationality',
        'english_proficiency_level',
        'current_undergraduate_status',
        'university',
        'faculty',
        'matric_no',
        'skills',
        'interested_do_research',
        'expected_graduate',
        'research_preference',
        'CV_file',
        'profile_picture',
        'background_image',
        'website',
        'linkedin',
        'google_scholar',
        'researchgate',
        'url'
    ];

    protected $casts = [
        'research_preference' => 'array', // Cast field_of_study as an array
        'skills' => 'array',
        'interested_do_research' => 'boolean'
    ];

    protected static function booted()
    {
        static::creating(function ($undergraduate) {
            if (!$undergraduate->url) {
                $slug = Str::slug($undergraduate->full_name);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->exists()) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $undergraduate->url = $slug;
            }
        });

        static::updating(function ($undergraduate) {
            if ($undergraduate->isDirty('full_name') || !$undergraduate->url) {
                $slug = Str::slug($undergraduate->full_name);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->where('id', '!=', $undergraduate->id)->exists()) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $undergraduate->url = $slug;
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'undergraduate_id', 'unique_id');
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
        
        // For undergraduates, only bio and profile picture are required for complete status
        return ($hasBio && $hasCustomProfilePicture) ? 'Complete' : 'Needs Update';
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
     * Get all bookmarks for this undergraduate.
     */
    public function bookmarks()
    {
        return $this->morphMany(Bookmark::class, 'bookmarkable');
    }
    
    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'url';
    }
}
