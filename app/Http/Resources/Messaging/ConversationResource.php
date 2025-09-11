<?php

namespace App\Http\Resources\Messaging;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
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
            'type' => $this->type,
            'title' => $this->title,
            'icon_path' => $this->icon_path,
            'created_by' => $this->created_by,
            'last_message_id' => $this->last_message_id,
            'is_archived' => $this->is_archived,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Relationships
            'creator' => new UserResource($this->whenLoaded('creator')),
            'last_message' => new MessageResource($this->whenLoaded('lastMessage')),
            'participants' => ParticipantResource::collection($this->whenLoaded('participants')),
            'messages' => MessageResource::collection($this->whenLoaded('messages')),
        ];
    }
}