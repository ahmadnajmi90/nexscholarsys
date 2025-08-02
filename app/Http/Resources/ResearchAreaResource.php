<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ResearchAreaResource extends JsonResource
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
            'field_of_research_id' => $this->field_of_research_id,
            'field_of_research' => new FieldOfResearchResource($this->whenLoaded('fieldOfResearch')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'niche_domains_count' => $this->whenCounted('nicheDomains'),
            'niche_domains' => NicheDomainResource::collection($this->whenLoaded('nicheDomains')),
        ];
    }
}