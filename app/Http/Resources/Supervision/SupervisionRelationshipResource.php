<?php

namespace App\Http\Resources\Supervision;

use Illuminate\Http\Resources\Json\JsonResource;

class SupervisionRelationshipResource extends JsonResource
{
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
            'student' => $this->whenLoaded('student', fn () => [
                'full_name' => $this->student->full_name,
                'profile_picture' => $this->student->profile_picture,
            ]),
            'academician' => $this->whenLoaded('academician', fn () => [
                'full_name' => $this->academician->full_name,
                'profile_picture' => $this->academician->profile_picture,
            ]),
            'meetings' => $this->whenLoaded('meetings', fn () => $this->meetings),
            'notes' => $this->whenLoaded('notes', fn () => $this->notes),
        ];
    }
}

