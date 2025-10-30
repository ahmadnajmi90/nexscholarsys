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

class ProjectMemberAdded implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The project.
     *
     * @var \App\Models\Project
     */
    public $project;

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
     * @param  \App\Models\Project  $project
     * @param  \App\Models\User  $member
     * @param  string  $role
     * @param  \App\Models\User  $addedBy
     * @return void
     */
    public function __construct(Project $project, User $member, string $role, User $addedBy)
    {
        $this->project = $project;
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
            // Broadcast to project channel (for existing members)
            new PrivateChannel('projects.' . $this->project->id),
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
        return 'project.member.added';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'project' => [
                'id' => $this->project->id,
                'name' => $this->project->name,
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


