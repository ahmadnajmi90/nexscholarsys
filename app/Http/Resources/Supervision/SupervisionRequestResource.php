<?php

namespace App\Http\Resources\Supervision;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\FieldOfResearch;
use App\Models\ResearchArea;
use App\Models\NicheDomain;

class SupervisionRequestResource extends JsonResource
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
            'postgraduate_program_id' => $this->postgraduate_program_id,
            'proposal_title' => $this->proposal_title,
            'motivation' => $this->motivation,
            'status' => $this->status,
            'submitted_at' => $this->submitted_at,
            'decision_at' => $this->decision_at,
            'cancel_reason' => $this->cancel_reason,
            'conversation_id' => $this->conversation_id,
            'academician' => $this->whenLoaded('academician', function () {
                $facultyRelation = $this->academician->relationLoaded('faculty') ? $this->academician->getRelation('faculty') : null;
                
                return [
                    'id' => $this->academician->id,
                    'academician_id' => $this->academician->academician_id,
                    'full_name' => $this->academician->full_name,
                    'email' => $this->academician->user ? $this->academician->user->email : null,
                    'phone_number' => $this->academician->phone_number,
                    'profile_picture' => $this->academician->profile_picture,
                    'current_position' => $this->academician->current_position,
                    'department' => $this->academician->department,
                    'bio' => $this->academician->bio,
                    'research_areas' => is_array($this->academician->research_expertise) 
                        ? $this->resolveResearchExpertiseNames(array_slice($this->academician->research_expertise, 0, 5))
                        : [],
                    'research_domains' => is_array($this->academician->research_expertise) 
                        ? $this->resolveDomainNames(array_slice($this->academician->research_expertise, 0, 5))
                        : [],
                    'url' => $this->academician->url,
                    'university' => $this->academician->relationLoaded('universityDetails') && $this->academician->universityDetails ? [
                        'id' => $this->academician->universityDetails->id,
                        'name' => $this->academician->universityDetails->full_name,
                        'full_name' => $this->academician->universityDetails->full_name,
                    ] : null,
                    'faculty' => $facultyRelation && is_object($facultyRelation) ? [
                        'id' => $facultyRelation->id,
                        'name' => $facultyRelation->name,
                    ] : null,
                ];
            }),
            'student' => $this->whenLoaded('student', function () {
                $facultyRelation = $this->student->relationLoaded('faculty') ? $this->student->getRelation('faculty') : null;
                
                return [
                    'id' => $this->student->id,
                    'postgraduate_id' => $this->student->postgraduate_id,
                    'full_name' => $this->student->full_name,
                    'profile_picture' => $this->student->profile_picture,
                    'email' => $this->student->user ? $this->student->user->email : null,
                    'phone_number' => $this->student->phone_number,
                    'previous_degree' => $this->student->previous_degree,
                    'bachelor' => $this->student->bachelor,
                    'CGPA_bachelor' => $this->student->CGPA_bachelor,
                    'master' => $this->student->master,
                    'master_type' => $this->student->master_type,
                    'nationality' => $this->student->nationality,
                    'field_of_research' => $this->student->field_of_research,
                    'suggested_research_title' => $this->student->suggested_research_title,
                    'suggested_research_description' => $this->student->suggested_research_description,
                    'english_proficiency_level' => $this->student->english_proficiency_level,
                    'current_postgraduate_status' => $this->student->current_postgraduate_status,
                    'bio' => $this->student->bio,
                    'university' => $this->student->relationLoaded('universityDetails') && $this->student->universityDetails ? [
                        'id' => $this->student->universityDetails->id,
                        'name' => $this->student->universityDetails->full_name,
                    ] : null,
                    'faculty' => $facultyRelation && is_object($facultyRelation) ? [
                        'id' => $facultyRelation->id,
                        'name' => $facultyRelation->name,
                    ] : null,
                ];
            }),
            'notes' => $this->whenLoaded('notes', function () {
                return $this->notes->map(function ($note) {
                    return [
                        'id' => $note->id,
                        'note' => $note->note,
                        'author_id' => $note->author_id,
                        'author' => $note->author ? [
                            'id' => $note->author->id,
                            'name' => $note->author->name,
                        ] : null,
                        'created_at' => $note->created_at,
                        'updated_at' => $note->updated_at,
                    ];
                });
            }),
            'attachments' => $this->attachments->map(function ($attachment) {
                return [
                    'id' => $attachment->id,
                    'type' => $attachment->type,
                    'path' => $attachment->path,
                    'original_name' => $attachment->original_name,
                    'size' => $attachment->size,
                    'mime_type' => $attachment->mime_type,
                    'size_formatted' => $this->formatBytes($attachment->size),
                    'created_at' => $attachment->created_at,
                ];
            }),
            'relationship' => $this->getRelationshipData(),
            'meetings' => function () {
                // Provide meetings at top level for easier access in frontend
                $relationship = \App\Models\SupervisionRelationship::where('student_id', $this->student_id)
                    ->where('academician_id', $this->academician_id)
                    ->with('meetings')
                    ->first();
                
                if (!$relationship) {
                    return [];
                }
                
                return $relationship->meetings->map(function ($meeting) {
                    return [
                        'id' => $meeting->id,
                        'title' => $meeting->title,
                        'scheduled_for' => $meeting->scheduled_for,
                        'location_link' => $meeting->location_link,
                        'agenda' => $meeting->agenda,
                        'type' => $meeting->type ?? 'online',
                    ];
                });
            },
        ];
    }

    protected function getRelationshipData()
    {
        // Manually find relationship by student_id and academician_id
        // Note: Relationship only exists AFTER the request is accepted
        $relationship = \App\Models\SupervisionRelationship::where('student_id', $this->student_id)
            ->where('academician_id', $this->academician_id)
            ->with(['meetings', 'student'])
            ->first();
        
        if (!$relationship) {
            return null;
        }
        
        return [
            'id' => $relationship->id,
            'student_id' => $relationship->student_id,
            'academician_id' => $relationship->academician_id,
            'status' => $relationship->status,
            'role' => $relationship->role,
            'meeting_cadence' => $relationship->meeting_cadence,
            'student' => $relationship->student ? [
                'id' => $relationship->student->id,
                'postgraduate_id' => $relationship->student->postgraduate_id,
                'full_name' => $relationship->student->full_name,
            ] : null,
            'meetings' => $relationship->meetings->map(function ($meeting) {
                return [
                    'id' => $meeting->id,
                    'title' => $meeting->title,
                    'scheduled_for' => $meeting->scheduled_for,
                    'location_link' => $meeting->location_link,
                    'agenda' => $meeting->agenda,
                    'type' => $meeting->type ?? 'online',
                ];
            }),
        ];
    }

    /**
     * Format bytes to human-readable format
     */
    private function formatBytes($bytes, $precision = 2)
    {
        if ($bytes === null || $bytes === 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= (1 << (10 * $pow));
        
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}

