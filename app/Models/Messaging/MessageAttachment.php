<?php

namespace App\Models\Messaging;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

/**
 * MessageAttachment Model
 * 
 * Represents a file attachment associated with a message.
 * 
 * @property int $id
 * @property int $message_id - ID of the associated message
 * @property string $disk - Storage disk name (default: 'public')
 * @property string $path - File path on the storage disk
 * @property string $mime - MIME type of the file
 * @property int $bytes - File size in bytes
 * @property int|null $width - Image width (for images)
 * @property int|null $height - Image height (for images)
 * @property array|null $meta - Additional metadata (thumbnails, duration, etc.)
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 * 
 * @property-read Message $message
 */
class MessageAttachment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'message_id',
        'disk',
        'path',
        'mime',
        'bytes',
        'width',
        'height',
        'meta',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'bytes' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'meta' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the message this attachment belongs to.
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    /**
     * Get the full URL for this attachment.
     */
    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    /**
     * Get the filename from the path.
     */
    public function getFilenameAttribute(): string
    {
        return basename($this->path);
    }

    /**
     * Check if this attachment is an image.
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime, 'image/');
    }

    /**
     * Check if this attachment is a video.
     */
    public function isVideo(): bool
    {
        return str_starts_with($this->mime, 'video/');
    }

    /**
     * Check if this attachment is an audio file.
     */
    public function isAudio(): bool
    {
        return str_starts_with($this->mime, 'audio/');
    }

    /**
     * Get the human-readable file size.
     */
    public function getHumanSizeAttribute(): string
    {
        $bytes = $this->bytes;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get thumbnail URL if available.
     */
    public function getThumbnailUrl(): ?string
    {
        if (isset($this->meta['thumbnail_path'])) {
            return Storage::disk($this->disk)->url($this->meta['thumbnail_path']);
        }

        return null;
    }

    /**
     * Check if file exists on storage.
     */
    public function exists(): bool
    {
        return Storage::disk($this->disk)->exists($this->path);
    }

    /**
     * Delete the attachment file from storage.
     */
    public function deleteFile(): bool
    {
        $deleted = true;

        // Delete main file
        if (Storage::disk($this->disk)->exists($this->path)) {
            $deleted = Storage::disk($this->disk)->delete($this->path);
        }

        // Delete thumbnail if exists
        if (isset($this->meta['thumbnail_path']) && Storage::disk($this->disk)->exists($this->meta['thumbnail_path'])) {
            Storage::disk($this->disk)->delete($this->meta['thumbnail_path']);
        }

        return $deleted;
    }
}