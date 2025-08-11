<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhDProgramResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'university_id' => $this->university_id,
            'faculty_id' => $this->faculty_id,
            'description' => $this->description,
            'duration_years' => $this->duration_years,
            'funding_info' => $this->funding_info,
            'application_url' => $this->application_url,
            'country' => $this->country,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'university' => new UniversityResource($this->whenLoaded('university')),
            'faculty' => new FacultyResource($this->whenLoaded('faculty')),
        ];
    }
}

