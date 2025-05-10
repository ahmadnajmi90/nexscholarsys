<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Silber\Bouncer\Database\HasRolesAndAbilities;
use App\Models\Academician;
use App\Models\Industry;
use App\Models\Postgraduate;
use App\Models\PostGrant;
use App\Models\PostProject;
use App\Models\PostEvent;
use App\Models\Undergraduate;
use App\Models\CreatePost;
use App\Models\Bookmark;
use App\Models\UserMotivation;


class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasRolesAndAbilities;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'unique_id',
        'is_profile_complete',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function academician()
    {
        return $this->hasOne(Academician::class, 'academician_id', 'unique_id');
    }

    public function industry()
    {
        return $this->hasOne(Industry::class, 'industry_id', 'unique_id');
    }

    public function postgraduate()
    {
        return $this->hasOne(Postgraduate::class, 'postgraduate_id', 'unique_id');
    }

    public function undergraduate()
    {
        return $this->hasOne(Undergraduate::class, 'undergraduate_id', 'unique_id');
    }

    public function facultyAdmin()
    {
        return $this->hasOne(FacultyAdmin::class, 'faculty_admin_id', 'unique_id');
    }

    public function postGrants()
    {
        return $this->hasMany(PostGrant::class, 'author_id', 'unique_id');
    }

    public function postProjects()
    {
        return $this->hasMany(PostProject::class, 'author_id', 'unique_id');
    }

    public function postEvents()
    {
        return $this->hasMany(PostEvent::class, 'author_id', 'unique_id');
    }

    public function createPosts()
    {
        return $this->hasMany(CreatePost::class, 'author_id', 'unique_id');
    }

    public function likedPosts()
    {
        return $this->belongsToMany(CreatePost::class, 'post_user_likes')->withTimestamps();
    }

    public function likedEvents()
    {
        return $this->belongsToMany(PostEvent::class, 'event_user_likes')->withTimestamps();
    }
    
    public function likedGrants()
    {
        return $this->belongsToMany(PostGrant::class, 'grant_user_likes')->withTimestamps();
    }
    
    public function likedProjects()
    {
        return $this->belongsToMany(PostProject::class, 'project_user_likes')->withTimestamps();
    }

    /**
     * Get all bookmarks belonging to the user.
     */
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    /**
     * Get the user's motivation.
     */
    public function motivation()
    {
        return $this->hasOne(UserMotivation::class);
    }
}
