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
use App\Models\FieldOfResearch;
use App\Models\ResearchArea;
use App\Models\NicheDomain;


class RoleProfileController extends Controller
{
    public function edit(): Response
    {
        $isPostgraduate = BouncerFacade::is(Auth::user())->an('postgraduate');
        $isUndergraduate = BouncerFacade::is(Auth::user())->an('undergraduate');
        $isAcademician = BouncerFacade::is(Auth::user())->an('academician');

        $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();

        $researchOptions = [];
        foreach ($fieldOfResearches as $field) {
            foreach ($field->researchAreas as $area) {
                foreach ($area->nicheDomains as $domain) {
                    $researchOptions[] = [
                        'field_of_research_id' => $field->id,
                        'field_of_research_name' => $field->name,
                        'research_area_id' => $area->id,
                        'research_area_name' => $area->name,
                        'niche_domain_id' => $domain->id,
                        'niche_domain_name' => $domain->name,
                    ];
                }
            }
        }

        return Inertia::render('Role/Edit', [
            'isPostgraduate' => $isPostgraduate,
            'isAcademician' => $isAcademician,
            'isUndergraduate' => BouncerFacade::is(Auth::user())->an('undergraduate'),
            'isFacultyAdmin' => BouncerFacade::is(Auth::user())->an('faculty_admin'),
            'postgraduate' => $isPostgraduate ? Auth::user()->postgraduate : null,
            'academician' => $isAcademician ? Auth::user()->academician : null,
            'undergraduate' => $isUndergraduate ? Auth::user()->undergraduate : null,
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
            'researchOptions' => $researchOptions,
        ]);
    }

    public function updateProfilePicture(Request $request): RedirectResponse
    {
        try {
            $user = Auth::user();
            $isPostgraduate = BouncerFacade::is($user)->an('postgraduate');
            $isAcademician = BouncerFacade::is($user)->an('academician');
            $isUndergraduate = BouncerFacade::is(Auth::user())->an('undergraduate');

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
                } elseif ($isUndergraduate) {
                    $user->undergraduate->profile_picture = 'profile_pictures/' . $fileName;
                    $user->undergraduate->save();
                }
            }

            return redirect()->route('role.edit')->with('status', 'Image profile updated successfully!');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating profile picture: ' . $e->getMessage()], 500);
        }
    }

    public function updateBackgroundImage(Request $request): RedirectResponse
    {
        try {
            $user = Auth::user();
            $isPostgraduate = BouncerFacade::is($user)->an('postgraduate');
            $isAcademician = BouncerFacade::is($user)->an('academician');
            $isUndergraduate = BouncerFacade::is(Auth::user())->an('undergraduate');

            // Validate the request
            $request->validate([
                'background_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($request->hasFile('background_image')) {
                $file = $request->file('background_image');
                $destinationPath = public_path('storage/background_images');

                // Ensure the directory exists
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move($destinationPath, $fileName);

                // Update the background image path in the respective table
                if ($isPostgraduate) {
                    $user->postgraduate->background_image = 'background_images/' . $fileName;
                    $user->postgraduate->save();
                } elseif ($isAcademician) {
                    $user->academician->background_image = 'background_images/' . $fileName;
                    $user->academician->save();
                } else if ($isUndergraduate) {
                    $user->undergraduate->background_image = 'background_images/' . $fileName;
                    $user->undergraduate->save();
                } 
            }

            return redirect()->route('role.edit')->with('status', 'Background image updated successfully!');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating background image: ' . $e->getMessage()], 500);
        }
    }

    public function update(RoleProfileUpdateRequest $request): RedirectResponse
    {
        try{
            $user = Auth::user();
            $isPostgraduate = BouncerFacade::is($user)->an('postgraduate');
            $isAcademician = BouncerFacade::is($user)->an('academician');
            $isUndergraduate = BouncerFacade::is(Auth::user())->an('undergraduate');

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
                } else if ($isUndergraduate && $user->undergraduate && $user->undergraduate->profile_picture) {
                    $oldFilePath = public_path('storage/' . $user->undergraduate->profile_picture);
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

             // Handle CV_file
            if (($isPostgraduate || $isUndergraduate) && $request->hasFile('CV_file')) {
                logger()->info('CV file hasFile');

                // Determine the destination path for CV files
                $destinationPath = public_path('storage/CV_files');

                // Ensure the directory exists
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }

                // Delete the old CV file if it exists
                if ($isPostgraduate && $user->postgraduate && $user->postgraduate->CV_file) {
                    $oldFilePath = public_path('storage/' . $user->postgraduate->CV_file);
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath); // Delete the old CV file
                    }
                }else if ($isUndergraduate && $user->undergraduate && $user->undergraduate->CV_file) {
                    $oldFilePath = public_path('storage/' . $user->undergraduate->CV_file);
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath); // Delete the old CV file
                    }
                }

                // Save the new CV file
                $file = $request->file('CV_file');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move($destinationPath, $fileName);

                // Save the relative path
                $validatedData['CV_file'] = 'CV_files/' . $fileName;
            } else {
                // Keep the existing path
                $validatedData['CV_file'] = $request->input('CV_file');
            }

            if ($isAcademician && isset($validatedData['research_expertise']) && is_string($validatedData['research_expertise'])) {
                $validatedData['research_expertise'] = json_decode($validatedData['research_expertise'], true);
                logger()->info('Research Expertise:', $validatedData['research_expertise']);
            }

            if ($isPostgraduate && isset($validatedData['field_of_research']) && is_string($validatedData['field_of_research'])) {
                $validatedData['field_of_research'] = json_decode($validatedData['field_of_research'], true);
                logger()->info('Field of Research:', $validatedData['field_of_research']);
            }

            if ($isPostgraduate && isset($validatedData['previous_degree']) && is_string($validatedData['previous_degree'])) {
                $validatedData['previous_degree'] = json_decode($validatedData['previous_degree'], true);
                logger()->info('Previous Degree:', $validatedData['previous_degree']);
            }

            if ($isUndergraduate && isset($validatedData['research_preference']) && is_string($validatedData['research_preference'])) {
                $validatedData['research_preference'] = json_decode($validatedData['research_preference'], true);
                logger()->info('Research Preference:', $validatedData['research_preference']);
            }

            logger()->info('Decoded Data:', $validatedData);

            if ($isPostgraduate) {
                // Match existing postgraduate by `postgraduate_id` or `user_id`
                $user->postgraduate()->updateOrCreate(
                    ['postgraduate_id' => $user->postgraduate->postgraduate_id ?? $user->id], // Ensure it matches the existing ID
                    $validatedData
                );
            } else if ($isUndergraduate) {
                // Match existing postgraduate by `postgraduate_id` or `user_id`
                if($validatedData['interested_do_research']==true){
                    $validatedData['interested_do_research'] = 1;
                }else{
                    $validatedData['interested_do_research'] = 0;
                }
                $user->undergraduate()->updateOrCreate(
                    ['undergraduate_id' => $user->undergraduate->undergraduate_id ?? $user->id], // Ensure it matches the existing ID
                    $validatedData
                );
            } elseif ($isAcademician) {
                // Match existing academician by `academician_id` or `user_id`
                $validatedData['university'] = $user->academician->university;
                $validatedData['faculty'] = $user->academician->faculty;
                if($validatedData['availability_as_supervisor']==true){
                    $validatedData['availability_as_supervisor'] = 1;
                }else{
                    $validatedData['availability_as_supervisor'] = 0;
                }
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
