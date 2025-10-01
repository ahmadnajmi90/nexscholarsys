<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionRelationship;
use App\Services\Supervision\SupervisionMeetingService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MeetingController extends Controller
{
    public function __construct(protected SupervisionMeetingService $meetingService)
    {
        $this->middleware('auth');
    }

    public function store(Request $request, SupervisionRelationship $relationship)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'scheduled_for' => ['required', 'date'],
            'location_link' => ['required', 'string', 'max:255'],
            'agenda' => ['nullable', 'string'],
            'attachments' => ['nullable', 'array'],
        ]);

        $meeting = $this->meetingService->schedule($relationship, $request->user(), $data);

        return response()->json([
            'success' => true,
            'meeting' => $meeting,
        ], 201);
    }
}

