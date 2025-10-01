<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionRequest;
use App\Models\SupervisionRequestNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RequestNoteController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request, $requestId)
    {
        $supervisionRequest = SupervisionRequest::findOrFail($requestId);
        
        // Only the supervisor (academician) can view notes
        $user = Auth::user();
        if (!$user->academician || $supervisionRequest->academician_id !== $user->academician->academician_id) {
            abort(403, 'Unauthorized to view these notes.');
        }

        $notes = $supervisionRequest->notes()
            ->with('author')
            ->get();

        return response()->json(['data' => $notes]);
    }

    public function store(Request $request, $requestId)
    {
        $supervisionRequest = SupervisionRequest::findOrFail($requestId);
        
        // Only the supervisor (academician) can add notes
        $user = Auth::user();
        if (!$user->academician || $supervisionRequest->academician_id !== $user->academician->academician_id) {
            abort(403, 'Unauthorized to add notes.');
        }

        $validated = $request->validate([
            'note' => ['required', 'string', 'max:10000'],
        ]);

        $note = SupervisionRequestNote::create([
            'supervision_request_id' => $requestId,
            'author_id' => $user->id,
            'note' => $validated['note'],
        ]);

        return response()->json(['data' => $note->load('author')], 201);
    }

    public function update(Request $request, $requestId, $noteId)
    {
        $note = SupervisionRequestNote::findOrFail($noteId);
        
        // Only the author can update their note
        $user = Auth::user();
        if ($note->author_id !== $user->id) {
            abort(403, 'Unauthorized to update this note.');
        }

        $validated = $request->validate([
            'note' => ['required', 'string', 'max:10000'],
        ]);

        $note->update($validated);

        return response()->json(['data' => $note->fresh('author')]);
    }

    public function destroy($requestId, $noteId)
    {
        $note = SupervisionRequestNote::findOrFail($noteId);
        
        // Only the author can delete their note
        $user = Auth::user();
        if ($note->author_id !== $user->id) {
            abort(403, 'Unauthorized to delete this note.');
        }

        $note->delete();

        return response()->json(['success' => true]);
    }
}