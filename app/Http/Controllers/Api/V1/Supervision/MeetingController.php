<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionRelationship;
use App\Models\SupervisionRequest;
use App\Models\SupervisionMeeting;
use App\Services\Supervision\SupervisionMeetingService;
use App\Http\Requests\Supervision\ScheduleMeetingRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MeetingController extends Controller
{
    public function __construct(protected SupervisionMeetingService $meetingService)
    {
        $this->middleware('auth');
    }

    public function store(ScheduleMeetingRequest $request, SupervisionRelationship $relationship)
    {
        $data = $request->validated();

        $meeting = $this->meetingService->schedule($relationship, $request->user(), $data);

        return response()->json([
            'success' => true,
            'meeting' => $meeting,
        ], 201);
    }

    /**
     * Schedule a meeting during the request phase (before acceptance)
     */
    public function storeForRequest(Request $request, SupervisionRequest $supervisionRequest)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'scheduled_for' => ['required', 'date'],
            'location_link' => ['required', 'string', 'max:255'],
            'agenda' => ['nullable', 'string'],
            'attachments' => ['nullable', 'array'],
        ]);

        $meeting = $this->meetingService->scheduleForRequest($supervisionRequest, $request->user(), $data);

        return response()->json([
            'success' => true,
            'message' => 'Meeting scheduled successfully',
            'meeting' => $meeting,
        ], 201);
    }

    /**
     * Update an existing meeting
     */
    public function update(Request $request, SupervisionMeeting $meeting)
    {
        // Authorize
        $this->authorize('update', $meeting);

        // Validate
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'scheduled_for' => ['sometimes', 'date', 'after:now'],
            'location_link' => ['sometimes', 'string', 'max:255'],
            'agenda' => ['nullable', 'string'],
        ]);

        // Update using service
        $updated = $this->meetingService->update($meeting, $request->user(), $data);

        return response()->json([
            'success' => true,
            'message' => 'Meeting updated successfully',
            'meeting' => $updated,
        ]);
    }

    /**
     * Cancel/delete a meeting
     */
    public function destroy(Request $request, SupervisionMeeting $meeting)
    {
        // Authorize
        $this->authorize('delete', $meeting);

        // Cancel using service
        $this->meetingService->cancel($meeting, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Meeting cancelled successfully',
        ]);
    }
}

