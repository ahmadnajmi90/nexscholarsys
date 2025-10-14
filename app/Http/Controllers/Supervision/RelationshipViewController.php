<?php

namespace App\Http\Controllers\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionRelationship;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RelationshipViewController extends Controller
{
    /**
     * Show the full-page view for a supervision relationship
     */
    public function show(Request $request, SupervisionRelationship $relationship)
    {
        $user = $request->user();

        // Authorization: Only supervisor or student can view
        $isSupervisor = $user->academician && $user->academician->academician_id === $relationship->academician_id;
        $isStudent = $user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id;

        if (!$isSupervisor && !$isStudent) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        // Load all necessary relationships
        $relationship->load([
            'student.user',
            'student.universityDetails',
            'student.faculty',
            'academician.user',
            'academician.universityDetails',
            'academician.faculty',
            'meetings',
            'notes',
            'onboardingChecklistItems',
            'researchDetail.milestones.creator',
            'documents.currentVersion.uploader',
            'documents.versions.uploader',
            'unbindRequests',
            'activeUnbindRequest',
        ]);

        return Inertia::render('Supervision/RelationshipFullPage', [
            'relationship' => $relationship,
            'userRole' => $isSupervisor ? 'supervisor' : 'student',
        ]);
    }
}

