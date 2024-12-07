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
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;


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

    public function updateProfilePicture(Request $request): RedirectResponse
{
    try {
        $user = Auth::user();
        $isPostgraduate = BouncerFacade::is($user)->an('postgraduate');
        $isAcademician = BouncerFacade::is($user)->an('academician');

        // Validate the request data
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $destinationPath = public_path('storage/profile_pictures');

            // Ensure the directory exists
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move($destinationPath, $fileName);

            // Update the profile picture path in the respective table
            if ($isPostgraduate) {
                $user->postgraduate->profile_picture = 'profile_pictures/' . $fileName;
                $user->postgraduate->save();
            } elseif ($isAcademician) {
                $user->academician->profile_picture = 'profile_pictures/' . $fileName;
                $user->academician->save();
            }
        }

        return redirect()->route('role.edit')->with('status', 'Image profile updated successfully!');
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error updating profile picture: ' . $e->getMessage()], 500);
    }
}



    public function update(RoleProfileUpdateRequest $request): RedirectResponse
    {
        try{
            $user = Auth::user();
            $isPostgraduate = BouncerFacade::is($user)->an('postgraduate');
            $isAcademician = BouncerFacade::is($user)->an('academician');

            // Validate the request data
            $validatedData = $request->all();
            logger()->info('Validated Data:', $validatedData);

            if ($request->hasFile('profile_picture')) {
                logger()->info('hasFile');

                // Determine the destination path for profile pictures
                $destinationPath = public_path('storage/profile_pictures');

                // Ensure the directory exists
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                // Delete the old profile picture if it exists
                if ($isPostgraduate && $user->postgraduate && $user->postgraduate->profile_picture) {
                    $oldFilePath = public_path('storage/' . $user->postgraduate->profile_picture);
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath); // Delete the old profile picture
                    }
                } elseif ($isAcademician && $user->academician && $user->academician->profile_picture) {
                    $oldFilePath = public_path('storage/' . $user->academician->profile_picture);
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath); // Delete the old profile picture
                    }
                }

                // Save the new profile picture
                $file = $request->file('profile_picture');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move($destinationPath, $fileName);

                // Save the relative path
                $validatedData['profile_picture'] = 'profile_pictures/' . $fileName;
            } else {
                // Keep the existing path
                $validatedData['profile_picture'] = $request->input('profile_picture');
            }

            // Decode the JSON fields only if they are strings
            if (isset($validatedData['field_of_study']) && is_string($validatedData['field_of_study'])) {
                $validatedData['field_of_study'] = json_decode($validatedData['field_of_study'], true);
            }
            if (isset($validatedData['field_of_research']) && is_string($validatedData['field_of_research'])) {
                $validatedData['field_of_research'] = json_decode($validatedData['field_of_research'], true);
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
                $validatedData['university'] = $user->academician->university;
                $validatedData['faculty'] = $user->academician->faculty;
                logger()->info('Academician Data:', $validatedData);
                $user->academician()->updateOrCreate(
                    ['academician_id' => $user->academician->academician_id ?? $user->id], // Ensure it matches the existing ID
                    $validatedData
                );
            }

            return Redirect::route('role.edit')->with('status', 'Role information updated successfully!');
        }catch (ValidationException $e) {
            // Log validation errors
            logger('Validation Errors:', $e->errors());

            // Return back with validation errors
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }
}
