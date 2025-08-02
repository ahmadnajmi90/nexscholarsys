<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniversityResource extends JsonResource
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
            'full_name' => $this->full_name,
            'short_name' => $this->short_name,
            'country' => $this->country,
            'university_category' => $this->university_category,
            'university_type' => $this->university_type,
            'profile_picture' => $this->profile_picture,
            'background_image' => $this->background_image,
            // 'state' => $this->state,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'faculties_count' => $this->whenCounted('faculties'),
            'faculties' => FacultyResource::collection($this->whenLoaded('faculties')),
        ];
    }
}