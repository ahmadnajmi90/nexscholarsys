<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Board extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'boardable_id',
        'boardable_type',
        'name',
    ];

    /**
     * Get the parent model (workspace or project) that owns the board.
     */
    public function boardable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the lists for the board.
     */
    public function lists(): HasMany
    {
        return $this->hasMany(BoardList::class)->orderBy('order');
    }
    
    /**
     * The users that have access to this board.
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'board_user')->withTimestamps();
    }
} 