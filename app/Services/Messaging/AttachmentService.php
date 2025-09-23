<?php

namespace App\Services\Messaging;

use App\Models\Messaging\Message;
use App\Models\Messaging\MessageAttachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AttachmentService
{
    /**
     * Store an attachment for a message.
     *
     * @param Message $message
     * @param UploadedFile $file
     * @return MessageAttachment
     */
    public function store(Message $message, UploadedFile $file): MessageAttachment
    {
        // Generate a unique filename
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Get the storage disk from config
        $disk = config('messaging.storage_disk', 'public');
        $path = config('messaging.storage_path', 'messaging/attachments');
        
        // Store the file
        $filePath = $file->storeAs($path, $filename, $disk);
        
        // Get file metadata
        $mime = $file->getMimeType();
        $size = $file->getSize();
        $width = null;
        $height = null;
        $meta = null;
        
        // If it's an image, get dimensions
        if (str_starts_with($mime, 'image/')) {
            try {
                list($width, $height) = getimagesize($file->getRealPath());
                
                // Generate thumbnail if it's an image
                $thumbnailPath = $this->generateThumbnail($file, $disk);
                if ($thumbnailPath) {
                    $meta = ['thumbnail_path' => $thumbnailPath];
                }
            } catch (\Exception $e) {
                // Ignore errors, just don't set dimensions
            }
        }
        
        // Create the attachment record
        return MessageAttachment::create([
            'message_id' => $message->id,
            'disk' => $disk,
            'path' => $filePath,
            'mime' => $mime,
            'bytes' => $size,
            'width' => $width,
            'height' => $height,
            'meta' => $meta,
        ]);
    }
    
    /**
     * Generate a thumbnail for an image.
     *
     * @param UploadedFile $file
     * @param string $disk
     * @return string|null The thumbnail path or null if failed
     */
    protected function generateThumbnail(UploadedFile $file, string $disk): ?string
    {
        try {
            // Only generate thumbnails for images
            if (!str_starts_with($file->getMimeType(), 'image/')) {
                return null;
            }
            
            // Generate a unique filename for the thumbnail
            $filename = 'thumb_' . Str::uuid() . '.' . $file->getClientOriginalExtension();
            $thumbnailPath = config('messaging.thumbnail_path', 'messaging/thumbnails') . '/' . $filename;
            
            // Create thumbnail using Intervention Image if available
            if (class_exists('\\Intervention\\Image\\Facades\\Image')) {
                $image = \Intervention\Image\Facades\Image::make($file->getRealPath());
                $image->fit(300, 300, function ($constraint) {
                    $constraint->upsize();
                });
                
                // Store the thumbnail
                Storage::disk($disk)->put($thumbnailPath, $image->encode());
                
                return $thumbnailPath;
            }
            
            return null;
        } catch (\Exception $e) {
            return null;
        }
    }
    
    /**
     * Stream an attachment to the response.
     *
     * @param MessageAttachment $attachment
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function stream(MessageAttachment $attachment)
    {
        return Storage::disk($attachment->disk)->response(
            $attachment->path,
            $attachment->getFilenameAttribute(),
            [
                'Content-Type' => $attachment->mime,
                'Content-Disposition' => 'inline; filename="' . $attachment->getFilenameAttribute() . '"',
                'Cache-Control' => 'private, max-age=0'
            ]
        );
    }
    
    /**
     * Download an attachment.
     *
     * @param MessageAttachment $attachment
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function download(MessageAttachment $attachment)
    {
        return Storage::disk($attachment->disk)->download(
            $attachment->path,
            $attachment->getFilenameAttribute(),
            [
                'Content-Type' => $attachment->mime,
            ]
        );
    }
}
