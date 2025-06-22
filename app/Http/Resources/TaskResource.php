<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\TaskCommentResource;
use App\Http\Resources\TaskAttachmentResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Log;

class TaskResource extends JsonResource
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
            'board_list_id' => $this->board_list_id,
            'title' => $this->title,
            'description' => $this->description,
            'due_date' => $this->due_date,
            'order' => $this->order,
            'priority' => $this->priority,

            // --- Relationships ---
            'creator' => new UserResource($this->whenLoaded('creator')),
            'assignees' => UserResource::collection($this->whenLoaded('assignees')),
            'comments' => TaskCommentResource::collection($this->whenLoaded('comments')),
            'attachments' => TaskAttachmentResource::collection($this->whenLoaded('attachments')),
            'paper_writing_task' => $this->whenLoaded('paperWritingTask'),

            // --- Timestamps ---
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // --- THE CRITICAL MISSING FIELD ---
            'completed_at' => $this->completed_at,
        ];
    }
} 