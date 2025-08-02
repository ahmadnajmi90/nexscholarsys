<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacultyResource extends JsonResource
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
            'name' => $this->name,
            'university_id' => $this->university_id,
            'university' => new UniversityResource($this->whenLoaded('university')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'academicians_count' => $this->whenCounted('academicians'),
            'postgraduates_count' => $this->whenCounted('postgraduates'),
            'undergraduates_count' => $this->whenCounted('undergraduates'),
        ];
    }
}