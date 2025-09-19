<?php

namespace App\Http\Resources\Messaging;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * Messaging attachments use controller routes for both preview and download URLs.
 * 
 * This approach ensures:
 * 1. Authorization policies are enforced for every access
 * 2. Works even in environments where storage symlinks might be misconfigured
 * 3. Provides consistent access control across different storage backends
 */
class AttachmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $disk = $this->disk;
        $path = $this->path;

        // Always use controller routes for both preview and download
        // This ensures proper authorization checks on every access
        $previewUrl = route('messaging.attachments.show', ['attachment' => $this->id]);
        $downloadUrl = route('messaging.attachments.download', ['attachment' => $this->id]);

        return [
            'id' => $this->id,
            'message_id' => $this->message_id,
            'mime' => $this->mime,
            'filename' => $this->getFilenameAttribute(),
            'size' => $this->bytes,
            'human_size' => $this->getHumanSizeAttribute(),
            'width' => $this->width,
            'height' => $this->height,
            'url' => $previewUrl,
            'download_url' => $downloadUrl,
            'disk' => $disk,
            'path' => $path,
            'thumbnail_url' => $this->getThumbnailUrl(),
            'meta' => $this->meta,
            'created_at' => $this->created_at,
        ];
    }
}
