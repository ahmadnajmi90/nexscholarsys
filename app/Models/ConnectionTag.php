<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ConnectionTag extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'is_default',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Get the users who have assigned this tag to connections.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'connection_tag_user')
            ->withPivot('connection_id')
            ->withTimestamps();
    }

    /**
     * Get the connections that have been assigned this tag.
     */
    public function connections(): BelongsToMany
    {
        return $this->belongsToMany(Connection::class, 'connection_tag_user')
            ->withPivot('user_id')
            ->withTimestamps();
    }
}