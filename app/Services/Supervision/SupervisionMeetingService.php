<?php

namespace App\Services\Supervision;

use App\Models\SupervisionRelationship;
use App\Models\SupervisionMeeting;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SupervisionMeetingService
{
    public function schedule(SupervisionRelationship $relationship, User $user, array $data): SupervisionMeeting
    {
        // Check if user is either the supervisor or the student in this relationship
        $isSupervisor = $relationship->academician->user?->id === $user->id;
        $isStudent = $relationship->student->user?->id === $user->id;

        if (!$isSupervisor && !$isStudent) {
            throw ValidationException::withMessages([
                'supervision_relationship_id' => __('You can only schedule meetings for your own supervision relationships.'),
            ]);
        }

        return DB::transaction(function () use ($relationship, $user, $data) {
            return SupervisionMeeting::create([
                'supervision_relationship_id' => $relationship->id,
                'title' => $data['title'],
                'scheduled_for' => $data['scheduled_for'],
                'location_link' => $data['location_link'],
                'agenda' => $data['agenda'] ?? null,
                'attachments' => $data['attachments'] ?? [],
                'external_event_id' => $data['external_event_id'] ?? null,
                'external_provider' => $data['external_provider'] ?? null,
                'created_by' => $user->id,
            ]);
        });
    }
}

