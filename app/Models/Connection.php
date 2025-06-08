<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Connection extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'type',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who initiated the connection.
     */
    public function userOne(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    /**
     * Get the user who received the connection.
     */
    public function userTwo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    /**
     * Scope a query to only include connections of a specific type.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query to only include connections with a specific status.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $status
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to include connections where the given user is either user_one or user_two.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInvolvingUser($query, $userId)
    {
        return $query->where(function ($query) use ($userId) {
            $query->where('user_one_id', $userId)
                  ->orWhere('user_two_id', $userId);
        });
    }

    /**
     * Scope a query to include connections where the given user is user_one (the initiator).
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInitiatedBy($query, $userId)
    {
        return $query->where('user_one_id', $userId);
    }

    /**
     * Scope a query to include connections where the given user is user_two (the recipient).
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeReceivedBy($query, $userId)
    {
        return $query->where('user_two_id', $userId);
    }

    /**
     * Check if the connection is mutual (bidirectional) for friendship.
     *
     * @return bool
     */
    public function isMutual(): bool
    {
        if ($this->type !== 'friendship') {
            return false;
        }

        return $this->status === 'accepted';
    }
} 