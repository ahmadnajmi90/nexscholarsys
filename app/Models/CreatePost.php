<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CreatePost extends Model
{
    use HasFactory;

    protected $table = 'create-posts';

    protected $fillable = [
        'id',
        'author_id',
        'title',
        'url',
        'content',
        'category',
        'tags',
        'images',
        'featured_image',
        'attachment',
        'status',
        'total_views',
        'total_likes',
        'total_shares',
    ];

    protected $casts = [
        'tags' => 'array',
        'images' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($post) {
            if (!$post->url) {
                $slug = Str::slug($post->title);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->exists()) {
                    $slug = $originalSlug . $count;
                    $count++;
                }
                $post->url = $slug;
            }
        });

        static::updating(function ($post) {
            if ($post->isDirty('title')) {
                $slug = Str::slug($post->title);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->where('id', '!=', $post->id)->exists()) {
                    $slug = $originalSlug . $count;
                    $count++;
                }
                $post->url = $slug;
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

    public function postgraduate()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }

    public function undergraduate()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }

    public function industry()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }

    public function likedUsers()
    {
        return $this->belongsToMany(User::class, 'post_user_likes', 'post_id', 'user_id')->withTimestamps();
    }

}
