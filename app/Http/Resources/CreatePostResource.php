<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CreatePostResource extends JsonResource
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
            'content' => $this->content,
            'category' => $this->category,
            'tags' => $this->tags,
            'images' => $this->images,
            'featured_image' => $this->featured_image,
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