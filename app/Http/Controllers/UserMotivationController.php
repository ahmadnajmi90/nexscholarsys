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
     * Store the user's reason for joining Nexscholar.
     */
    public function storeReason(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        UserMotivation::updateOrCreate(
            ['user_id' => Auth::id()],
            ['reason' => $validated['reason'] ?? null]
        );

        return redirect()->route('profile.complete');
    }
}
