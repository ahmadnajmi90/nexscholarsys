<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Http\Resources\Supervision\SupervisionRelationshipResource;
use App\Models\SupervisionRelationship;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RelationshipController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $perPage = $request->input('per_page', 20);

        // Allow supervisors to query by student_id (to see all supervisors of their student)
        if ($request->has('student_id') && $user->academician) {
            // Verify the supervisor has a relationship with this student
            $hasRelationship = SupervisionRelationship::where('student_id', $request->student_id)
                ->where('academician_id', $user->academician->academician_id)
                ->exists();

            if (!$hasRelationship) {
                return SupervisionRelationshipResource::collection(collect());
            }

            $relationships = SupervisionRelationship::with([
                'student.user',
                'student.universityDetails',
                'student.faculty',
                'academician.user',
                'academician.universityDetails',
                'academician.faculty',
                'meetings',
                'onboardingChecklistItems',
                'documents',
                'unbindRequests',
                'activeUnbindRequest'
            ])
                ->where('student_id', $request->student_id)
                ->paginate($perPage);

            return SupervisionRelationshipResource::collection($relationships);
        }

        if ($user->postgraduate) {
            $relationships = SupervisionRelationship::with([
                'academician.user',
                'academician.universityDetails',
                'academician.faculty',
                'student.universityDetails',
                'student.faculty',
                'meetings',
                'onboardingChecklistItems',
                'documents',
                'unbindRequests',
                'activeUnbindRequest'
            ])
                ->where('student_id', $user->postgraduate->postgraduate_id)
                ->paginate($perPage);
        } elseif ($user->academician) {
            $relationships = SupervisionRelationship::with([
                'student.user',
                'student.universityDetails',
                'student.faculty',
                'academician.universityDetails',
                'academician.faculty',
                'meetings',
                'onboardingChecklistItems',
                'documents',
                'unbindRequests',
                'activeUnbindRequest'
            ])
                ->where('academician_id', $user->academician->academician_id)
                ->paginate($perPage);
        } else {
            $relationships = collect();
        }

        return SupervisionRelationshipResource::collection($relationships);
    }

    public function show(SupervisionRelationship $relationship)
    {
        $relationship->load([
            'student.user',
            'student.universityDetails',
            'student.faculty',
            'academician.user',
            'academician.universityDetails',
            'academician.faculty',
            'meetings',
            'onboardingChecklistItems',
            'notes',
            'unbindRequests',
            'activeUnbindRequest',
            'cosupervisors',
        ]);
        return new SupervisionRelationshipResource($relationship);
    }
}

