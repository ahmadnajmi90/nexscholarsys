<?php

namespace App\Http\Controllers;

use App\Http\Requests\RoleProfileUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Silber\Bouncer\BouncerFacade;
use App\Models\UniversityList;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use App\Models\FacultyList;


class RoleProfileController extends Controller
{
    public function edit(): Response
    {
        $isPostgraduate = BouncerFacade::is(Auth::user())->an('postgraduate');
        $isAcademician = BouncerFacade::is(Auth::user())->an('academician');

        return Inertia::render('Role/Edit', [
            'isPostgraduate' => $isPostgraduate,
            'isAcademician' => $isAcademician,
            'postgraduate' => $isPostgraduate ? Auth::user()->postgraduate : null,
            'academician' => $isAcademician ? Auth::user()->academician : null,
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
        ]);
    }

    public function update(RoleProfileUpdateRequest $request): RedirectResponse
    {
        $user = Auth::user();
        $isPostgraduate = BouncerFacade::is($user)->an('postgraduate');
        $isAcademician = BouncerFacade::is($user)->an('academician');

        // Validate the request data
        $validatedData = $request->validated();
        logger()->info('Validated Data:', $validatedData);

        if ($request->hasFile('profile_picture')) {
            logger()->info('hasFile');
            $file = $request->file('profile_picture');
    
            // Delete the old profile picture if it exists
            if ($isPostgraduate && $user->postgraduate && $user->postgraduate->profile_picture) {
                Storage::disk('public')->delete($user->postgraduate->profile_picture);
            } elseif ($isAcademician && $user->academician && $user->academician->profile_picture) {
                Storage::disk('public')->delete($user->academician->profile_picture);
            }
    
            // Store the new profile picture
            $filePath = $file->store('profile_pictures', 'public');
            $validatedData['profile_picture'] = $filePath; // Add file path to validated data
        } else {
            if ($isPostgraduate) {
                $validatedData['profile_picture'] = $user->postgraduate->profile_picture; // Keep the existing path
            } elseif ($isAcademician) {
                $validatedData['profile_picture'] = $user->academician->profile_picture;
            }
        }

        // Decode the JSON fields only if they are strings
        if (isset($validatedData['field_of_study']) && is_string($validatedData['field_of_study'])) {
            $validatedData['field_of_study'] = json_decode($validatedData['field_of_study'], true);
        }
        if (isset($validatedData['research_interests']) && is_string($validatedData['research_interests'])) {
            $validatedData['research_interests'] = json_decode($validatedData['research_interests'], true);
        }
        if (isset($validatedData['ongoing_research']) && is_string($validatedData['ongoing_research'])) {
            $validatedData['ongoing_research'] = json_decode($validatedData['ongoing_research'], true);
        }

        logger()->info('Decoded Data:', $validatedData);

        if ($isPostgraduate) {
            // Match existing postgraduate by `postgraduate_id` or `user_id`
            $user->postgraduate()->updateOrCreate(
                ['postgraduate_id' => $user->postgraduate->postgraduate_id ?? $user->id], // Ensure it matches the existing ID
                $validatedData
            );
        } elseif ($isAcademician) {
            // Match existing academician by `academician_id` or `user_id`
            $user->academician()->updateOrCreate(
                ['academician_id' => $user->academician->academician_id ?? $user->id], // Ensure it matches the existing ID
                $validatedData
            );
        }

        return Redirect::route('role.edit')->with('status', 'Role information updated successfully!');
    }
}
