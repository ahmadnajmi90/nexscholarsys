<?php

namespace App\Events;

use App\Models\Workspace;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkspaceMemberAdded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The workspace.
     *
     * @var \App\Models\Workspace
     */
    public $workspace;

    /**
     * The member that was added.
     *
     * @var \App\Models\User
     */
    public $member;

    /**
     * The role of the added member.
     *
     * @var string
     */
    public $role;

    /**
     * The user who added the member.
     *
     * @var \App\Models\User
     */
    public $addedBy;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Workspace  $workspace
     * @param  \App\Models\User  $member
     * @param  string  $role
     * @param  \App\Models\User  $addedBy
     * @return void
     */
    public function __construct(Workspace $workspace, User $member, string $role, User $addedBy)
    {
        $this->workspace = $workspace;
        $this->member = $member;
        $this->role = $role;
        $this->addedBy = $addedBy;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return [
            // Broadcast to workspace channel (for existing members)
            new PrivateChannel('workspaces.' . $this->workspace->id),
            // Broadcast to the invited user's personal channel (so they get notified)
            new PrivateChannel('App.Models.User.' . $this->member->id),
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'workspace.member.added';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'workspace' => [
                'id' => $this->workspace->id,
                'name' => $this->workspace->name,
            ],
            'member' => [
                'id' => $this->member->id,
                'name' => $this->member->name,
            ],
            'role' => $this->role,
            'added_by' => [
                'id' => $this->addedBy->id,
                'name' => $this->addedBy->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}


