<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\TaskCommentResource;
use App\Http\Resources\TaskAttachmentResource;

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
            'creator' => $this->whenLoaded('creator', function () {
                return [
                    'id' => $this->creator->id,
                    'name' => $this->creator->name,
                ];
            }),
            'assignees' => $this->whenLoaded('assignees', function () {
                return $this->assignees->map(function ($assignee) {
                    return [
                        'id' => $assignee->id,
                        'name' => $assignee->name,
                    ];
                });
            }),
            'comments' => $this->whenLoaded('comments', function () {
                return TaskCommentResource::collection($this->comments);
            }),
            'attachments' => $this->whenLoaded('attachments', function () {
                return TaskAttachmentResource::collection($this->attachments);
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 