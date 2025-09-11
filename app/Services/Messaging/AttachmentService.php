<?php

namespace App\Services\Messaging;

use App\Models\Messaging\MessageAttachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Service for handling message attachment uploads, validation, and processing.
 */
class AttachmentService
{
    /**
     * Maximum file sizes in KB
     */
    private const MAX_FILE_SIZE = 10240; // 10MB
    private const MAX_IMAGE_SIZE = 5120; // 5MB

    /**
     * Allowed MIME types by category
     */
    private const ALLOWED_MIMES = [
        'images' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        'documents' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
        'videos' => ['mp4', 'webm', 'mov'],
    ];

    /**
     * Storage disk and path configuration
     */
    private string $disk;
    private string $basePath;

    public function __construct()
    {
        $this->disk = config('messaging.storage_disk', 'public');
        $this->basePath = config('messaging.storage_path', 'messaging');
    }

    /**
     * Validate an uploaded file against the allowed types and sizes.
     *
     * @param UploadedFile $file
     * @return array Validation result with 'valid' boolean and 'errors' array
     */
    public function validateFile(UploadedFile $file): array
    {
        $errors = [];

        // Check file size
        $maxSize = $this->getMaxSizeForFile($file);
        if ($file->getSize() > ($maxSize * 1024)) {
            $errors[] = "File size exceeds the maximum allowed size of " . $maxSize . "KB.";
        }

        // Check MIME type
        $allowedExtensions = $this->getAllowedExtensionsForFile($file);
        $fileExtension = strtolower($file->getClientOriginalExtension());

        if (!in_array($fileExtension, $allowedExtensions)) {
            $errors[] = "File type '{$fileExtension}' is not allowed. Allowed types: " . implode(', ', $allowedExtensions);
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'type' => $this->determineFileType($file)
        ];
    }

    /**
     * Process and store an uploaded file for a message.
     *
     * @param UploadedFile $file
     * @param int $messageId
     * @param int $conversationId
     * @return MessageAttachment|null
     */
    public function processAttachment(UploadedFile $file, int $messageId, int $conversationId): ?MessageAttachment
    {
        // Validate the file
        $validation = $this->validateFile($file);
        if (!$validation['valid']) {
            return null;
        }

        // Generate storage path
        $path = $this->generateStoragePath($conversationId, $messageId, $file);
        $thumbnailPath = null;

        // Process the file
        if ($validation['type'] === 'image') {
            // Store image with potential thumbnail
            $storedPath = $this->storeImage($file, $path);
            if ($storedPath) {
                $path = $storedPath;
                $thumbnailPath = $this->generateThumbnail($file, $path);
            }
        } else {
            // Store regular file
            $path = $file->storeAs($this->basePath, $path, $this->disk);
        }

        if (!$path) {
            return null;
        }

        // Get image dimensions if it's an image
        $dimensions = null;
        if ($validation['type'] === 'image') {
            $dimensions = $this->getImageDimensions($file);
        }

        // Create attachment record
        $attachment = MessageAttachment::create([
            'message_id' => $messageId,
            'disk' => $this->disk,
            'path' => $path,
            'mime' => $file->getMimeType(),
            'bytes' => $file->getSize(),
            'width' => $dimensions['width'] ?? null,
            'height' => $dimensions['height'] ?? null,
            'meta' => $thumbnailPath ? ['thumbnail_path' => $thumbnailPath] : null,
        ]);

        return $attachment;
    }

    /**
     * Process multiple attachments for a message.
     *
     * @param array $files Array of UploadedFile objects
     * @param int $messageId
     * @param int $conversationId
     * @return array Array of MessageAttachment objects
     */
    public function processMultipleAttachments(array $files, int $messageId, int $conversationId): array
    {
        $attachments = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $attachment = $this->processAttachment($file, $messageId, $conversationId);
                if ($attachment) {
                    $attachments[] = $attachment;
                }
            }
        }

        return $attachments;
    }

    /**
     * Delete an attachment and its files from storage.
     *
     * @param MessageAttachment $attachment
     * @return bool
     */
    public function deleteAttachment(MessageAttachment $attachment): bool
    {
        return $attachment->deleteFile();
    }

    /**
     * Get the maximum allowed size for a file type.
     *
     * @param UploadedFile $file
     * @return int Size in KB
     */
    private function getMaxSizeForFile(UploadedFile $file): int
    {
        $mimeType = $file->getMimeType();

        if (str_starts_with($mimeType, 'image/')) {
            return config('messaging.max_image_size', self::MAX_IMAGE_SIZE);
        }

        return config('messaging.max_file_size', self::MAX_FILE_SIZE);
    }

    /**
     * Get allowed extensions for a file type.
     *
     * @param UploadedFile $file
     * @return array
     */
    private function getAllowedExtensionsForFile(UploadedFile $file): array
    {
        $mimeType = $file->getMimeType();

        if (str_starts_with($mimeType, 'image/')) {
            return self::ALLOWED_MIMES['images'];
        }

        if (str_starts_with($mimeType, 'video/')) {
            return self::ALLOWED_MIMES['videos'];
        }

        // For documents, check against common document extensions
        return self::ALLOWED_MIMES['documents'];
    }

    /**
     * Determine the file type category.
     *
     * @param UploadedFile $file
     * @return string
     */
    private function determineFileType(UploadedFile $file): string
    {
        $mimeType = $file->getMimeType();

        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        }

        if (str_starts_with($mimeType, 'video/')) {
            return 'video';
        }

        return 'file';
    }

    /**
     * Generate a storage path for the file.
     *
     * @param int $conversationId
     * @param int $messageId
     * @param UploadedFile $file
     * @return string
     */
    private function generateStoragePath(int $conversationId, int $messageId, UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid() . '.' . $extension;

        return "{$conversationId}/{$messageId}/{$filename}";
    }

    /**
     * Store an image file and potentially resize it.
     *
     * @param UploadedFile $file
     * @param string $path
     * @return string|null
     */
    private function storeImage(UploadedFile $file, string $path): ?string
    {
        try {
            // For MVP, just store the original image
            // In the future, you could resize large images here
            return $file->storeAs($this->basePath, $path, $this->disk);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Generate a thumbnail for an image.
     *
     * @param UploadedFile $file
     * @param string $originalPath
     * @return string|null
     */
    private function generateThumbnail(UploadedFile $file, string $originalPath): ?string
    {
        try {
            // For MVP, skip thumbnail generation to avoid Intervention Image dependency
            // In the future, you could generate thumbnails here
            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get image dimensions.
     *
     * @param UploadedFile $file
     * @return array|null
     */
    private function getImageDimensions(UploadedFile $file): ?array
    {
        try {
            $imageInfo = getimagesize($file->getRealPath());
            if ($imageInfo) {
                return [
                    'width' => $imageInfo[0],
                    'height' => $imageInfo[1]
                ];
            }
        } catch (\Exception $e) {
            // Ignore errors
        }

        return null;
    }
}
