<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Http\Resources\Supervision\PotentialSupervisorResource;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\PotentialSupervisor;
use App\Services\Supervision\SupervisionShortlistService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ShortlistController extends Controller
{
    public function __construct(protected SupervisionShortlistService $shortlistService)
    {
        $this->middleware('auth');
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $student = $this->resolveStudent($request);

        $items = PotentialSupervisor::with([
            'academician.user.academician',
            'academician.faculty',
            'academician.universityDetails'
        ])
            ->where('student_id', $student->postgraduate_id)
            ->get();

        return PotentialSupervisorResource::collection($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'academician_id' => ['required', 'string'],
            'postgraduate_program_id' => ['nullable', 'exists:postgraduate_programs,id'],
        ]);

        $student = $this->resolveStudent($request);
        $academician = Academician::where('academician_id', $data['academician_id'])->firstOrFail();

        $shortlist = $this->shortlistService->addToShortlist($student, $academician, $data['postgraduate_program_id'] ?? null);

        return new PotentialSupervisorResource($shortlist->load([
            'academician.user.academician',
            'academician.faculty',
            'academician.universityDetails'
        ]));
    }

    public function destroy(Request $request, string $academicianId)
    {
        $student = $this->resolveStudent($request);
        $academician = Academician::where('academician_id', $academicianId)->firstOrFail();

        $this->shortlistService->removeFromShortlist($student, $academician);

        return response()->json(['success' => true]);
    }

    protected function resolveStudent(Request $request): Postgraduate
    {
        $user = $request->user();
        if (!$user->postgraduate) {
            throw ValidationException::withMessages([
                'student' => __('Only postgraduates can manage supervision shortlists.'),
            ]);
        }

        return $user->postgraduate;
    }
}

