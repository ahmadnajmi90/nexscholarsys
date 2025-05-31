<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

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
        'CV_file',
        'field_of_study',
        'research_expertise',
        'personal_website',
        'institution_website',
        'linkedin',
        'google_scholar',
        'researchgate',
        'bio',
        'verified',
        'availability_for_collaboration',
        'availability_as_supervisor',
        'style_of_supervision',
        'background_image',
        'url',
    ];

    protected $casts = [
        'research_expertise' => 'array', // Cast research_expertise as an array
        'style_of_supervision' => 'array', // Cast style_of_supervision as an array
        'embedding_vector' => 'array', // Cast embedding_vector as an array
    ];

    protected static function booted()
    {
        static::creating(function ($academician) {
            if (!$academician->url) {
                $slug = Str::slug($academician->full_name);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->exists()) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $academician->url = $slug;
            }
        });

        static::updating(function ($academician) {
            if ($academician->isDirty('full_name') || !$academician->url) {
                $slug = Str::slug($academician->full_name);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->where('id', '!=', $academician->id)->exists()) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $academician->url = $slug;
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'academician_id', 'unique_id');
    }

    public function facultyAdmin()
    {
        return $this->belongsTo(FacultyAdmin::class, 'faculty_id', 'faculty');
    }

    public function universityDetails()
    {
        return $this->belongsTo(UniversityList::class, 'university', 'id');
    }

    public function faculty()
    {
        return $this->belongsTo(FacultyList::class, 'faculty', 'id');
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
        
        // Check if research expertise is not null and not empty
        $hasResearchExpertise = !empty($this->research_expertise);
        
        // Return 'Complete' if all criteria are met, otherwise 'Needs Update'
        return ($hasBio && $hasCustomProfilePicture && $hasResearchExpertise) ? 'Complete' : 'Needs Update';
    }
    
    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['profile_status'];

    /**
     * Get the views for the academician.
     */
    public function views()
    {
        return $this->hasMany(AcademicianView::class, 'academician_id');
    }

    /**
     * Check if this academician has been viewed by a user or IP address in the last 24 hours.
     * 
     * @param int|null $userId
     * @param string|null $ipAddress
     * @return bool
     */
    public function hasBeenViewedBy($userId = null, $ipAddress = null)
    {
        $query = $this->views();
        
        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($ipAddress) {
            $query->where('ip_address', $ipAddress);
        } else {
            return false;
        }
        
        return $query->where('created_at', '>=', now()->subHours(24))->exists();
    }

    /**
     * Record a new view for this academician.
     * 
     * @param int|null $userId
     * @param string|null $ipAddress
     * @return \App\Models\AcademicianView|null
     */
    public function recordView($userId = null, $ipAddress = null)
    {
        // If the academician has already been viewed by this user/IP in the last 24 hours, don't record a new view
        if ($this->hasBeenViewedBy($userId, $ipAddress)) {
            return null;
        }
        
        // Record the view
        $view = $this->views()->create([
            'user_id' => $userId,
            'ip_address' => $ipAddress,
        ]);
        
        // Increment the total_views count
        $this->increment('total_views');
        
        return $view;
    }
    
    /**
     * Get the publications of the academician.
     */
    public function publications()
    {
        return $this->hasMany(Publication::class, 'academician_id', 'academician_id');
    }
    
    /**
     * Get the scholar profile of the academician.
     */
    public function scholarProfile()
    {
        return $this->hasOne(ScholarProfile::class, 'academician_id', 'academician_id');
    }
    
    /**
     * Get the scraping logs of the academician.
     */
    public function scrapingLogs()
    {
        return $this->hasMany(ScrapingLog::class, 'academician_id', 'academician_id');
    }
    
    /**
     * Get the recommendations for the academician.
     */
    public function recommendations()
    {
        return $this->hasMany(AcademicianRecommendation::class, 'academician_id', 'academician_id');
    }
    
    /**
     * Get average recommendation ratings for the academician.
     */
    public function getRecommendationRatings()
    {
        return AcademicianRecommendation::getAverageRatings($this->academician_id);
    }
    
    /**
     * Get all bookmarks for this academician.
     */
    public function bookmarks()
    {
        return $this->morphMany(Bookmark::class, 'bookmarkable');
    }
}
