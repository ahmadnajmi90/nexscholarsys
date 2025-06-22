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
} 