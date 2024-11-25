<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClickTracking;

class ClickTrackingController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'entity_type' => 'required|string|max:255',
            'entity_id' => 'required|integer',
            'action' => 'required|string|max:255',
        ]);

        // Create the click tracking entry
        ClickTracking::create([
            'user_id' => auth()->id(), // Authenticated user ID (nullable for guests)
            'entity_type' => $request->input('entity_type'),
            'entity_id' => $request->input('entity_id'),
            'action' => $request->input('action'),
        ]);

        return response()->json(['success' => true], 201);
    }
}

