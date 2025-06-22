<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Add this at the top of the toArray method
        $computed_full_name = $this->academician->full_name 
                            ?? $this->postgraduate->full_name 
                            ?? $this->undergraduate->full_name 
                            ?? $this->name;

        return [
            'id' => $this->id,
            'name' => $this->name, // Keep as a fallback
            'email' => $this->email,
            'avatar_url' => $this->avatar_url ?? asset('images/default-avatar.png'),
            
            // ADD THIS COMPUTED ATTRIBUTE
            'full_name' => $computed_full_name,

            // Keep the conditionally loaded relationships
            'academician' => $this->whenLoaded('academician'),
            'postgraduate' => $this->whenLoaded('postgraduate'),
            'undergraduate' => $this->whenLoaded('undergraduate'),
        ];
    }
}
