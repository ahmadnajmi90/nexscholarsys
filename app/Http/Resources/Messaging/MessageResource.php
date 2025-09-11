<?php

namespace App\Http\Resources\Messaging;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
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
            'type' => $this->type,
            'body' => $this->body,
            'reply_to_id' => $this->reply_to_id,
            'delivered_at' => $this->delivered_at,
            'read_at' => $this->read_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            
            // Relationships
            'sender' => new UserResource($this->whenLoaded('sender')),
            'reply_to' => new MessageResource($this->whenLoaded('replyTo')),
            'replies' => MessageResource::collection($this->whenLoaded('replies')),
            'attachments' => MessageAttachmentResource::collection($this->whenLoaded('attachments')),
        ];
    }
}