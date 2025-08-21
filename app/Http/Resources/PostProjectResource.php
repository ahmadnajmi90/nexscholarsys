<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostProjectResource extends JsonResource
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
            'author_id' => $this->author_id,
            'title' => $this->title,
            'url' => $this->url,
            'description' => $this->description,
            'project_theme' => $this->project_theme,
            'purpose' => $this->purpose,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'application_deadline' => $this->application_deadline,
            'duration' => $this->duration,
            'sponsored_by' => $this->sponsored_by,
            'category' => $this->category,
            'field_of_research' => $this->field_of_research,
            'supervisor_category' => $this->supervisor_category,
            'supervisor_name' => $this->supervisor_name,
            'university' => $this->university,
            'email' => $this->email,
            'origin_country' => $this->origin_country,
            'student_nationality' => $this->student_nationality,
            'student_level' => $this->student_level,
            'student_mode_study' => $this->student_mode_study,
            'appointment_type' => $this->appointment_type,
            'purpose_of_collaboration' => $this->purpose_of_collaboration,
            'image' => $this->image,
            'attachment' => $this->attachment,
            'application_url' => $this->application_url,
            'amount' => $this->amount,
            'project_status' => $this->project_status,
            'total_views' => $this->total_views,
            'total_likes' => $this->total_likes,
            'total_shares' => $this->total_shares,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 