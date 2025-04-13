<?php

namespace App\Http\Controllers;

use App\Models\Academician;
use App\Models\AcademicianRecommendation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AcademicianRecommendationController extends Controller
{
    /**
     * Show the recommendation form for an academician.
     *
     * @param  string  $academicianId
     * @return \Inertia\Response
     */
    public function showForm($academicianId)
    {
        $academician = Academician::where('academician_id', $academicianId)->firstOrFail();
        $hasRecommended = false;
        
        if (Auth::check()) {
            $hasRecommended = AcademicianRecommendation::hasRecommended($academicianId, Auth::id());
        } else {
            $hasRecommended = AcademicianRecommendation::hasRecommended($academicianId, null, request()->ip());
        }
        
        return Inertia::render('Recommendation/Form', [
            'academician' => $academician,
            'hasRecommended' => $hasRecommended,
        ]);
    }
    
    /**
     * Store a new recommendation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'academician_id' => 'required|exists:academicians,academician_id',
            'communication_comment' => 'nullable|string|max:500',
            'support_comment' => 'nullable|string|max:500',
            'expertise_comment' => 'nullable|string|max:500',
            'responsiveness_comment' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Check that at least one comment is provided
        if (empty(trim($request->input('communication_comment'))) &&
            empty(trim($request->input('support_comment'))) &&
            empty(trim($request->input('expertise_comment'))) &&
            empty(trim($request->input('responsiveness_comment')))) {
            return response()->json([
                'error' => 'Please provide at least one comment.'
            ], 422);
        }
        
        $academicianId = $request->input('academician_id');
        $userId = Auth::check() ? Auth::id() : null;
        $ipAddress = Auth::check() ? null : request()->ip();
        
        // Check if user has already recommended
        if (AcademicianRecommendation::hasRecommended($academicianId, $userId, $ipAddress)) {
            return response()->json([
                'error' => 'You have already recommended this academician.'
            ], 422);
        }
        
        // Create the recommendation
        $recommendation = new AcademicianRecommendation([
            'academician_id' => $academicianId,
            'user_id' => $userId,
            'ip_address' => $ipAddress,
            'communication_comment' => $request->input('communication_comment'),
            'support_comment' => $request->input('support_comment'),
            'expertise_comment' => $request->input('expertise_comment'),
            'responsiveness_comment' => $request->input('responsiveness_comment'),
        ]);
        
        $recommendation->save();
        
        return response()->json([
            'message' => 'Recommendation submitted successfully.',
            'recommendation' => $recommendation
        ]);
    }
    
    /**
     * Get recommendations for an academician.
     *
     * @param  string  $academicianId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRecommendations($academicianId)
    {
        $academician = Academician::where('academician_id', $academicianId)->firstOrFail();
        $ratings = $academician->getRecommendationRatings();
        
        // Fetch all recommendations with comments for this academician
        $recommendations = AcademicianRecommendation::where('academician_id', $academicianId)
            ->get()
            ->map(function ($recommendation) {
                return [
                    'communication_comment' => $recommendation->communication_comment,
                    'support_comment' => $recommendation->support_comment,
                    'expertise_comment' => $recommendation->expertise_comment,
                    'responsiveness_comment' => $recommendation->responsiveness_comment,
                    'created_at' => $recommendation->created_at
                ];
            });
        
        return response()->json([
            'academician' => $academician->only(['academician_id', 'full_name']),
            'ratings' => $ratings,
            'recommendations' => $recommendations
        ]);
    }
}
