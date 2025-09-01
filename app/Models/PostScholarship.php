<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PostScholarship extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id',
        'title',
        'url',
        'description',
        'start_date',
        'end_date',
        'application_deadline',
        'scholarship_type',
        'scholarship_theme',
        'sponsored_by',
        'email',
        'website',
        'country',
        'image',
        'attachment',
        'status',
        'total_views',
        'total_likes',
        'total_shares',
    ];

    protected $casts = [
        'scholarship_theme' => 'array', // Cast scholarship_theme as an array
    ];

    protected static function booted()
    {
        static::creating(function ($scholarship) {
            if (!$scholarship->url) {
                $slug = Str::slug($scholarship->title);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->exists()) {
                    $slug = $originalSlug . $count;
                    $count++;
                }
                $scholarship->url = $slug;
            }
        });

        static::updating(function ($scholarship) {
            if ($scholarship->isDirty('title')) {
                $slug = Str::slug($scholarship->title);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->where('id', '!=', $scholarship->id)->exists()) {
                    $slug = $originalSlug . $count;
                    $count++;
                }
                $scholarship->url = $slug;
            }
        });
    }


    /**
     * Define the relationship to the User model (Academician).
     */
    public function academician()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }

    public function likedUsers()
    {
        return $this->belongsToMany(User::class, 'grant_user_likes', 'grant_id', 'user_id')->withTimestamps();
    }

    /**
     * Get the views for the scholarship.
     */
    public function views()
    {
        return $this->hasMany(GrantView::class, 'grant_id');
    }

    /**
     * Check if a user has viewed this scholarship in the last 24 hours.
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
     * Record a new view for this scholarship.
     *
     * @param int|null $userId
     * @param string|null $ipAddress
     * @return \App\Models\GrantView
     */
    public function recordView($userId = null, $ipAddress = null)
    {
        // If the scholarship has already been viewed by this user/IP in the last 24 hours, don't record a new view
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
     * Get all bookmarks for this scholarship.
     */
    public function bookmarks()
    {
        return $this->morphMany(Bookmark::class, 'bookmarkable');
    }
}
