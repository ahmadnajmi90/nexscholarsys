<?php

namespace App\Http\Controllers\Auth;
use Illuminate\Support\Str;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Academician;
use App\Models\Industry;
use App\Models\Postgraduate;
use App\Models\UniversityList;
use App\Models\FacultyList;

class ProfileCompletionController extends Controller
{
    /**
     * Display the registration view.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/CompleteProfile', [
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(Request $request): RedirectResponse
    {
        // Validate basic user information and role
        $request->validate([
            'full_name' => 'required|string|max:255',
            'role' => 'required|string',
        ]);

        // Get the current user
        $user = Auth::user();

        // Additional validation and unique ID generation based on role
        if ($request->role === 'Academician') {
            $request->validate([
                'university' => 'required|exists:university_list,id',
                'faculty' => 'required|exists:faculty_list,id',
            ]);

            // Generate a unique ID for the user if it does not already exist
            $uniqueId = 'ACAD-' . Str::random(8);
            $user->update([
                'unique_id' => $uniqueId,
                'is_profile_complete' => true,
            ]);
            $user->assign(['academician']);

            // Create or update entry in the academicians table, linking with unique_id
            Academician::updateOrCreate(
                ['academician_id' => $uniqueId],
                [
                    'full_name' => strtoupper($request->full_name),
                    'university' => $request->university,
                    'faculty' => $request->faculty,
                ]
            );

        } elseif ($request->role === 'Industry') {
            $request->validate([
                'industry' => 'required|string|max:255',
            ]);

            $uniqueId = 'INDT-' . Str::random(8);
            $user->update([
                'unique_id' => $uniqueId,
                'is_profile_complete' => true,
            ]);
            $user->assign(['industry']);

            // Create or update entry in the industry table, linking with unique_id
            Industry::updateOrCreate(
                ['industry_id' => $uniqueId,],
                [
                    'full_name' => strtoupper($request->full_name),
                    'industry' => $request->industry,
                ]
            );

        } elseif ($request->role === 'Postgraduate') {
            $request->validate([
                'university' => 'required|exists:university_list,id',
                'faculty' => 'required|exists:faculty_list,id',
            ]);

            $uniqueId = 'PG-' . Str::random(8);
            $user->update([
                'unique_id' => $uniqueId,
                'is_profile_complete' => true,
            ]);
            $user->assign(['postgraduate']);

            // Create or update entry in the postgraduates table, linking with unique_id
            Postgraduate::updateOrCreate(
                ['postgraduate_id' => $uniqueId],
                [
                    'full_name' => strtoupper($request->full_name),
                    'university' => $request->university,
                    'faculty' => $request->faculty,
                ]
            );
        }

        return redirect()->route('dashboard');
    }
}
