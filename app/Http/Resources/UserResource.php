<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Define the base user attributes
        $attributes = [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url ?? asset('images/default-avatar.png'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
        
        // Merge with conditionally loaded relationships
        return array_merge($attributes, [
            // Conditionally include each role profile ONLY if it was loaded by the controller
            'academician' => $this->whenLoaded('academician'),
            'postgraduate' => $this->whenLoaded('postgraduate'),
            'undergraduate' => $this->whenLoaded('undergraduate'),
        ]);
    }
}
