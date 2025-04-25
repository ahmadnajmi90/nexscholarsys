<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PostProject extends Model
{
    use HasFactory;

    protected $table = 'post_projects'; // Replace with your actual table name

    protected $fillable = [
        'author_id',
        'title',
        'url',
        'description',
        'project_theme',
        'purpose',
        'start_date',
        'end_date',
        'application_deadline',
        'duration',
        'sponsored_by',
        'category',
        'field_of_research',
        'supervisor_category',
        'supervisor_name',
        'university',
        'email',
        'origin_country',
        'student_nationality',
        'student_level',
        'student_mode_study',
        'appointment_type',
        'purpose_of_collaboration',
        'image',
        'attachment',
        'application_url',
        'amount',
        'project_status',
        'total_views',
        'total_likes',
        'total_shares',
    ];

    protected $casts = [
        'field_of_research' => 'array', // Cast field_of_study as an array
        'purpose' => 'array', // Cast field_of_study as an array
        'student_level' => 'array',
        'student_mode_study' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($project) {
            if (!$project->url) {
                $slug = Str::slug($project->title);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->exists()) {
                    $slug = $originalSlug . $count;
                    $count++;
                }
                $project->url = $slug;
            }
        });

        static::updating(function ($project) {
            if ($project->isDirty('title')) {
                $slug = Str::slug($project->title);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->where('id', '!=', $project->id)->exists()) {
                    $slug = $originalSlug . $count;
                    $count++;
                }
                $project->url = $slug;
            }
        });
    }

    public function academician()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }

    public function likedUsers()
    {
        return $this->belongsToMany(User::class, 'project_user_likes', 'project_id', 'user_id')->withTimestamps();
    }

    /**
     * Get the views for the project.
     */
    public function views()
    {
        return $this->hasMany(ProjectView::class, 'project_id');
    }

    /**
     * Check if a user has viewed this project in the last 24 hours.
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
     * Record a new view for this project.
     * 
     * @param int|null $userId
     * @param string|null $ipAddress
     * @return \App\Models\ProjectView
     */
    public function recordView($userId = null, $ipAddress = null)
    {
        // If the project has already been viewed by this user/IP in the last 24 hours, don't record a new view
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
     * Get all bookmarks for this project.
     */
    public function bookmarks()
    {
        return $this->morphMany(Bookmark::class, 'bookmarkable');
    }
}

