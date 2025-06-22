<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class BoardListResource extends JsonResource
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
            'board_id' => $this->board_id,
            'name' => $this->name,
            'order' => $this->order,

            // CHANGE THIS LINE  
            'tasks' => \App\Http\Resources\TaskResource::collection($this->whenLoaded('tasks')),
            
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 