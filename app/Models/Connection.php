<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\ConnectionTag;

class Connection extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'requester_id',
        'recipient_id',
        'status',
    ];

    /**
     * Get the user who sent the connection request.
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    /**
     * Get the user who received the connection request.
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    /**
     * Get the tags assigned to this connection.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(ConnectionTag::class, 'connection_tag_user')
            ->withPivot('user_id')
            ->withTimestamps();
    }

    /**
     * Get the users who have tagged this connection.
     */
    public function taggedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'connection_tag_user')
            ->withPivot('connection_tag_id')
            ->withTimestamps();
    }
}
