<?php

namespace App\Events;

use App\Models\Project;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectMemberRemoved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The project.
     *
     * @var \App\Models\Project
     */
    public $project;

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
     * @param  \App\Models\Project  $project
     * @param  \App\Models\User  $member
     * @param  \App\Models\User  $removedBy
     * @return void
     */
    public function __construct(Project $project, User $member, User $removedBy)
    {
        $this->project = $project;
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
        return new PrivateChannel('projects.' . $this->project->id);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'project.member.removed';
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


