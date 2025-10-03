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
                ->get();
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
                ->get();
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
            'activeUnbindRequest'
        ]);
        return new SupervisionRelationshipResource($relationship);
    }
}

