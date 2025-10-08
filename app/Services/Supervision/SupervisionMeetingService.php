<?php

namespace App\Services\Supervision;

use App\Models\SupervisionRelationship;
use App\Models\SupervisionRequest;
use App\Models\SupervisionMeeting;
use App\Models\User;
use App\Notifications\Supervision\MeetingScheduled;
use App\Notifications\Supervision\MeetingUpdated;
use App\Notifications\Supervision\MeetingCancelled;
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
            $meeting = SupervisionMeeting::create([
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

            // Load relationships for notification
            $meeting->load('relationship.student', 'relationship.academician');

            // Notify the other party
            $isSupervisor = $relationship->academician->user?->id === $user->id;
            if ($isSupervisor) {
                $relationship->student->user?->notify(new MeetingScheduled($meeting));
            } else {
                $relationship->academician->user?->notify(new MeetingScheduled($meeting));
            }

            return $meeting;
        });
    }

    /**
     * Schedule a meeting during the request phase (before acceptance)
     */
    public function scheduleForRequest(SupervisionRequest $request, User $user, array $data): SupervisionMeeting
    {
        // Check if user is either the supervisor or the student in this request
        $isSupervisor = $request->academician->user?->id === $user->id;
        $isStudent = $request->student->user?->id === $user->id;

        if (!$isSupervisor && !$isStudent) {
            throw ValidationException::withMessages([
                'supervision_request_id' => __('You can only schedule meetings for your own supervision requests.'),
            ]);
        }

        // Only allow scheduling for pending or pending_student_acceptance statuses
        if (!in_array($request->status, [
            SupervisionRequest::STATUS_PENDING,
            SupervisionRequest::STATUS_PENDING_STUDENT_ACCEPTANCE
        ])) {
            throw ValidationException::withMessages([
                'status' => __('Meetings can only be scheduled for active requests.'),
            ]);
        }

        return DB::transaction(function () use ($request, $user, $data) {
            $meeting = SupervisionMeeting::create([
                'supervision_request_id' => $request->id,
                'supervision_relationship_id' => null, // No relationship yet
                'title' => $data['title'],
                'scheduled_for' => $data['scheduled_for'],
                'location_link' => $data['location_link'],
                'agenda' => $data['agenda'] ?? null,
                'attachments' => $data['attachments'] ?? [],
                'external_event_id' => $data['external_event_id'] ?? null,
                'external_provider' => $data['external_provider'] ?? null,
                'created_by' => $user->id,
            ]);

            // Load relationships for notification
            $meeting->load('request.student', 'request.academician');

            // Notify the other party
            $isSupervisor = $request->academician->user?->id === $user->id;
            if ($isSupervisor) {
                $request->student->user?->notify(new MeetingScheduled($meeting));
            } else {
                $request->academician->user?->notify(new MeetingScheduled($meeting));
            }

            return $meeting;
        });
    }

    /**
     * Update an existing meeting
     */
    public function update(SupervisionMeeting $meeting, User $user, array $data): SupervisionMeeting
    {
        // Determine relationship/request
        $relationship = $meeting->relationship;
        $request = $meeting->request;

        // Check authorization
        $isAuthorized = false;
        if ($relationship) {
            $isAuthorized = $relationship->academician->user?->id === $user->id || 
                           $relationship->student->user?->id === $user->id;
        } elseif ($request) {
            $isAuthorized = $request->academician->user?->id === $user->id || 
                           $request->student->user?->id === $user->id;
        }

        if (!$isAuthorized) {
            throw ValidationException::withMessages([
                'meeting' => __('You can only update your own meetings.'),
            ]);
        }

        return DB::transaction(function () use ($meeting, $user, $data, $relationship, $request) {
            // Track changes
            $changes = [];
            if (isset($data['scheduled_for']) && $data['scheduled_for'] != $meeting->scheduled_for) {
                $changes['scheduled_for'] = [
                    'from' => $meeting->scheduled_for->format('Y-m-d H:i'),
                    'to' => \Carbon\Carbon::parse($data['scheduled_for'])->format('Y-m-d H:i'),
                ];
            }
            if (isset($data['location_link']) && $data['location_link'] != $meeting->location_link) {
                $changes['location'] = [
                    'from' => $meeting->location_link,
                    'to' => $data['location_link'],
                ];
            }

            // Update meeting
            $meeting->update([
                'title' => $data['title'] ?? $meeting->title,
                'scheduled_for' => $data['scheduled_for'] ?? $meeting->scheduled_for,
                'location_link' => $data['location_link'] ?? $meeting->location_link,
                'agenda' => $data['agenda'] ?? $meeting->agenda,
            ]);

            // Notify the other party if there are changes
            if (!empty($changes)) {
                $meeting->load('relationship.student', 'relationship.academician', 'request.student', 'request.academician');
                
                if ($relationship) {
                    $isSupervisor = $relationship->academician->user?->id === $user->id;
                    if ($isSupervisor) {
                        $relationship->student->user?->notify(new MeetingUpdated($meeting, $changes));
                    } else {
                        $relationship->academician->user?->notify(new MeetingUpdated($meeting, $changes));
                    }
                } elseif ($request) {
                    $isSupervisor = $request->academician->user?->id === $user->id;
                    if ($isSupervisor) {
                        $request->student->user?->notify(new MeetingUpdated($meeting, $changes));
                    } else {
                        $request->academician->user?->notify(new MeetingUpdated($meeting, $changes));
                    }
                }
            }

            return $meeting;
        });
    }

    /**
     * Cancel/delete a meeting
     */
    public function cancel(SupervisionMeeting $meeting, User $user): void
    {
        // Determine relationship/request
        $relationship = $meeting->relationship;
        $request = $meeting->request;

        // Check authorization
        $isAuthorized = false;
        if ($relationship) {
            $isAuthorized = $relationship->academician->user?->id === $user->id || 
                           $relationship->student->user?->id === $user->id;
        } elseif ($request) {
            $isAuthorized = $request->academician->user?->id === $user->id || 
                           $request->student->user?->id === $user->id;
        }

        if (!$isAuthorized) {
            throw ValidationException::withMessages([
                'meeting' => __('You can only cancel your own meetings.'),
            ]);
        }

        DB::transaction(function () use ($meeting, $user, $relationship, $request) {
            // Load relationships before deletion
            $meeting->load('relationship.student', 'relationship.academician', 'request.student', 'request.academician');

            // Store meeting data for notification (since model will be deleted)
            $meetingData = [
                'id' => $meeting->id,
                'title' => $meeting->title,
                'scheduled_for' => $meeting->scheduled_for,
                'location_link' => $meeting->location_link,
                'relationship_id' => $meeting->supervision_relationship_id,
                'request_id' => $meeting->supervision_request_id,
                'relationship' => $meeting->relationship,
                'request' => $meeting->request,
            ];

            // Delete meeting
            $meeting->delete();

            // Notify the other party
            if ($relationship) {
                $isSupervisor = $relationship->academician->user?->id === $user->id;
                if ($isSupervisor) {
                    $relationship->student->user?->notify(new MeetingCancelled($meetingData));
                } else {
                    $relationship->academician->user?->notify(new MeetingCancelled($meetingData));
                }
            } elseif ($request) {
                $isSupervisor = $request->academician->user?->id === $user->id;
                if ($isSupervisor) {
                    $request->student->user?->notify(new MeetingCancelled($meetingData));
                } else {
                    $request->academician->user?->notify(new MeetingCancelled($meetingData));
                }
            }
        });
    }
}

