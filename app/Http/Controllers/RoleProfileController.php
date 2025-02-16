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
        try {
            $user = Auth::user();
            $isPostgraduate = BouncerFacade::is($user)->an('postgraduate');
            $isAcademician = BouncerFacade::is($user)->an('academician');
            $isUndergraduate = BouncerFacade::is($user)->an('undergraduate');

            // Validate the request data
            $validatedData = $request->all();
            logger()->info('Validated Data:', $validatedData);

            if ($request->hasFile('profile_picture')) {
                logger()->info('hasFile');

                // Determine the destination path for profile pictures
                $destinationPath = public_path('storage/profile_pictures');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                // Delete the old profile picture if it exists
                if ($isPostgraduate && $user->postgraduate && $user->postgraduate->profile_picture) {
                    $oldFilePath = public_path('storage/' . $user->postgraduate->profile_picture);
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath);
                    }
                } elseif ($isAcademician && $user->academician && $user->academician->profile_picture) {
                    $oldFilePath = public_path('storage/' . $user->academician->profile_picture);
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath);
                    }
                } elseif ($isUndergraduate && $user->undergraduate && $user->undergraduate->profile_picture) {
                    $oldFilePath = public_path('storage/' . $user->undergraduate->profile_picture);
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath);
                    }
                }
                $file = $request->file('profile_picture');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move($destinationPath, $fileName);
                $validatedData['profile_picture'] = 'profile_pictures/' . $fileName;
            } else {
                $validatedData['profile_picture'] = $request->input('profile_picture');
            }

            // Handle CV_file (for students)
            if (($isPostgraduate || $isUndergraduate) && $request->hasFile('CV_file')) {
                logger()->info('CV file hasFile');
                $destinationPath = public_path('storage/CV_files');
                if (!file_exists($destinationPath)) {
                    mkdir($destinationPath, 0755, true);
                }
                if ($isPostgraduate && $user->postgraduate && $user->postgraduate->CV_file) {
                    $oldFilePath = public_path('storage/' . $user->postgraduate->CV_file);
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath);
                    }
                } elseif ($isUndergraduate && $user->undergraduate && $user->undergraduate->CV_file) {
                    $oldFilePath = public_path('storage/' . $user->undergraduate->CV_file);
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath);
                    }
                }
                $file = $request->file('CV_file');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $file->move($destinationPath, $fileName);
                $validatedData['CV_file'] = 'CV_files/' . $fileName;
            } else {
                $validatedData['CV_file'] = $request->input('CV_file');
            }

            if ($isAcademician) {
                // Handle research_expertise for academicians.
                if (!array_key_exists('research_expertise', $validatedData)) {
                    $validatedData['research_expertise'] = null;
                    logger()->info('No research_expertise provided; setting to null.');
                } elseif (is_string($validatedData['research_expertise'])) {
                    $decoded = json_decode($validatedData['research_expertise'], true);
                    if (empty($decoded)) {
                        $validatedData['research_expertise'] = null;
                        logger()->info('Research Expertise is empty; deleting field.');
                    } else {
                        $validatedData['research_expertise'] = $decoded;
                        logger()->info('Research Expertise:', $validatedData['research_expertise']);
                    }
                }
            }

            if ($isPostgraduate) {
                // Handle field_of_research for postgraduates.
                if (!array_key_exists('field_of_research', $validatedData)) {
                    $validatedData['field_of_research'] = null;
                    logger()->info('No field_of_research provided; setting to null.');
                } elseif (is_string($validatedData['field_of_research'])) {
                    $decoded = json_decode($validatedData['field_of_research'], true);
                    if (empty($decoded)) {
                        $validatedData['field_of_research'] = null;
                        logger()->info('Field of Research is empty; deleting field.');
                    } else {
                        $validatedData['field_of_research'] = $decoded;
                        logger()->info('Field of Research:', $validatedData['field_of_research']);
                    }
                }
            
                // Handle previous_degree for postgraduates.
                if (!array_key_exists('previous_degree', $validatedData)) {
                    $validatedData['previous_degree'] = null;
                    logger()->info('No previous_degree provided; setting to null.');
                } elseif (is_string($validatedData['previous_degree'])) {
                    $decoded = json_decode($validatedData['previous_degree'], true);
                    if (empty($decoded)) {
                        $validatedData['previous_degree'] = null;
                        logger()->info('Previous Degree is empty; deleting field.');
                    } else {
                        $validatedData['previous_degree'] = $decoded;
                        logger()->info('Previous Degree:', $validatedData['previous_degree']);
                    }
                }
            }

            if ($isUndergraduate) {
                // If the research_preference key isn't set, then force it to null
                if (!array_key_exists('research_preference', $validatedData) || $validatedData['interested_do_research'] === "false") {
                    $validatedData['research_preference'] = null;
                    logger()->info('No research_preference provided; setting to null.');
                } elseif (is_string($validatedData['research_preference'])) {
                    $decoded = json_decode($validatedData['research_preference'], true);
                    if (empty($decoded)) {
                        $validatedData['research_preference'] = null;
                        logger()->info('Research Preference is empty; deleting field.');
                    } else {
                        $validatedData['research_preference'] = $decoded;
                        logger()->info('Research Preference:', $validatedData['research_preference']);
                    }
                }
            }

            // *** NEW: Handle skills update for students ***
            if ($isPostgraduate || $isUndergraduate) {
                // Handle skills for students.
                if (!array_key_exists('skills', $validatedData)) {
                    $validatedData['skills'] = null;
                    logger()->info('No skills provided; setting to null.');
                } elseif (is_string($validatedData['skills'])) {
                    $decoded = json_decode($validatedData['skills'], true);
                    if (empty($decoded)) {
                        $validatedData['skills'] = null;
                        logger()->info('Skills are empty; deleting field.');
                    } else {
                        $validatedData['skills'] = $decoded;
                        logger()->info('Skills:', $validatedData['skills']);
                    }
                }
            }

            logger()->info('Decoded Data:', $validatedData);

            if ($isPostgraduate) {
                $user->postgraduate()->updateOrCreate(
                    ['postgraduate_id' => $user->postgraduate->postgraduate_id ?? $user->id],
                    $validatedData
                );
            } else if ($isUndergraduate) {
                if ($validatedData['interested_do_research'] == "true") {
                    $validatedData['interested_do_research'] = 1;
                } else if ($validatedData['interested_do_research'] == "false"){
                    $validatedData['interested_do_research'] = 0;
                }
                logger()->info('Undergraduate Data:', $validatedData);
                $user->undergraduate()->updateOrCreate(
                    ['undergraduate_id' => $user->undergraduate->undergraduate_id ?? $user->id],
                    $validatedData
                );
            } elseif ($isAcademician) {
                $validatedData['university'] = $user->academician->university;
                $validatedData['faculty'] = $user->academician->faculty;
                if ($validatedData['availability_as_supervisor'] == true) {
                    $validatedData['availability_as_supervisor'] = 1;
                } else {
                    $validatedData['availability_as_supervisor'] = 0;
                }
                logger()->info('Academician Data:', $validatedData);
                $user->academician()->updateOrCreate(
                    ['academician_id' => $user->academician->academician_id ?? $user->id],
                    $validatedData
                );
            }

            return Redirect::route('role.edit')->with('status', 'Role information updated successfully!');
        } catch (ValidationException $e) {
            logger('Validation Errors:', $e->errors());
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }
}
