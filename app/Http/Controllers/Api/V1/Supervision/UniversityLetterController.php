<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionRelationship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UniversityLetterController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function upload(Request $request, SupervisionRelationship $relationship)
    {
        // Authorization: only the student can upload the letter
        $user = $request->user();
        if (!$user->postgraduate || $user->postgraduate->postgraduate_id !== $relationship->student_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only the student can upload the university letter.',
            ], 403);
        }

        $request->validate([
            'letter' => 'required|file|mimes:pdf|max:10240', // Max 10MB
        ]);

        try {
            // Delete old letter if exists
            if ($relationship->university_letter_path) {
                Storage::disk('public')->delete($relationship->university_letter_path);
            }

            // Store the new letter
            $file = $request->file('letter');
            $filename = 'university_letter_' . $relationship->id . '_' . time() . '.pdf';
            $path = $file->storeAs('supervision/university_letters', $filename, 'public');

            // Update the relationship
            $relationship->update([
                'university_letter_path' => $path,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'University letter uploaded successfully',
                'data' => [
                    'university_letter_path' => $path,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload university letter',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function download(SupervisionRelationship $relationship)
    {
        // Authorization: both student and supervisor can download
        $user = request()->user();
        $isStudent = $user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id;
        $isSupervisor = $user->academician && $user->academician->academician_id === $relationship->academician_id;

        if (!$isStudent && !$isSupervisor) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to download this letter.',
            ], 403);
        }

        if (!$relationship->university_letter_path) {
            return response()->json([
                'success' => false,
                'message' => 'No university letter uploaded yet.',
            ], 404);
        }

        if (!Storage::disk('public')->exists($relationship->university_letter_path)) {
            return response()->json([
                'success' => false,
                'message' => 'Letter file not found.',
            ], 404);
        }

        return response()->download(
            storage_path('app/public/' . $relationship->university_letter_path),
            basename($relationship->university_letter_path)
        );
    }

    public function delete(Request $request, SupervisionRelationship $relationship)
    {
        // Authorization: only the student can delete
        $user = $request->user();
        if (!$user->postgraduate || $user->postgraduate->postgraduate_id !== $relationship->student_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only the student can delete the university letter.',
            ], 403);
        }

        if (!$relationship->university_letter_path) {
            return response()->json([
                'success' => false,
                'message' => 'No university letter to delete.',
            ], 404);
        }

        try {
            // Delete the file
            Storage::disk('public')->delete($relationship->university_letter_path);

            // Update the relationship
            $relationship->update([
                'university_letter_path' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'University letter deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete university letter',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
