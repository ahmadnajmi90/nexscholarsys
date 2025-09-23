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
        // $this->resource is the ConversationParticipant model instance.
        $participant = $this->resource;

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'role' => $this->role,
            'last_read_message_id' => $this->last_read_message_id,
            'joined_at' => $this->joined_at,
            'left_at' => $this->left_at,
            'archived_at' => $this->archived_at,

            'user' => $this->whenLoaded('user', function () use ($participant) {
                $user = $participant->user;

                $userRole = null;
                if ($user->relationLoaded('academician') && $user->academician) {
                    $userRole = 'academician';
                } elseif ($user->relationLoaded('postgraduate') && $user->postgraduate) {
                    $userRole = 'postgraduate';
                } elseif ($user->relationLoaded('undergraduate') && $user->undergraduate) {
                    $userRole = 'undergraduate';
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'full_name' => $user->full_name,
                    'last_seen_at' => $user->last_seen_at,
                    'profile_photo_url' => $user->profile_photo_url ?? null,
                    'role' => $userRole,

                    'academician' => $this->when($user->relationLoaded('academician') && $user->academician, function () use ($user) {
                        return [
                            'id' => $user->academician->id,
                            'url' => $user->academician->url,
                            'profile_picture' => $user->academician->profile_picture,
                            'full_name' => $user->academician->full_name,
                        ];
                    }),

                    'postgraduate' => $this->when($user->relationLoaded('postgraduate') && $user->postgraduate, function () use ($user) {
                        return [
                            'id' => $user->postgraduate->id,
                            'url' => $user->postgraduate->url,
                            'profile_picture' => $user->postgraduate->profile_picture,
                            'full_name' => $user->postgraduate->full_name,
                        ];
                    }),

                    'undergraduate' => $this->when($user->relationLoaded('undergraduate') && $user->undergraduate, function () use ($user) {
                        return [
                            'id' => $user->undergraduate->id,
                            'url' => $user->undergraduate->url,
                            'profile_picture' => $user->undergraduate->profile_picture,
                            'full_name' => $user->undergraduate->full_name,
                        ];
                    }),
                ];
            }),
        ];
    }
}
