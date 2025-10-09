<?php

namespace App\Http\Resources\Supervision;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\FieldOfResearch;
use App\Models\ResearchArea;
use App\Models\NicheDomain;

class SupervisionRelationshipResource extends JsonResource
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
            'student_id' => $this->student_id,
            'academician_id' => $this->academician_id,
            'role' => $this->role,
            'status' => $this->status,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'cohort' => $this->cohort,
            'meeting_cadence' => $this->meeting_cadence,
            'scholarlab_workspace_id' => $this->scholarlab_workspace_id,
            'scholarlab_board_id' => $this->scholarlab_board_id,
            'conversation_id' => $this->conversation_id,
            'accepted_at' => $this->accepted_at,
            'terminated_at' => $this->terminated_at,
            'university_letter_path' => $this->university_letter_path,
            'student' => $this->whenLoaded('student', fn () => [
                'postgraduate_id' => $this->student->postgraduate_id,
                'full_name' => $this->student->full_name,
                'profile_picture' => $this->student->profile_picture,
                'email' => $this->student->user?->email,
                'phone_number' => $this->student->phone_number,
                'bio' => $this->student->bio,
                'nationality' => $this->student->nationality,
                'supervision_group_conversation_id' => $this->student->supervision_group_conversation_id,
                'university' => $this->student->universityDetails ? [
                    'id' => $this->student->universityDetails->id,
                    'name' => $this->student->universityDetails->name,
                    'full_name' => $this->student->universityDetails->full_name,
                ] : null,
                'faculty' => $this->whenLoaded('faculty', fn () => 
                    $this->student->faculty ? [
                        'id' => $this->student->faculty->id,
                        'name' => $this->student->faculty->name,
                    ] : null
                ),
                'field_of_research' => is_array($this->student->field_of_research) 
                    ? $this->resolveResearchExpertiseNames(array_slice($this->student->field_of_research, 0, 1))
                    : [],
                'research_domains' => is_array($this->student->field_of_research) 
                    ? $this->resolveDomainNames(array_slice($this->student->field_of_research, 0, 1))
                    : [],
            ]),
            'academician' => $this->whenLoaded('academician', fn () => [
                'full_name' => $this->academician->full_name,
                'user' => $this->academician->user,
                'profile_picture' => $this->academician->profile_picture,
                'current_position' => $this->academician->current_position,
                'department' => $this->academician->department,
                'research_areas' => is_array($this->academician->research_expertise) 
                    ? $this->resolveResearchExpertiseNames(array_slice($this->academician->research_expertise, 0, 1))
                    : [],
                'research_domains' => is_array($this->academician->research_expertise) 
                    ? $this->resolveDomainNames(array_slice($this->academician->research_expertise, 0, 1))
                    : [],
                'university' => ($this->academician->relationLoaded('universityDetails') && $this->academician->universityDetails) ? [
                    'id' => $this->academician->universityDetails->id,
                    'name' => $this->academician->universityDetails->name,
                    'full_name' => $this->academician->universityDetails->full_name,
                ] : null,
                'faculty' => ($this->academician->relationLoaded('faculty') && $this->academician->getRelation('faculty')) ? [
                    'id' => $this->academician->getRelation('faculty')->id,
                    'name' => $this->academician->getRelation('faculty')->name,
                ] : null,
            ]),
            'meetings' => $this->whenLoaded('meetings', fn () => $this->meetings),
            'onboarding_checklist_items' => $this->whenLoaded('onboardingChecklistItems', fn () => $this->onboardingChecklistItems),
            'documents' => $this->whenLoaded('documents', fn () => $this->documents),
            'notes' => $this->whenLoaded('notes', fn () => $this->notes),
            'unbindRequests' => $this->whenLoaded('unbindRequests', fn () => $this->unbindRequests),
            'activeUnbindRequest' => $this->whenLoaded('activeUnbindRequest', fn () => $this->activeUnbindRequest),
            'cosupervisors' => $this->whenLoaded('cosupervisors', fn () => 
                $this->cosupervisors->map(fn ($cosup) => [
                    'academician_id' => $cosup->academician_id,
                    'full_name' => $cosup->full_name,
                    'profile_picture' => $cosup->profile_picture,
                    'current_position' => $cosup->current_position,
                    'department' => $cosup->department,
                ])
            ),
        ];
    }
}

