<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostScholarshipResource extends JsonResource
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
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'application_deadline' => $this->application_deadline,
            'scholarship_type' => $this->scholarship_type,
            'scholarship_theme' => $this->scholarship_theme,
            'sponsored_by' => $this->sponsored_by,
            'email' => $this->email,
            'website' => $this->website,
            'country' => $this->country,
            'image' => $this->image,
            'attachment' => $this->attachment,
            'status' => $this->status,
            'total_views' => $this->total_views,
            'total_likes' => $this->total_likes,
            'total_shares' => $this->total_shares,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
