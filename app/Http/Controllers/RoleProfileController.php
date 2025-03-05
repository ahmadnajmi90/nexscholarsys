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
use App\Services\AIProfileService;

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

    public function generateProfile(Request $request)
    {
        // Helper functions for validation
        function validatePhoneNumber($phoneNumber) {
            return preg_match('/^\+\d{1,3}[\s-]?\d{1,4}([\s-]?\d{1,4})+$/', $phoneNumber);
        }
        function validateUrl($url) {
            return filter_var($url, FILTER_VALIDATE_URL) !== false;
        }

        $user = auth()->user();
        if (!BouncerFacade::is($user)->an('academician')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Eager load related models
        $academician = $user->academician()->with(['universityDetails', 'faculty', 'user'])->first();

        $data = [
            'full_name'  => $academician->full_name,
            'university' => optional($academician->universityDetails)->full_name,
            'faculty'    => data_get($academician->toArray(), 'faculty.name'),
            'email'      => optional($academician->user)->email,
            // User provided URL fields:
            'website'       => $academician->website,
            'linkedin'      => $academician->linkedin,
            'google_scholar'=> $academician->google_scholar,
            'researchgate'  => $academician->researchgate,
        ];

        // Determine mode: 'auto' for AI search or 'url' for user provided URLs.
        // Expect 'mode' parameter from the request and optionally an array of URLs.
        $mode = $request->input('mode', 'auto'); // default to auto search
        $urls = $request->input('urls'); // expecting an array when mode is 'url'

        $additionalContext = '';

        if ($mode === 'auto') {
            // Use Google Custom Search to fetch context.
            $searchQuery = "{$data['university']} {$data['faculty']} {$data['full_name']} academic profile";
            $googleSearchService = app(\App\Services\GoogleSearchService::class);
            $searchResults = $googleSearchService->fetchResults($searchQuery);

            $snippets = [];
            if (!empty($searchResults['items'])) {
                foreach ($searchResults['items'] as $item) {
                    if (isset($item['snippet'])) {
                        $snippets[] = $item['snippet'];
                    }
                }
            }
            $additionalContext = implode(" ", array_slice($snippets, 0, 3));
        } elseif ($mode === 'url' && !empty($urls) && is_array($urls)) {
            // Use user provided URLs: fetch context from each URL.
            $contexts = [];
            $client = new \GuzzleHttp\Client([
                'headers' => [
                    'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
                    'Accept'     => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                ]
            ]);
            foreach ($urls as $url) {
                if (validateUrl($url)) {
                    try {
                        $response = $client->get($url);
                        $html = (string)$response->getBody();
                        // Use DOMDocument to extract meta description as context
                        $dom = new \DOMDocument();
                        @$dom->loadHTML($html);
                        $metaTags = $dom->getElementsByTagName('meta');
                        $metaDescription = '';
                        foreach ($metaTags as $tag) {
                            if (strtolower($tag->getAttribute('name')) === 'description') {
                                $metaDescription = $tag->getAttribute('content');
                                break;
                            }
                        }
                        if ($metaDescription) {
                            $contexts[] = $metaDescription;
                        }
                    } catch (\Exception $e) {
                        logger()->error("Error fetching URL content from {$url}: " . $e->getMessage());
                    }
                }
            }
            $additionalContext = implode(" ", $contexts);
            if (!$additionalContext) {
                $additionalContext = "No additional context available from provided URLs.";
            }
        } else {
            $additionalContext = "No additional context provided.";
        }

        // Build the AI prompt. Note that the expected keys in the output no longer include the 4 URL fields.
        $prompt = "Generate a detailed academic profile for an academician using the following details.
        Return the output as valid JSON with exactly the following keys: full_name, email, phone_number, profile_picture, current_position, department, highest_degree, field_of_study, research_expertise, bio.
        Each field must be plausible and realistic, if not found then leave it as null:
        - 'full_name' and 'email' should match the provided details.
        - 'phone_number' must be in an international format (e.g. '+60 123-456-7890') and contain only digits, spaces, or dashes.
        - 'highest_degree' should be one of: Certificate, Diploma, Bachelor's Degree, Master's Degree, Ph.D., or Postdoctoral.
        - 'current_position' should be one of: Lecturer, Senior Lecturer, Associate Professor, Professor, Postdoctoral Researcher, or Researcher.
        - 'research_expertise' should be an array of expertise terms.
        Details: Name: {$data['full_name']}, Email: {$data['email']}, University: {$data['university']}, Faculty: {$data['faculty']}.
        Additional context from the provided URLs: {$additionalContext}.
        Data may not be in English, so translate if necessary and extract data in English.
        Provide plausible academic details based solely on these inputs, and output only valid JSON without any markdown formatting.";

        logger()->info("Final AI Prompt:", ['prompt' => $prompt]);

        // Call the AI service (using the GitHub inference integration)
        $generatedProfile = app(\App\Services\AIProfileService::class)->generateProfile($prompt);

        // Post-processing validation: phone number and URL fields
        if ($generatedProfile) {
            if (isset($generatedProfile['phone_number']) && !validatePhoneNumber($generatedProfile['phone_number'])) {
                logger()->warning('Invalid phone number generated', ['phone_number' => $generatedProfile['phone_number']]);
                $generatedProfile['phone_number'] = 'N/A';
            }
            // Validate profile_picture if generated
            if (isset($generatedProfile['profile_picture']) && !validateUrl($generatedProfile['profile_picture'])) {
                logger()->warning("Invalid URL generated for profile_picture", ['url' => $generatedProfile['profile_picture']]);
                $generatedProfile['profile_picture'] = 'N/A';
            }
            // Map research_expertise terms to structured options and remove those not in the list
            if (isset($generatedProfile['research_expertise']) && is_array($generatedProfile['research_expertise'])) {
                $fieldOfResearches = \App\Models\FieldOfResearch::with('researchAreas.nicheDomains')->get();
                $researchOptions = [];
                foreach ($fieldOfResearches as $field) {
                    foreach ($field->researchAreas as $area) {
                        foreach ($area->nicheDomains as $domain) {
                            $researchOptions[] = [
                                'field_of_research_id'   => $field->id,
                                'field_of_research_name' => $field->name,
                                'research_area_id'       => $area->id,
                                'research_area_name'     => $area->name,
                                'niche_domain_id'        => $domain->id,
                                'niche_domain_name'      => $domain->name,
                            ];
                        }
                    }
                }
        
                $rawExpertise = $generatedProfile['research_expertise'];
                $matchedExpertise = [];
                foreach ($rawExpertise as $term) {
                    $term = strtolower(trim($term));
                    $found = false;
                    foreach ($researchOptions as $option) {
                        $label = strtolower(
                            $option['field_of_research_name'] . ' - ' .
                            $option['research_area_name'] . ' - ' .
                            $option['niche_domain_name']
                        );
                        if (strpos($label, $term) !== false) {
                            $matchedExpertise[] = $option['field_of_research_id'] . '-' .
                                                $option['research_area_id'] . '-' .
                                                $option['niche_domain_id'];
                            $found = true;
                            break;
                        }
                    }
                    // Only add term if found, otherwise skip it.
                }
                $generatedProfile['research_expertise'] = $matchedExpertise;
            }
        
            return response()->json($generatedProfile);
        }
        return response()->json(['error' => 'Profile generation failed'], 500);
    }

}
