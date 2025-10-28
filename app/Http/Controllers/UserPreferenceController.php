<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class UserPreferenceController extends Controller
{
    /**
     * Dismiss the feedback bubble for the current session.
     * This will hide the bubble until the user logs out or the session expires.
     */
    public function dismissFeedbackBubble(Request $request)
    {
        $request->validate([
            'type' => 'required|in:session,permanent'
        ]);

        if ($request->type === 'session') {
            // Store in Laravel session - will be cleared on logout
            Session::put('feedback_bubble_dismissed', true);
        }
        // For 'permanent', we let the frontend handle it with localStorage

        return response()->json([
            'success' => true,
            'message' => 'Feedback bubble dismissed successfully'
        ]);
    }

    /**
     * Check if feedback bubble should be shown.
     * Used for initial page load verification.
     */
    public function getFeedbackBubbleStatus()
    {
        return response()->json([
            'dismissed' => Session::get('feedback_bubble_dismissed', false)
        ]);
    }
}

