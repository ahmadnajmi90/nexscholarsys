<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PostGrant extends Model
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
        'grant_type',
        'grant_theme',
        'cycle',
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
        'grant_theme' => 'array', // Cast field_of_study as an array
    ];

    protected static function booted()
    {
        static::creating(function ($grant) {
            if (!$grant->url) {
                $slug = Str::slug($grant->title);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->exists()) {
                    $slug = $originalSlug . $count;
                    $count++;
                }
                $grant->url = $slug;
            }
        });

        static::updating(function ($grant) {
            if ($grant->isDirty('title')) {
                $slug = Str::slug($grant->title);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->where('id', '!=', $grant->id)->exists()) {
                    $slug = $originalSlug . $count;
                    $count++;
                }
                $grant->url = $slug;
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
}
