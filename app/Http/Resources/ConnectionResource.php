<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConnectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $currentUser = $request->user();

        // Determine the counterpart user (not the current user)
        $counterpart = $this->requester_id === $currentUser->id
            ? $this->recipient
            : $this->requester;

        return [
            'connection_id' => $this->id,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'user' => [
                'id' => $counterpart->id,
                'full_name' => $counterpart->full_name,
                'avatar_url' => $counterpart->avatar_url,
            ],
        ];
    }
}
