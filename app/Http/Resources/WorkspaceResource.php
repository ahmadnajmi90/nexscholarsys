<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\BoardResource;

class WorkspaceResource extends JsonResource
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
            'owner' => [
                'id' => $this->owner->id,
                'name' => $this->owner->name,
            ],
            'members' => $this->whenLoaded('members', function () {
                return $this->members->map(function ($member) {
                    return [
                        'id' => $member->id,
                        'name' => $member->name,
                        'role' => $member->pivot->role,
                    ];
                });
            }),
            'boards' => BoardResource::collection($this->whenLoaded('boards')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 