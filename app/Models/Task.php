<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Task extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'board_list_id',
        'creator_id',
        'title',
        'description',
        'due_date',
        'order',
        'priority',
        'completed_at',
        'external_event_id',
        'external_provider',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'due_date' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['list_id'];

    /**
     * Get the list_id attribute (accessor for board_list_id).
     * This allows the frontend to use list_id consistently.
     */
    public function getListIdAttribute()
    {
        return $this->board_list_id;
    }

    /**
     * Get the list that owns the task.
     */
    public function list(): BelongsTo
    {
        return $this->belongsTo(BoardList::class, 'board_list_id');
    }

    /**
     * Get the creator of the task.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    /**
     * Get the assignees for the task.
     */
    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_assignees')->withTimestamps();
    }

    /**
     * Get the comments for the task.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class)->latest();
    }

    /**
     * Get the attachments for the task.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(TaskAttachment::class)->latest();
    }

    /**
     * Get the paper writing task associated with this task.
     */
    public function paperWritingTask(): HasOne
    {
        return $this->hasOne(PaperWritingTask::class);
    }

    /**
     * Check if this task has an external calendar event
     */
    public function hasExternalEvent(): bool
    {
        return !is_null($this->external_event_id) && !is_null($this->external_provider);
    }

    /**
     * Check if this task has a Google Calendar event
     */
    public function hasGoogleCalendarEvent(): bool
    {
        return $this->external_provider === 'google' && !is_null($this->external_event_id);
    }

    /**
     * Get the board this task belongs to through the list
     */
    public function getBoardAttribute()
    {
        return $this->list?->board;
    }

    /**
     * Get the workspace this task belongs to (if the board belongs to a workspace)
     */
    public function getWorkspaceAttribute()
    {
        $board = $this->getBoardAttribute();
        return $board && $board->boardable_type === 'App\\Models\\Workspace' ? $board->boardable : null;
    }
} 