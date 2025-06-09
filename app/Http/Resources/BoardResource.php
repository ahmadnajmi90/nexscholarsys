<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\BoardListResource;

class BoardResource extends JsonResource
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
            'workspace_id' => $this->workspace_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'lists' => $this->whenLoaded('lists', function () {
                return BoardListResource::collection($this->lists);
            }),
        ];
    }
} 