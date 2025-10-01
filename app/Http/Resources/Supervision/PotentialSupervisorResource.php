<?php

namespace App\Http\Resources\Supervision;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\FieldOfResearch;
use App\Models\ResearchArea;
use App\Models\NicheDomain;

class PotentialSupervisorResource extends JsonResource
{
    protected function resolveResearchExpertiseNames(array $expertiseIds): array
    {
        $resolved = [];
        
        foreach ($expertiseIds as $id) {
            // Parse the ID format: "field_id-area_id-domain_id"
            $parts = explode('-', $id);
            if (count($parts) === 3) {
                [$fieldId, $areaId, $domainId] = $parts;
                
                $field = FieldOfResearch::find($fieldId);
                $area = ResearchArea::find($areaId);
                $domain = NicheDomain::find($domainId);
                
                if ($field && $area && $domain) {
                    $resolved[] = "{$field->name} - {$area->name} - {$domain->name}";
                }
            }
        }
        
        return $resolved;
    }

    protected function resolveDomainNames(array $expertiseIds): array
    {
        $domains = [];
        
        foreach ($expertiseIds as $id) {
            // Parse the ID format: "field_id-area_id-domain_id"
            $parts = explode('-', $id);
            if (count($parts) === 3) {
                $domainId = $parts[2];
                
                $domain = NicheDomain::find($domainId);
                
                if ($domain) {
                    $domains[] = $domain->name;
                }
            }
        }
        
        return $domains;
    }

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'academician_id' => $this->academician_id,
            'postgraduate_program_id' => $this->postgraduate_program_id,
            'saved_at' => $this->created_at,
            'academician' => [
                'academician_id' => $this->academician?->academician_id,
                'full_name' => $this->academician?->full_name,
                'profile_picture' => $this->academician?->profile_picture,
                'department' => $this->academician?->department,
                'current_position' => $this->academician?->current_position,
                'url' => $this->academician?->url,
                'availability_as_supervisor' => $this->academician?->availability_as_supervisor,
                'publications_count' => $this->academician?->publications()->count() ?? 0,
                'projects_count' => $this->academician?->postProjects()->count() ?? 0,
                'research_areas' => is_array($this->academician?->research_expertise) 
                    ? $this->resolveResearchExpertiseNames(array_slice($this->academician->research_expertise, 0, 5))
                    : [],
                'research_domains' => is_array($this->academician?->research_expertise) 
                    ? $this->resolveDomainNames(array_slice($this->academician->research_expertise, 0, 5))
                    : [],
                'university' => ($this->academician 
                    && $this->academician->relationLoaded('universityDetails') 
                    && $this->academician->universityDetails 
                    && is_object($this->academician->universityDetails)) ? [
                        'id' => $this->academician->universityDetails->id,
                        'name' => $this->academician->universityDetails->full_name,
                    ] : null,
                'faculty' => ($this->academician 
                    && $this->academician->relationLoaded('faculty') 
                    && $this->academician->faculty 
                    && is_object($this->academician->faculty)) ? [
                        'id' => $this->academician->faculty->id,
                        'name' => $this->academician->faculty->name,
                    ] : null,
                'user' => $this->academician?->user ? [
                    'id' => $this->academician->user->id,
                    'name' => $this->academician->user->name,
                    'academician' => [
                        'academician_id' => $this->academician->user->academician?->academician_id,
                    ],
                ] : null,
            ],
        ];
    }
}

