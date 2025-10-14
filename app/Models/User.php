<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Silber\Bouncer\Database\HasRolesAndAbilities;
use App\Models\Academician;
use App\Models\Industry;
use App\Models\Postgraduate;
use App\Models\PostGrant;
use App\Models\PostScholarship;
use App\Models\PostProject;
use App\Models\PostEvent;
use App\Models\Undergraduate;
use App\Models\CreatePost;
use App\Models\Bookmark;
use App\Models\UserMotivation;
use App\Models\Connection;
use App\Models\ConnectionTag;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;
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
        'agreed_to_terms',
        'has_seen_tutorial',
        'email_verified_at',
        'last_seen_at',
        'google_access_token',
        'google_refresh_token',
        'google_token_expires_at',
        'google_calendar_enabled',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google_access_token',
        'google_refresh_token',
    ];

    /**
     * The attributes that should be appended to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = ['connection_status_with_auth_user', 'full_name', 'collaborator_count', 'is_online'];

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
            'agreed_to_terms' => 'boolean',
            'last_seen_at' => 'datetime',
            'google_token_expires_at' => 'datetime',
            'google_calendar_enabled' => 'boolean',
        ];
    }

    /**
     * Get the user's full name by checking their role-specific profile.
     *
     * @return string
     */
    public function getFullNameAttribute(): string
    {
        // This ensures relationships are loaded efficiently if they haven't been already
        $this->loadMissing(['academician', 'postgraduate', 'undergraduate']);

        return $this->academician->full_name
               ?? $this->postgraduate->full_name
               ?? $this->undergraduate->full_name
               ?? $this->name
               ?? '';
    }

    public function getAvatarUrlAttribute(): ?string
    {
        $this->loadMissing(['academician', 'postgraduate', 'undergraduate']);

        $path = $this->academician->profile_picture
            ?? $this->postgraduate->profile_picture
            ?? $this->undergraduate->profile_picture
            ?? null;

        if (!$path) {
            return null;
        }

        // Adjust disk if your profile photos are stored elsewhere
        $disk = config('filesystems.default', 'public');

        try {
            return asset('storage/' . $path);
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Backward-compat alias for callers expecting 'profile_photo_url'.
     */
    public function getProfilePhotoUrlAttribute(): ?string
    {
        return $this->avatar_url;
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

    public function postScholarships()
    {
        return $this->hasMany(PostScholarship::class, 'author_id', 'unique_id');
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

    public function likedScholarships()
    {
        return $this->belongsToMany(PostScholarship::class, 'grant_user_likes')->withTimestamps();
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

    /**
     * Get the workspaces the user is a member of.
     */
    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspace::class, 'workspace_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Get the projects the user is a member of.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_members')
            ->withPivot('role')
            ->withTimestamps();
    }
    
    /**
     * The boards that the user has access to.
     */
    public function boards(): BelongsToMany
    {
        return $this->belongsToMany(Board::class, 'board_user')->withTimestamps();
    }

    /**
     * Get all connection requests sent by the user.
     */
    public function sentRequests(): HasMany
    {
        return $this->hasMany(Connection::class, 'requester_id');
    }

    /**
     * Get all connection requests received by the user.
     */
    public function receivedRequests(): HasMany
    {
        return $this->hasMany(Connection::class, 'recipient_id');
    }

    /**
     * Get the connection status between the authenticated user and this user.
     *
     * @return array Array containing the connection status and connection ID if applicable
     */
    public function getConnectionStatusWithAuthUserAttribute()
    {
        if (!Auth::check()) {
            return [
                'status' => 'not_connected',
                'connection_id' => null
            ];
        }

        $currentUser = Auth::user();

        if ($currentUser->id === $this->id) {
            return [
                'status' => 'is_self',
                'connection_id' => null
            ];
        }

        // Check if a connection exists between the two users
        $connection = Connection::where(function ($query) use ($currentUser) {
            $query->where('requester_id', $currentUser->id)
                  ->where('recipient_id', $this->id);
        })->orWhere(function ($query) use ($currentUser) {
            $query->where('requester_id', $this->id)
                  ->where('recipient_id', $currentUser->id);
        })->first();

        if (!$connection) {
            return [
                'status' => 'not_connected',
                'connection_id' => null
            ];
        }

        if ($connection->status === 'accepted') {
            return [
                'status' => 'connected',
                'connection_id' => $connection->id
            ];
        }

        if ($connection->status === 'pending') {
            return [
                'status' => $connection->requester_id === $currentUser->id ? 'pending_sent' : 'pending_received',
                'connection_id' => $connection->id
            ];
        }

        return [
            'status' => 'not_connected',
            'connection_id' => null
        ]; // Default case
    }
    
    /**
     * Get all accepted connections (friends) of the user.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFriends()
    {
        // Get connections where this user is the requester and status is accepted
        $requestedConnections = Connection::where('requester_id', $this->id)
            ->where('status', 'accepted')
            ->with(['recipient.academician', 'recipient.postgraduate', 'recipient.undergraduate'])
            ->get()
            ->pluck('recipient');
            
        // Get connections where this user is the recipient and status is accepted
        $receivedConnections = Connection::where('recipient_id', $this->id)
            ->where('status', 'accepted')
            ->with(['requester.academician', 'requester.postgraduate', 'requester.undergraduate'])
            ->get()
            ->pluck('requester');
            
        // Merge both collections
        return $requestedConnections->merge($receivedConnections);
    }

    /**
     * Get the total number of connections tagged as 'Collaborator'.
     *
     * @return int
     */
    public function getCollaboratorCountAttribute(): int
    {
        // First, find the 'Collaborator' tag. This is cached for efficiency.
        $collaboratorTag = ConnectionTag::where('name', 'Collaborator')->where('is_default', true)->first();

        // If the tag doesn't exist for some reason, return 0.
        if (!$collaboratorTag) {
            return 0;
        }

        // Count the number of entries in the pivot table that link this user
        // and the collaborator tag to any connection.
        return DB::table('connection_tag_user')
            ->where('user_id', $this->id)
            ->where('connection_tag_id', $collaboratorTag->id)
            ->count();
    }

    /**
     * Get the connection tags assigned by this user.
     */
    public function connectionTags(): BelongsToMany
    {
        return $this->belongsToMany(ConnectionTag::class, 'connection_tag_user')
            ->withPivot('connection_id')
            ->withTimestamps();
    }

    /**
     * Get the connections that this user has tagged.
     */
    public function taggedConnections(): BelongsToMany
    {
        return $this->belongsToMany(Connection::class, 'connection_tag_user')
            ->withPivot('connection_tag_id')
            ->withTimestamps();
    }
    
    /**
     * Get the skills associated with this user.
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'profile_skills', 'unique_id', 'skill_id', 'unique_id', 'id')
            ->withTimestamps();
    }
    
    /**
     * Get the online status based on last_seen_at.
     * 
     * @return bool
     */
    public function getIsOnlineAttribute(): bool
    {
        if (!$this->last_seen_at) {
            return false;
        }
        
        // Consider online if seen in the last 5 minutes
        return $this->last_seen_at->diffInMinutes(now()) <= 5;
    }
    
    /**
     * Get conversations where the user is a participant.
     */
    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(\App\Models\Messaging\Conversation::class, 'conversation_participants')
            ->withPivot(['role', 'last_read_message_id', 'joined_at', 'left_at', 'archived_at'])
            ->whereNull('left_at')
            ->withTimestamps();
    }

    /**
     * Check if user has connected their Google Calendar.
     */
    public function hasGoogleCalendarConnected(): bool
    {
        return !empty($this->google_access_token) && $this->google_calendar_enabled;
    }

    /**
     * Check if user's Google Calendar token is expired.
     */
    public function isGoogleTokenExpired(): bool
    {
        return $this->google_token_expires_at && $this->google_token_expires_at->isPast();
    }
}
