<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostEventResource extends JsonResource
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
            'event_name' => $this->event_name,
            'url' => $this->url,
            'description' => $this->description,
            'event_type' => $this->event_type,
            'event_mode' => $this->event_mode,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'image' => $this->image,
            'event_theme' => $this->event_theme,
            'registration_url' => $this->registration_url,
            'registration_deadline' => $this->registration_deadline,
            'contact_email' => $this->contact_email,
            'venue' => $this->venue,
            'city' => $this->city,
            'country' => $this->country,
            'event_status' => $this->event_status,
            'field_of_research' => $this->field_of_research,
            'total_views' => $this->total_views,
            'total_likes' => $this->total_likes,
            'total_shares' => $this->total_shares,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
} 