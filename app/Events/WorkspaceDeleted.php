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

class WorkspaceDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The ID of the workspace that was deleted.
     *
     * @var int
     */
    public $workspaceId;

    /**
     * The name of the workspace that was deleted.
     *
     * @var string
     */
    public $workspaceName;

    /**
     * The user who deleted the workspace.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * Create a new event instance.
     *
     * @param  int  $workspaceId
     * @param  string  $workspaceName
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(int $workspaceId, string $workspaceName, User $user)
    {
        $this->workspaceId = $workspaceId;
        $this->workspaceName = $workspaceName;
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // Broadcast to the workspace channel so all members are notified
        return new PrivateChannel('workspaces.' . $this->workspaceId);
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'workspace.deleted';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'workspace_id' => $this->workspaceId,
            'name' => $this->workspaceName,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}


