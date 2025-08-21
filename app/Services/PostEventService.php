<?php

namespace App\Services;

use App\Models\PostEvent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PostEventService
{
    /**
     * Create a new event
     *
     * @param array $data
     * @return PostEvent
     */
    public function createEvent(array $data): PostEvent
    {
        Log::info('Creating event with data:', $data);

        // Handle theme JSON encoding
        if (isset($data['theme']) && is_array($data['theme'])) {
            $data['theme'] = json_encode($data['theme']);
        }

        // Handle target audience JSON encoding
        if (isset($data['target_audience']) && is_array($data['target_audience'])) {
            $data['target_audience'] = json_encode($data['target_audience']);
        }

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            $destinationPath = public_path('storage/event_images');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            $image = $data['image'];
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move($destinationPath, $imageName);
            $data['image'] = 'event_images/' . $imageName;
        }

        // Handle field of research JSON encoding
        if (isset($data['field_of_research']) && is_string($data['field_of_research'])) {
            $data['field_of_research'] = json_decode($data['field_of_research'], true);
        }

        Log::info('Processed data for event creation:', $data);
        return Auth::user()->postEvents()->create($data);
    }

    /**
     * Update an existing event
     *
     * @param PostEvent $event
     * @param array $data
     * @return PostEvent
     */
    public function updateEvent(PostEvent $event, array $data): PostEvent
    {
        Log::info('Updating event with data:', $data);

        // Handle image upload
        if (isset($data['image']) && $data['image'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old image
            if ($event->image) {
                $oldImagePath = public_path('storage/' . $event->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $imageDestination = public_path('storage/event_images');
            if (!file_exists($imageDestination)) {
                mkdir($imageDestination, 0755, true);
            }
            $image = $data['image'];
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move($imageDestination, $imageName);
            $data['image'] = 'event_images/' . $imageName;
        } else {
            $data['image'] = $event->image;
        }

        // Handle field of research JSON encoding
        if (!array_key_exists('field_of_research', $data)) {
            $data['field_of_research'] = null;
        } elseif (isset($data['field_of_research']) && is_string($data['field_of_research'])) {
            $decoded = json_decode($data['field_of_research'], true);
            if (empty($decoded)) {
                $data['field_of_research'] = null;
            } else {
                $data['field_of_research'] = $decoded;
            }
        }

        // Handle target audience JSON encoding
        if (isset($data['target_audience']) && is_array($data['target_audience'])) {
            $data['target_audience'] = json_encode($data['target_audience']);
        }

        Log::info('Processed data for event update:', $data);
        $event->update($data);
        return $event;
    }

    /**
     * Delete an event
     *
     * @param PostEvent $event
     * @return bool
     */
    public function deleteEvent(PostEvent $event): bool
    {
        Log::info('Deleting event:', ['id' => $event->id]);

        // Delete associated image
        if ($event->image) {
            $imagePath = public_path('storage/' . $event->image);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        return $event->delete();
    }
} 