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
            'reply_to' => $this->when(
                $this->relationLoaded('replyTo') && $this->replyTo,
                fn () => [
                    'id' => $this->replyTo->id,
                    'body' => $this->replyTo->body,
                    'user_id' => $this->replyTo->user_id,
                    'sender_name' => $this->relationLoaded('replyTo.sender') 
                        ? ($this->replyTo->sender->name ?? 'Unknown')
                        : 'Unknown',
                ]
            ),
            'edited_at' => optional($this->edited_at)?->toISOString(),
            'delivered_at' => optional($this->delivered_at)?->toISOString(),
            'read_at' => optional($this->read_at)?->toISOString(),
            'meta' => $this->meta,
            'created_at' => optional($this->created_at)?->toISOString(),
            'updated_at' => optional($this->updated_at)?->toISOString(),
            'deleted_at' => optional($this->deleted_at)?->toISOString(),
            'sender' => $this->when(
                $this->relationLoaded('sender') && $this->sender,
                fn () => [
                    'id' => $this->sender->id,
                    'name' => $this->sender->full_name,        // uses accessor
                    'avatar_url' => $this->sender->avatar_url, // uses accessor
                    'profile_photo_url' => $this->sender->profile_photo_url // optional alias if your FE expects this key
                ]
            ),
            'attachments' => $this->when(
                $this->relationLoaded('attachments'),
                fn () => AttachmentResource::collection($this->attachments)
            ),
        ];
    }
}
