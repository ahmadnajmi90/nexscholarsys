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

class WorkspaceMemberRemoved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The workspace.
     *
     * @var \App\Models\Workspace
     */
    public $workspace;

    /**
     * The member that was removed.
     *
     * @var \App\Models\User
     */
    public $member;

    /**
     * The user who removed the member.
     *
     * @var \App\Models\User
     */
    public $removedBy;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Workspace  $workspace
     * @param  \App\Models\User  $member
     * @param  \App\Models\User  $removedBy
     * @return void
     */
    public function __construct(Workspace $workspace, User $member, User $removedBy)
    {
        $this->workspace = $workspace;
        $this->member = $member;
        $this->removedBy = $removedBy;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('workspaces.' . $this->workspace->id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'workspace.member.removed';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'member_id' => $this->member->id,
            'member_name' => $this->member->name,
            'removed_by' => [
                'id' => $this->removedBy->id,
                'name' => $this->removedBy->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}


