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
        // Get profile picture from the appropriate role model
        $profilePicture = null;
        if ($this->academician) {
            $profilePicture = $this->academician->profile_picture;
        } elseif ($this->postgraduate) {
            $profilePicture = $this->postgraduate->profile_picture;
        } elseif ($this->undergraduate) {
            $profilePicture = $this->undergraduate->profile_picture;
        }

        $data = [
            'id' => $this->id,
            'name' => $this->name, // Fallback name
            'email' => $this->email,
            'avatar_url' => $profilePicture ?? $this->avatar_url ?? asset('images/default-avatar.png'),
            'full_name' => $this->academician->full_name 
                            ?? $this->postgraduate->full_name 
                            ?? $this->undergraduate->full_name 
                            ?? $this->name,
            'academician' => $this->whenLoaded('academician'),
            'postgraduate' => $this->whenLoaded('postgraduate'),
            'undergraduate' => $this->whenLoaded('undergraduate'),
        ];
        
        // Add pivot data if it exists
        if (isset($this->pivot)) {
            $data['pivot'] = $this->pivot;
        }
        
        return $data;
    }
}
