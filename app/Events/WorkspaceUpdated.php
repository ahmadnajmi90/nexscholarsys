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

class WorkspaceUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The workspace that was updated.
     *
     * @var \App\Models\Workspace
     */
    public $workspace;

    /**
     * The user who updated the workspace.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * The type of update (e.g., 'renamed').
     *
     * @var string
     */
    public $updateType;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Workspace  $workspace
     * @param  \App\Models\User  $user
     * @param  string  $updateType
     * @return void
     */
    public function __construct(Workspace $workspace, User $user, string $updateType = 'updated')
    {
        $this->workspace = $workspace;
        $this->user = $user;
        $this->updateType = $updateType;

        // Load necessary relationships
        $this->workspace->load(['owner', 'members']);
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
        return 'workspace.updated';
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
                'description' => $this->workspace->description,
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'update_type' => $this->updateType,
            // Include timestamp to help with update conflicts
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
