<?php

namespace App\Services\Supervision;

use App\Models\SupervisionRelationship;
use App\Models\SupervisionMeeting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SupervisionMeetingService
{
    public function schedule(SupervisionRelationship $relationship, User $supervisor, array $data): SupervisionMeeting
    {
        if ($relationship->academician->user?->id !== $supervisor->id) {
            throw ValidationException::withMessages([
                'supervision_relationship_id' => __('Only the supervisor can schedule meetings.'),
            ]);
        }

        return DB::transaction(function () use ($relationship, $supervisor, $data) {
            return SupervisionMeeting::create([
                'supervision_relationship_id' => $relationship->id,
                'title' => $data['title'],
                'scheduled_for' => $data['scheduled_for'],
                'location_link' => $data['location_link'],
                'agenda' => $data['agenda'] ?? null,
                'attachments' => $data['attachments'] ?? [],
                'external_event_id' => $data['external_event_id'] ?? null,
                'external_provider' => $data['external_provider'] ?? null,
                'created_by' => $supervisor->id,
            ]);
        });
    }
}

