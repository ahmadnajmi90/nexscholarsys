<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PostEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id',
        'event_name',
        'url',
        'description',
        'event_type',
        'event_mode',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'image',
        'event_theme',
        'registration_url',
        'registration_deadline',
        'contact_email',
        'venue',
        'city',
        'country',
        'event_status',
        'field_of_research',
        'total_views',
        'total_likes',
        'total_shares',
    ];

    protected $casts = [
        'field_of_research' => 'array', // Cast field_of_study as an array
    ];

    protected static function booted()
    {
        static::creating(function ($event) {
            if (!$event->url) {
                $slug = Str::slug($event->event_name);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->exists()) {
                    $slug = $originalSlug . $count;
                    $count++;
                }
                $event->url = $slug;
            }
        });

        static::updating(function ($event) {
            if ($event->isDirty('event_name')) {
                $slug = Str::slug($event->event_name);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->where('id', '!=', $event->id)->exists()) {
                    $slug = $originalSlug . $count;
                    $count++;
                }
                $event->url = $slug;
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
        return $this->belongsToMany(User::class, 'event_user_likes', 'event_id', 'user_id')->withTimestamps();
    }

    /**
     * Get the views for the event.
     */
    public function views()
    {
        return $this->hasMany(EventView::class, 'event_id');
    }

    /**
     * Check if a user has viewed this event in the last 24 hours.
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
     * Record a new view for this event.
     * 
     * @param int|null $userId
     * @param string|null $ipAddress
     * @return \App\Models\EventView
     */
    public function recordView($userId = null, $ipAddress = null)
    {
        // If the event has already been viewed by this user/IP in the last 24 hours, don't record a new view
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
     * Get all bookmarks for this event.
     */
    public function bookmarks()
    {
        return $this->morphMany(Bookmark::class, 'bookmarkable');
    }
}
