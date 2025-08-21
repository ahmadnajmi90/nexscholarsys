<?php

namespace App\Services;

use App\Models\CreatePost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CreatePostService
{
    /**
     * Create a new post
     *
     * @param array $data
     * @return CreatePost
     */
    public function createPost(array $data): CreatePost
    {
        Log::info('Creating post with data:', $data);

        // Handle tags JSON encoding
        if (isset($data['tags']) && is_array($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }

        // Handle multiple images upload
        if (isset($data['images']) && is_array($data['images'])) {
            $imagesPaths = [];
            foreach ($data['images'] as $image) {
                $destinationPath = public_path('storage/post_images');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move($destinationPath, $imageName);
                $imagesPaths[] = 'post_images/' . $imageName;
            }
            $data['images'] = json_encode($imagesPaths);
        }

        // Handle featured image upload
        if (isset($data['featured_image']) && $data['featured_image'] instanceof \Illuminate\Http\UploadedFile) {
            $destinationPath = public_path('storage/post_featured_images');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $featured_image = $data['featured_image'];
            $featured_imageName = time() . '_' . $featured_image->getClientOriginalName();
            $featured_image->move($destinationPath, $featured_imageName);
            $data['featured_image'] = 'post_featured_images/' . $featured_imageName;
        }

        // Handle attachment upload
        if (isset($data['attachment']) && $data['attachment'] instanceof \Illuminate\Http\UploadedFile) {
            $destinationPath = public_path('storage/post_attachments');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $attachment = $data['attachment'];
            $attachmentName = time() . '_' . $attachment->getClientOriginalName();
            $attachment->move($destinationPath, $attachmentName);
            $data['attachment'] = 'post_attachments/' . $attachmentName;
        }

        Log::info('Processed data for post creation:', $data);
        return Auth::user()->createPosts()->create($data);
    }

    /**
     * Update an existing post
     *
     * @param CreatePost $post
     * @param array $data
     * @return CreatePost
     */
    public function updatePost(CreatePost $post, array $data): CreatePost
    {
        Log::info('Updating post with data:', $data);

        // Handle tags JSON encoding
        if (isset($data['tags']) && is_array($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }

        // Handle multiple images upload
        if (isset($data['images']) && is_array($data['images'])) {
            // Delete old images
            $existingImages = $post->images ? json_decode($post->images, true) : [];
            foreach ($existingImages as $oldImage) {
                $oldImagePath = public_path('storage/' . $oldImage);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            // Upload new images
            $newImages = [];
            foreach ($data['images'] as $image) {
                $destinationPath = public_path('storage/post_images');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move($destinationPath, $imageName);
                $newImages[] = 'post_images/' . $imageName;
            }
            $data['images'] = json_encode($newImages);
        } else {
            // Keep existing images
            $data['images'] = $post->images;
        }

        // Handle featured image upload
        if (isset($data['featured_image']) && $data['featured_image'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old featured image
            if ($post->featured_image) {
                $oldFeaturedPath = public_path('storage/' . $post->featured_image);
                if (file_exists($oldFeaturedPath)) {
                    unlink($oldFeaturedPath);
                }
            }

            $featuredDestination = public_path('storage/post_featured_images');
            if (!file_exists($featuredDestination)) {
                mkdir($featuredDestination, 0755, true);
            }
            $featured = $data['featured_image'];
            $featuredName = time() . '_' . $featured->getClientOriginalName();
            $featured->move($featuredDestination, $featuredName);
            $data['featured_image'] = 'post_featured_images/' . $featuredName;
        } else {
            $data['featured_image'] = $post->featured_image;
        }

        // Handle attachment upload
        if (isset($data['attachment']) && $data['attachment'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old attachment
            if ($post->attachment) {
                $oldAttachmentPath = public_path('storage/' . $post->attachment);
                if (file_exists($oldAttachmentPath)) {
                    unlink($oldAttachmentPath);
                }
            }

            $attachmentDestination = public_path('storage/post_attachments');
            if (!file_exists($attachmentDestination)) {
                mkdir($attachmentDestination, 0755, true);
            }
            $attachment = $data['attachment'];
            $attachmentName = time() . '_' . $attachment->getClientOriginalName();
            $attachment->move($attachmentDestination, $attachmentName);
            $data['attachment'] = 'post_attachments/' . $attachmentName;
        } else {
            $data['attachment'] = $post->attachment;
        }

        Log::info('Processed data for post update:', $data);
        $post->update($data);
        return $post;
    }

    /**
     * Delete a post
     *
     * @param CreatePost $post
     * @return bool
     */
    public function deletePost(CreatePost $post): bool
    {
        Log::info('Deleting post:', ['id' => $post->id]);

        // Delete associated files
        if ($post->images) {
            $images = json_decode($post->images, true);
            foreach ($images as $image) {
                $imagePath = public_path('storage/' . $image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }
        }

        if ($post->featured_image) {
            $featuredPath = public_path('storage/' . $post->featured_image);
            if (file_exists($featuredPath)) {
                unlink($featuredPath);
            }
        }

        if ($post->attachment) {
            $attachmentPath = public_path('storage/' . $post->attachment);
            if (file_exists($attachmentPath)) {
                unlink($attachmentPath);
            }
        }

        return $post->delete();
    }
} 