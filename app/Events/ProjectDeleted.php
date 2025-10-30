<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The ID of the project that was deleted.
     *
     * @var int
     */
    public $projectId;

    /**
     * The name of the project that was deleted.
     *
     * @var string
     */
    public $projectName;

    /**
     * The user who deleted the project.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param  int  $projectId
     * @param  string  $projectName
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(int $projectId, string $projectName, User $user)
    {
        $this->projectId = $projectId;
        $this->projectName = $projectName;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // Broadcast to the project channel so all members are notified
        return new PrivateChannel('projects.' . $this->projectId);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'project.deleted';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'project_id' => $this->projectId,
            'name' => $this->projectName,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}


