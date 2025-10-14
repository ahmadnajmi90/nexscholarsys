<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionRequest;
use App\Services\Supervision\AbstractService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AbstractController extends Controller
{
    protected AbstractService $abstractService;

    public function __construct(AbstractService $abstractService)
    {
        $this->middleware('auth');
        $this->abstractService = $abstractService;
    }

    /**
     * Get abstract for a supervision request
     */
    public function show(Request $apiRequest, SupervisionRequest $supervisionRequest)
    {
        $user = $apiRequest->user();
        
        // Authorization: Student owns the request OR supervisor is the recipient
        if (!$this->canAccessRequest($user, $supervisionRequest)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this abstract',
            ], 403);
        }

        $abstract = $this->abstractService->getAbstract($supervisionRequest->id);

        return response()->json([
            'success' => true,
            'data' => $abstract ? [
                'id' => $abstract->id,
                'abstract' => $abstract->abstract,
                'extraction_status' => $abstract->extraction_status,
                'source_file' => $abstract->source_file,
                'extraction_error' => $abstract->extraction_error,
                'created_at' => $abstract->created_at,
                'updated_at' => $abstract->updated_at,
            ] : null,
        ]);
    }

    /**
     * Update abstract manually (student only)
     */
    public function update(Request $apiRequest, SupervisionRequest $supervisionRequest)
    {
        $user = $apiRequest->user();
        
        // Log only safe fields
        Log::info('AbstractController update called', [
            'request_id' => $supervisionRequest->id,
            'request_student_id' => $supervisionRequest->student_id,
            'request_status' => $supervisionRequest->status,
            'user_id' => $user->id,
        ]);
        
        // Load the postgraduate relationship if not loaded
        if (!$user->relationLoaded('postgraduate')) {
            $user->load('postgraduate');
        }
        
        // Authorization: Only the student who owns the request can edit
        if (!$user->postgraduate) {
            Log::warning('User has no postgraduate profile', ['user_id' => $user->id]);
            return response()->json([
                'success' => false,
                'message' => 'Only postgraduate students can edit the abstract',
            ], 403);
        }
        
        // Check if request has a student_id
        if (is_null($supervisionRequest->student_id)) {
            Log::error('Supervision request has no student_id', [
                'request_id' => $supervisionRequest->id,
                'user_id' => $user->id,
                'user_postgraduate_id' => $user->postgraduate->postgraduate_id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'This request has no associated student. Please contact support.',
            ], 400);
        }
        
        if ($user->postgraduate->postgraduate_id !== $supervisionRequest->student_id) {
            Log::warning('Student ID mismatch', [
                'user_id' => $user->id,
                'user_postgraduate_id' => $user->postgraduate->postgraduate_id,
                'request_student_id' => $supervisionRequest->student_id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Only the student who owns this request can edit the abstract',
            ], 403);
        }

        // Validate
        $validated = $apiRequest->validate([
            'abstract' => [
                'required', 
                'string', 
                'min:' . config('abstracts.min_length'), 
                'max:' . config('abstracts.max_length')
            ],
        ]);

        try {
            $abstract = $this->abstractService->updateManually($supervisionRequest->id, $validated['abstract']);

            return response()->json([
                'success' => true,
                'message' => 'Abstract updated successfully',
                'data' => [
                    'id' => $abstract->id,
                    'abstract' => $abstract->abstract,
                    'extraction_status' => $abstract->extraction_status,
                    'source_file' => $abstract->source_file,
                    'extraction_error' => $abstract->extraction_error,
                    'updated_at' => $abstract->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating abstract', [
                'request_id' => $supervisionRequest->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update abstract',
            ], 500);
        }
    }

    /**
     * Retry abstract extraction (student only)
     */
    public function retry(Request $apiRequest, SupervisionRequest $supervisionRequest)
    {
        $user = $apiRequest->user();
        
        // Load the postgraduate relationship if not loaded
        if (!$user->relationLoaded('postgraduate')) {
            $user->load('postgraduate');
        }
        
        // Authorization: Only the student who owns the request can retry
        if (!$user->postgraduate || $user->postgraduate->postgraduate_id !== $supervisionRequest->student_id) {
            return response()->json([
                'success' => false,
                'message' => 'Only the student can retry extraction',
            ], 403);
        }

        try {
            $abstract = $this->abstractService->retryExtraction($supervisionRequest->id);

            if (!$abstract) {
                return response()->json([
                    'success' => false,
                    'message' => 'No proposal attachment found to extract from',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => $abstract->extraction_status === 'extracted' 
                    ? 'Abstract extracted successfully' 
                    : 'Extraction completed but abstract not found. Please enter manually.',
                'data' => [
                    'id' => $abstract->id,
                    'abstract' => $abstract->abstract,
                    'extraction_status' => $abstract->extraction_status,
                    'source_file' => $abstract->source_file,
                    'extraction_error' => $abstract->extraction_error,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrying abstract extraction', [
                'request_id' => $supervisionRequest->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retry extraction',
            ], 500);
        }
    }

    /**
     * Check if user can access the request
     */
    protected function canAccessRequest($user, SupervisionRequest $supervisionRequest): bool
    {
        // Student owns the request
        if ($user->postgraduate && $user->postgraduate->postgraduate_id === $supervisionRequest->student_id) {
            return true;
        }

        // Supervisor is the recipient
        if ($user->academician && $user->academician->academician_id === $supervisionRequest->academician_id) {
            return true;
        }

        return false;
    }
}

