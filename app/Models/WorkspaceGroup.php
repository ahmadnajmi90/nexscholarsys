<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkspaceGroup extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'order',
    ];

    /**
     * Get the user that owns the workspace group.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the workspaces in this group for the specific user.
     */
    public function workspaces()
    {
        return Workspace::whereHas('members', function ($query) {
            $query->where('users.id', $this->user_id)
                  ->where('workspace_members.workspace_group_id', $this->id);
        })->with('owner');
    }
}

