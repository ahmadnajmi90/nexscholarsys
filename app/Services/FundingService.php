<?php

namespace App\Services;

use App\Models\PostGrant;
use App\Models\PostScholarship;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FundingService
{
    /**
     * Create a new grant
     *
     * @param array $data
     * @return PostGrant
     */
    public function createGrant(array $data): PostGrant
    {
        Log::info('Creating grant with data:', $data);

        // Handle tags JSON encoding
        if (isset($data['tags']) && is_array($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            $destinationPath = public_path('storage/grant_images');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $image = $data['image'];
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move($destinationPath, $imageName);
            $data['image'] = 'grant_images/' . $imageName;
        }

        // Handle attachment upload
        if (isset($data['attachment']) && $data['attachment'] instanceof \Illuminate\Http\UploadedFile) {
            $destinationPath = public_path('storage/grant_attachments');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $attachment = $data['attachment'];
            $attachmentName = time() . '_' . $attachment->getClientOriginalName();
            $attachment->move($destinationPath, $attachmentName);
            $data['attachment'] = 'grant_attachments/' . $attachmentName;
        }

        // Handle grant theme JSON encoding
        if (isset($data['grant_theme']) && is_string($data['grant_theme'])) {
            $data['grant_theme'] = json_decode($data['grant_theme'], true);
        }

        Log::info('Processed data for grant creation:', $data);
        return Auth::user()->postGrants()->create($data);
    }

    /**
     * Update an existing grant
     *
     * @param PostGrant $grant
     * @param array $data
     * @return PostGrant
     */
    public function updateGrant(PostGrant $grant, array $data): PostGrant
    {
        Log::info('Updating grant with data:', $data);

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old image
            if ($grant->image) {
                $oldImagePath = public_path('storage/' . $grant->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $imageDestination = public_path('storage/grant_images');
            if (!file_exists($imageDestination)) {
                mkdir($imageDestination, 0755, true);
            }
            $image = $data['image'];
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move($imageDestination, $imageName);
            $data['image'] = 'grant_images/' . $imageName;
        } else {
            $data['image'] = $grant->image;
        }

        // Handle attachment upload
        if (isset($data['attachment']) && $data['attachment'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old attachment
            if ($grant->attachment) {
                $oldAttachmentPath = public_path('storage/' . $grant->attachment);
                if (file_exists($oldAttachmentPath)) {
                    unlink($oldAttachmentPath);
                }
            }

            $attachmentDestination = public_path('storage/grant_attachments');
            if (!file_exists($attachmentDestination)) {
                mkdir($attachmentDestination, 0755, true);
            }
            $attachment = $data['attachment'];
            $attachmentName = time() . '_' . $attachment->getClientOriginalName();
            $attachment->move($attachmentDestination, $attachmentName);
            $data['attachment'] = 'grant_attachments/' . $attachmentName;
        } else {
            $data['attachment'] = $grant->attachment;
        }

        // Handle grant theme JSON encoding
        if (isset($data['grant_theme']) && is_string($data['grant_theme'])) {
            $data['grant_theme'] = json_decode($data['grant_theme'], true);
        }

        Log::info('Processed data for grant update:', $data);
        $grant->update($data);
        return $grant;
    }

    /**
     * Delete a grant
     *
     * @param PostGrant $grant
     * @return bool
     */
    public function deleteGrant(PostGrant $grant): bool
    {
        Log::info('Deleting grant:', ['id' => $grant->id]);

        // Delete associated files
        if ($grant->image) {
            $imagePath = public_path('storage/' . $grant->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        if ($grant->attachment) {
            $attachmentPath = public_path('storage/' . $grant->attachment);
            if (file_exists($attachmentPath)) {
                unlink($attachmentPath);
            }
        }

        return $grant->delete();
    }

    /**
     * Create a new scholarship
     *
     * @param array $data
     * @return PostScholarship
     */
    public function createScholarship(array $data): PostScholarship
    {
        Log::info('Creating scholarship with data:', $data);

        // Handle tags JSON encoding
        if (isset($data['tags']) && is_array($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            $destinationPath = public_path('storage/scholarship_images');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $image = $data['image'];
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move($destinationPath, $imageName);
            $data['image'] = 'scholarship_images/' . $imageName;
        }

        // Handle attachment upload
        if (isset($data['attachment']) && $data['attachment'] instanceof \Illuminate\Http\UploadedFile) {
            $destinationPath = public_path('storage/scholarship_attachments');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $attachment = $data['attachment'];
            $attachmentName = time() . '_' . $attachment->getClientOriginalName();
            $attachment->move($destinationPath, $attachmentName);
            $data['attachment'] = 'scholarship_attachments/' . $attachmentName;
        }

        // Handle scholarship theme JSON encoding
        if (isset($data['scholarship_theme']) && is_string($data['scholarship_theme'])) {
            $data['scholarship_theme'] = json_decode($data['scholarship_theme'], true);
        }

        Log::info('Processed data for scholarship creation:', $data);
        return Auth::user()->postScholarships()->create($data);
    }

    /**
     * Update an existing scholarship
     *
     * @param PostScholarship $scholarship
     * @param array $data
     * @return PostScholarship
     */
    public function updateScholarship(PostScholarship $scholarship, array $data): PostScholarship
    {
        Log::info('Updating scholarship with data:', $data);

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old image
            if ($scholarship->image) {
                $oldImagePath = public_path('storage/' . $scholarship->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $imageDestination = public_path('storage/scholarship_images');
            if (!file_exists($imageDestination)) {
                mkdir($imageDestination, 0755, true);
            }
            $image = $data['image'];
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move($imageDestination, $imageName);
            $data['image'] = 'scholarship_images/' . $imageName;
        } else {
            $data['image'] = $scholarship->image;
        }

        // Handle attachment upload
        if (isset($data['attachment']) && $data['attachment'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old attachment
            if ($scholarship->attachment) {
                $oldAttachmentPath = public_path('storage/' . $scholarship->attachment);
                if (file_exists($oldAttachmentPath)) {
                    unlink($oldAttachmentPath);
                }
            }

            $attachmentDestination = public_path('storage/scholarship_attachments');
            if (!file_exists($attachmentDestination)) {
                mkdir($attachmentDestination, 0755, true);
            }
            $attachment = $data['attachment'];
            $attachmentName = time() . '_' . $attachment->getClientOriginalName();
            $attachment->move($attachmentDestination, $attachmentName);
            $data['attachment'] = 'scholarship_attachments/' . $attachmentName;
        } else {
            $data['attachment'] = $scholarship->attachment;
        }

        // Handle scholarship theme JSON encoding
        if (isset($data['scholarship_theme']) && is_string($data['scholarship_theme'])) {
            $data['scholarship_theme'] = json_decode($data['scholarship_theme'], true);
        }

        Log::info('Processed data for scholarship update:', $data);
        $scholarship->update($data);
        return $scholarship;
    }

    /**
     * Delete a scholarship
     *
     * @param PostScholarship $scholarship
     * @return bool
     */
    public function deleteScholarship(PostScholarship $scholarship): bool
    {
        Log::info('Deleting scholarship:', ['id' => $scholarship->id]);

        // Delete associated files
        if ($scholarship->image) {
            $imagePath = public_path('storage/' . $scholarship->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        if ($scholarship->attachment) {
            $attachmentPath = public_path('storage/' . $scholarship->attachment);
            if (file_exists($attachmentPath)) {
                unlink($attachmentPath);
            }
        }

        return $scholarship->delete();
    }
} 