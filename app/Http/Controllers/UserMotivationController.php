<?php

namespace App\Http\Controllers;

use App\Models\UserMotivation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserMotivationController extends Controller
{
    /**
     * Show the form for collecting user motivation.
     */
    public function showForm(): Response
    {
        return Inertia::render('Auth/WhyNexscholar');
    }

    /**
     * Store the user's reasons for joining Nexscholar.
     */
    public function storeReason(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'main_reason' => 'required|string|in:A,B,C,D,E,F,G,H',
            'features_interested' => 'required|array',
            'features_interested.*' => 'in:A,B,C,D,E,F,G',
            'additional_info' => 'nullable|string|max:1000',
        ]);

        UserMotivation::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'main_reason' => $validated['main_reason'],
                'features_interested' => $validated['features_interested'],
                'additional_info' => $validated['additional_info'] ?? null,
            ]
        );

        return redirect()->route('profile.complete');
    }
}
