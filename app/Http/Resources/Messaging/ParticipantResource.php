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
        $user = $this->whenLoaded('user');
        
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'role' => $this->role,
            'last_read_message_id' => $this->last_read_message_id,
            'joined_at' => $this->joined_at,
            'left_at' => $this->left_at,
            'archived_at' => $this->archived_at,
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'full_name' => $user->full_name,
                'last_seen_at' => $user->last_seen_at,
                'profile_photo_url' => $user->profile_photo_url ?? null,
            ] : null,
        ];
    }
}
