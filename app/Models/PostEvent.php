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
}
