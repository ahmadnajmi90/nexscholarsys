<?php

namespace App\Http\Resources\Messaging;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParticipantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'user_id' => $this->user_id,
            'role' => $this->role,
            'last_read_message_id' => $this->last_read_message_id,
            'pinned' => $this->pinned,
            'muted_until' => $this->muted_until,
            'joined_at' => $this->joined_at,
            'left_at' => $this->left_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships
            'user' => new UserResource($this->whenLoaded('user')),
            'last_read_message' => new MessageResource($this->whenLoaded('lastReadMessage')),
        ];
    }
}