<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\BoardResource;
use App\Http\Resources\UserResource;

class ProjectResource extends JsonResource
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
            'description' => $this->description,
            'owner_id' => $this->owner_id,
            'post_project_id' => $this->post_project_id,
            'owner' => new UserResource($this->whenLoaded('owner')),
            'postProject' => $this->whenLoaded('postProject'),
            'members' => UserResource::collection($this->whenLoaded('members')),
            'boards' => BoardResource::collection($this->whenLoaded('boards')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 