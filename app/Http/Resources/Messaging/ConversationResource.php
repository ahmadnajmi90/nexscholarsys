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
        $user = $request->user();
        $participant = $this->participants->where('user_id', $user->id)->first();
        $unreadCount = 0;
        
        // Calculate unread count if participant has a last_read_message_id
        if ($participant && $participant->last_read_message_id) {
            $unreadCount = $this->messages()
                ->where('id', '>', $participant->last_read_message_id)
                ->where('user_id', '!=', $user->id)
                ->count();
        } elseif ($participant) {
            // If no last_read_message_id, all messages are unread except user's own
            $unreadCount = $this->messages()
                ->where('user_id', '!=', $user->id)
                ->count();
        }
        
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'created_by' => $this->created_by,
            'last_message_id' => $this->last_message_id,
            'participants' => ParticipantResource::collection($this->whenLoaded('participants')),
            'last_message' => $this->when(
                $this->relationLoaded('lastMessage'),
                fn () => new MessageResource($this->lastMessage)
            ),
            'unread_count' => $unreadCount,
            'archived_at' => $participant ? $participant->archived_at : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
