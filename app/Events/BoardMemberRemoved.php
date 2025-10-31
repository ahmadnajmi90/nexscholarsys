<?php

namespace App\Events;

use App\Models\Board;
use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BoardMemberRemoved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $board;
    public $member;
    public $removedBy;

    public function __construct(Board $board, User $member, User $removedBy)
    {
        $this->board = $board;
        $this->member = $member;
        $this->removedBy = $removedBy;
        
        // Load necessary relationships
        $this->board->load('boardable');
    }

    public function broadcastOn(): array
    {
        $channels = [
            // Broadcast to board channel (for remaining members)
            new PrivateChannel('boards.' . $this->board->id),
            // Broadcast to the removed user's personal channel
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
        return 'board.member.removed';
    }

    public function broadcastWith(): array
    {
        return [
            'board' => [
                'id' => $this->board->id,
                'name' => $this->board->name,
            ],
            'member' => [
                'id' => $this->member->id,
                'name' => $this->member->name,
            ],
            'removed_by' => [
                'id' => $this->removedBy->id,
                'name' => $this->removedBy->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}

