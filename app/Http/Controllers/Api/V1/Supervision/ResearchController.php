<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionRelationship;
use App\Models\SupervisionResearchDetail;
use App\Models\SupervisionMilestone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResearchController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get research details for a relationship
     */
    public function show(Request $request, SupervisionRelationship $relationship)
    {
        $user = $request->user();

        // Authorization: Only supervisor or student can view
        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        $researchDetail = $relationship->researchDetail()->with(['milestones.creator'])->first();

        // Create research detail if doesn't exist
        if (!$researchDetail) {
            $researchDetail = SupervisionResearchDetail::create([
                'relationship_id' => $relationship->id,
                'title' => null,
                'objectives' => [],
                'progress_percentage' => 0,
            ]);
            $researchDetail->load(['milestones.creator']);
        }

        return response()->json([
            'success' => true,
            'data' => $researchDetail,
        ]);
    }

    /**
     * Update research details
     */
    public function update(Request $request, SupervisionRelationship $relationship)
    {
        $user = $request->user();

        // Authorization: Only supervisor or student can update
        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:500'],
            'objectives' => ['nullable', 'array'],
            'objectives.*' => ['string', 'max:1000'],
            'progress_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'key_findings' => ['nullable', 'string', 'max:5000'],
            'literature_notes' => ['nullable', 'string', 'max:10000'],
            'methodology_notes' => ['nullable', 'string', 'max:10000'],
            'free_form_content' => ['nullable', 'string', 'max:50000'],
        ]);

        $researchDetail = $relationship->researchDetail()->firstOrCreate(
            ['relationship_id' => $relationship->id],
            ['title' => null, 'objectives' => [], 'progress_percentage' => 0]
        );

        $researchDetail->update($data);

        return response()->json([
            'success' => true,
            'message' => __('Research details updated successfully.'),
            'data' => $researchDetail->fresh(),
        ]);
    }

    /**
     * Create a new milestone
     */
    public function storeMilestone(Request $request, SupervisionRelationship $relationship)
    {
        $user = $request->user();

        // Authorization: Only supervisor or student can create milestones
        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'due_date' => ['nullable', 'date'],
            'order' => ['nullable', 'integer', 'min:0'],
        ]);

        return DB::transaction(function () use ($relationship, $data, $user) {
            $researchDetail = $relationship->researchDetail()->firstOrCreate(
                ['relationship_id' => $relationship->id],
                ['title' => null, 'objectives' => [], 'progress_percentage' => 0]
            );

            // If order not provided, put at end
            if (!isset($data['order'])) {
                $maxOrder = $researchDetail->milestones()->max('order') ?? 0;
                $data['order'] = $maxOrder + 1;
            }

            $milestone = SupervisionMilestone::create([
                'research_id' => $researchDetail->id,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'due_date' => $data['due_date'] ?? null,
                'order' => $data['order'],
                'created_by' => $user->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => __('Milestone created successfully.'),
                'data' => $milestone->load('creator'),
            ]);
        });
    }

    /**
     * Update a milestone
     */
    public function updateMilestone(Request $request, SupervisionMilestone $milestone)
    {
        $user = $request->user();
        $relationship = $milestone->researchDetail->relationship;

        // Authorization: Only supervisor or student can update milestones
        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'due_date' => ['nullable', 'date'],
            'completed' => ['sometimes', 'boolean'],
            'order' => ['sometimes', 'integer', 'min:0'],
        ]);

        // If marking as completed, set completed_at
        if (isset($data['completed']) && $data['completed'] && !$milestone->completed) {
            $data['completed_at'] = now();
        } elseif (isset($data['completed']) && !$data['completed']) {
            $data['completed_at'] = null;
        }

        $milestone->update($data);

        return response()->json([
            'success' => true,
            'message' => __('Milestone updated successfully.'),
            'data' => $milestone->fresh()->load('creator'),
        ]);
    }

    /**
     * Delete a milestone
     */
    public function destroyMilestone(Request $request, SupervisionMilestone $milestone)
    {
        $user = $request->user();
        $relationship = $milestone->researchDetail->relationship;

        // Authorization: Only supervisor or student can delete milestones
        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        $milestone->delete();

        return response()->json([
            'success' => true,
            'message' => __('Milestone deleted successfully.'),
        ]);
    }

    /**
     * Helper to check if user can access relationship (as supervisor or student)
     */
    protected function canAccessRelationship($user, SupervisionRelationship $relationship): bool
    {
        $isSupervisor = $user->academician && $user->academician->academician_id === $relationship->academician_id;
        $isStudent = $user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id;
        
        return $isSupervisor || $isStudent;
    }
}

