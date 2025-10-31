<?php

namespace App\Events;

use App\Models\Board;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BoardMemberAdded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $board;
    public $member;
    public $addedBy;

    public function __construct(Board $board, User $member, User $addedBy)
    {
        $this->board = $board;
        $this->member = $member;
        $this->addedBy = $addedBy;
        
        // Load necessary relationships
        $this->board->load('boardable');
    }

    public function broadcastOn(): array
    {
        $channels = [
            // Broadcast to board channel (for existing members)
            new PrivateChannel('boards.' . $this->board->id),
            // Broadcast to the invited user's personal channel
            new PrivateChannel('App.Models.User.' . $this->member->id),
        ];
        
        // Also broadcast to parent workspace/project channel
        if ($this->board->boardable_type === 'App\Models\Workspace') {
            $channels[] = new PrivateChannel('workspaces.' . $this->board->boardable_id);
        } elseif ($this->board->boardable_type === 'App\Models\Project') {
            $channels[] = new PrivateChannel('projects.' . $this->board->boardable_id);
        }
        
        return $channels;
    }

    public function broadcastAs(): string
    {
        return 'board.member.added';
    }

    public function broadcastWith(): array
    {
        // Determine parent type and info
        $parentType = $this->board->boardable_type === 'App\Models\Workspace' ? 'workspace' : 'project';
        $parentId = $this->board->boardable_id;
        $parentName = $this->board->boardable?->name ?? 'Unknown';

        return [
            'board' => [
                'id' => $this->board->id,
                'name' => $this->board->name,
            ],
            'parent' => [
                'type' => $parentType,
                'id' => $parentId,
                'name' => $parentName,
            ],
            'member' => [
                'id' => $this->member->id,
                'name' => $this->member->name,
            ],
            'added_by' => [
                'id' => $this->addedBy->id,
                'name' => $this->addedBy->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}

