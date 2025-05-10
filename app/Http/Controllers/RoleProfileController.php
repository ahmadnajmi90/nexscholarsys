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
use GuzzleHttp\Client;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Log;
use App\Services\AICVService;
use Symfony\Component\DomCrawler\Crawler;
use App\Services\GoogleSearchService;

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

        // Check for AI generation status
        $aiGenerationInProgress = session('ai_profile_generation_in_progress', false);
        $aiGenerationMethod = session('ai_profile_generation_method', null);
        
        // Check if we have a cached profile ready
        $generatedProfileData = null;
        if ($aiGenerationInProgress && $isAcademician) {
            $cacheKey = 'academician_profile_' . Auth::id();
            $cachedProfile = \Illuminate\Support\Facades\Cache::get($cacheKey);
            
            if ($cachedProfile) {
                // We have generated profile data, include it in the response
                $generatedProfileData = $cachedProfile;
                
                // Clear the session flags as we've successfully retrieved the profile
                session()->forget(['ai_profile_generation_in_progress', 'ai_profile_generation_method']);
            }
        }

        // Log the parameters for debugging
        Log::info('AI Generation Parameters:', [
            'aiGenerationInProgress' => $aiGenerationInProgress,
            'aiGenerationMethod' => $aiGenerationMethod,
            'generatedProfileData' => $generatedProfileData ? 'Available' : 'Not Available',
            'query_params' => request()->query(),
        ]);

        return Inertia::render('Role/Edit', [
            'postgraduate' => $isPostgraduate ? Auth::user()->postgraduate : null,
            'academician' => $isAcademician ? Auth::user()->academician : null,
            'undergraduate' => $isUndergraduate ? Auth::user()->undergraduate : null,
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
            'researchOptions' => $researchOptions,
            'skills' => \App\Models\Skill::all(),
            'aiGenerationInProgress' => $aiGenerationInProgress,
            'aiGenerationMethod' => $aiGenerationMethod,
            'generatedProfileData' => $generatedProfileData,
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
                        // Ensure skills are stored as an array of integer IDs.
                        $validatedData['skills'] = array_map('intval', $decoded);
                        logger()->info('Skills stored as IDs:', $validatedData['skills']);
                    }
                } elseif (is_array($validatedData['skills'])) {
                    // If already an array, convert each element to an integer.
                    $validatedData['skills'] = array_map('intval', $validatedData['skills']);
                    logger()->info('Skills stored as IDs:', $validatedData['skills']);
                }
            }

            // Handle supervisorAvailability for postgraduates
            if ($isPostgraduate && array_key_exists('supervisorAvailability', $validatedData)) {
                // Use filter_var to properly convert string to boolean
                $validatedData['supervisorAvailability'] = filter_var(
                    $validatedData['supervisorAvailability'], 
                    FILTER_VALIDATE_BOOLEAN
                );
                logger()->info('Supervisor Availability:', ['value' => $validatedData['supervisorAvailability']]);
            }

            // Handle grantAvailability for postgraduates
            if ($isPostgraduate && array_key_exists('grantAvailability', $validatedData)) {
                // Use filter_var to properly convert string to boolean
                $validatedData['grantAvailability'] = filter_var(
                    $validatedData['grantAvailability'], 
                    FILTER_VALIDATE_BOOLEAN
                );
                logger()->info('Grant Availability:', ['value' => $validatedData['grantAvailability']]);
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

        $user = Auth::user();
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
            'personal_website'  => $academician->personal_website ?: $academician->website, // Fallback to website if personal_website is empty
            'institution_website' => $academician->institution_website,
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
            
            // Cache the generated profile for retrieval in checkGenerationStatus
            $cacheKey = 'academician_profile_' . $user->id;
            \Illuminate\Support\Facades\Cache::put($cacheKey, $generatedProfile, now()->addHours(1));
        
            return response()->json($generatedProfile);
        }
        return response()->json(['error' => 'Profile generation failed'], 500);
    }

    public function generateCV(Request $request)
    {
        $user = auth()->user();
        // Retrieve the academician profile (adjust relationship as needed)
        $academicianProfile = $user->academician()->with('user')->first();

        if (!$academicianProfile) {
            return response()->json(['error' => 'Profile not found'], 404);
        }

        // Fetch data from various sources
        $personalWebsite   = $academicianProfile->personal_website ?: $academicianProfile->website; // Fallback to website if needed
        $institutionWebsite = $academicianProfile->institution_website;
        $googleScholarUrl = $academicianProfile->google_scholar;

        $personalWebContent = $this->fetchWebsiteContent($personalWebsite);
        $institutionWebContent = $this->fetchWebsiteContent($institutionWebsite);
        $scholarContent = $this->fetchScholarContent($googleScholarUrl);

        // Extract publications from Google Scholar using Guzzle + DomCrawler
        $publications = $this->extractPublicationsFromScholar($googleScholarUrl);
        $publicationsText = $this->formatPublications($publications);

        // Combine additional context for the prompt
        $additionalContext = "";
        if ($personalWebContent) {
            $additionalContext .= "Personal Website Content:\n" . $personalWebContent . "\n";
        }
        if ($institutionWebContent) {
            $additionalContext .= "Institutional Website Content:\n" . $institutionWebContent . "\n";
        }

        // Format research expertise
        $researchExpertise = is_array($academicianProfile->research_expertise)
            ? implode(', ', $academicianProfile->research_expertise)
            : $academicianProfile->research_expertise;

        // Build a detailed prompt for GPT-4o (via your AICVService)
        $prompt = "Generate a professional academic Curriculum Vitae based strictly on the provided data.
        Do not fabricate details that are not available.

        Personal Information:
        - Full Name: {$academicianProfile->full_name}
        - Email: {$academicianProfile->user->email}
        - Phone: " . ($academicianProfile->phone_number ?: 'Not Provided') . "
        - Current Position: {$academicianProfile->current_position}
        - Department: {$academicianProfile->department}

        Education:
        " . ($personalWebContent ? "Extract from Personal Website Content:\n" . $personalWebContent : "Not Provided") . "

        Research Experience:
        " . (($personalWebContent || $scholarContent) ? "Extract from sources:\n" . $personalWebContent . "\n" . $scholarContent : "Not Provided") . "

        Publications:
        " . ($publicationsText ? $publicationsText : "Not Provided") . "

        Research Expertise:
        - {$researchExpertise}

        Additional Information:
        " . ($additionalContext ? $additionalContext : "Not Provided") . "

        Use a structured, professional academic CV format.";

        Log::info('GPT-4o Input Prompt:', ['prompt' => $prompt]);

        // If the request is GET with a preview parameter, return the generated CV text for preview
        if ($request->isMethod('get') && $request->has('preview')) {
            // If a customized CV isn't provided, use AI to generate it
            if (!$request->has('customized_cv')) {
                $aiCVService = app(AICVService::class);
                $aiResponse = $aiCVService->generateCV($prompt);
                $finalCVText = $aiResponse['cv_text'] ?? "Unable to generate CV content. Please try again later.";
            } else {
                $finalCVText = $request->input('customized_cv');
            }
            return response()->json(['cv_text' => $finalCVText]);
        }

        // Otherwise, process the CV generation (using any customized CV text if provided)
        $customizedCV = $request->input('customized_cv');
        if ($customizedCV) {
            $finalCVText = $customizedCV;
        } else {
            $aiCVService = app(AICVService::class);
            $aiResponse = $aiCVService->generateCV($prompt);
            $finalCVText = $aiResponse['cv_text'] ?? "Unable to generate CV content. Please try again later.";
        }

        // Generate the DOCX file using PHPWord with basic formatting
        $phpWord = new PhpWord();
        $phpWord->addTitleStyle(1, ['bold' => true, 'size' => 20, 'name' => 'Arial'], ['spaceAfter' => 240]);
        $phpWord->addTitleStyle(2, ['bold' => true, 'size' => 16, 'name' => 'Arial'], ['spaceAfter' => 120]);
        $paragraphStyle = ['spaceAfter' => 120];

        $section = $phpWord->addSection();
        $section->addTitle($academicianProfile->full_name . " - Curriculum Vitae", 1);

        // Split the final CV text by newline and add with formatting
        $lines = preg_split('/\r\n|\r|\n/', $finalCVText);
        foreach ($lines as $line) {
            $trimmed = trim($line);
            if (empty($trimmed)) {
                $section->addTextBreak();
            } elseif (preg_match('/^(CURRICULUM VITAE|PERSONAL INFORMATION|EDUCATION|RESEARCH EXPERIENCE|PUBLICATIONS|RESEARCH GRANTS|TEACHING EXPERIENCE|PROFESSIONAL MEMBERSHIPS|AWARDS AND HONORS|ADDITIONAL INFORMATION)$/i', $trimmed)) {
                $section->addTitle($trimmed, 2);
            } else {
                $section->addText($trimmed, ['name' => 'Arial', 'size' => 12], $paragraphStyle);
            }
        }

        $fileName = 'cv_' . $academicianProfile->full_name . '.docx';
        $tempFile = tempnam(sys_get_temp_dir(), 'cv_') .  $academicianProfile->full_name . '.docx';
        IOFactory::createWriter($phpWord, 'Word2007')->save($tempFile);

        return response()->download($tempFile, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ])->deleteFileAfterSend(true);
    }

    // Fetch full textual content from a generic website using Guzzle and DomCrawler
    protected function fetchWebsiteContent($url)
    {
        if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }
        $client = new Client([
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (compatible; MyScraper/1.0)',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            ],
        ]);

        try {
            $response = $client->get($url);
            $html = (string)$response->getBody();
            $crawler = new Crawler($html);
            $paragraphs = $crawler->filter('p');
            $content = "";
            foreach ($paragraphs as $p) {
                $text = trim($p->textContent);
                if (!empty($text)) {
                    $content .= $text . "\n";
                }
            }
            return $content ?: null;
        } catch (\Exception $e) {
            Log::error("Error fetching content from {$url}: " . $e->getMessage());
        }
        return null;
    }

    // Fetch specific summary content from Google Scholar using Guzzle and DomCrawler
    protected function fetchScholarContent($url)
    {
        if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }
        try {
            $client = new Client([
                'headers' => [
                    'User-Agent' => 'Mozilla/5.0 (compatible; MyScraper/1.0)'
                ]
            ]);
            $response = $client->get($url);
            $html = (string)$response->getBody();
            $crawler = new Crawler($html);
            // Adjust the selector based on the actual structure of Google Scholar pages
            $content = $crawler->filter('div#gsc_prf_iv')->count() ? $crawler->filter('div#gsc_prf_iv')->first()->text() : null;
            return $content;
        } catch (\Exception $e) {
            Log::error("Error fetching Scholar content from {$url}: " . $e->getMessage());
        }
        return null;
    }

    // Extract publications from Google Scholar using Guzzle and DomCrawler
    protected function extractPublicationsFromScholar($url)
    {
        if (!$url || !filter_var($url, FILTER_VALIDATE_URL)) {
            return [];
        }
        try {
            $client = new Client([
                'headers' => [
                    'User-Agent' => 'Mozilla/5.0 (compatible; MyScraper/1.0)'
                ]
            ]);
            $response = $client->get($url);
            $html = (string)$response->getBody();
            $crawler = new Crawler($html);
            $publications = $crawler->filter('.gsc_a_tr')->each(function (Crawler $node) {
                $title = $node->filter('.gsc_a_at')->count() ? $node->filter('.gsc_a_at')->text() : '';
                $authors = $node->filter('.gs_gray')->eq(0)->count() ? $node->filter('.gs_gray')->eq(0)->text() : '';
                $journal = $node->filter('.gs_gray')->eq(1)->count() ? $node->filter('.gs_gray')->eq(1)->text() : '';
                $year = $node->filter('.gsc_a_y')->count() ? $node->filter('.gsc_a_y')->text() : '';
                return compact('title', 'authors', 'journal', 'year');
            });
            return $publications;
        } catch (\Exception $e) {
            Log::error("Error extracting publications from Scholar {$url}: " . $e->getMessage());
        }
        return [];
    }

    // Format the publications array into a readable string
    protected function formatPublications($publications)
    {
        if (empty($publications)) {
            return null;
        }
        $formatted = "Publications:\n";
        foreach ($publications as $pub) {
            $formatted .= "- " . ($pub['title'] ?: 'Untitled') . ". " .
                ($pub['authors'] ?: 'No Authors') . ". " .
                ($pub['journal'] ?: 'No Journal') . ". " .
                ($pub['year'] ?: 'No Year') . ".\n";
        }
        return $formatted;
    }

    /**
     * Show the AI Profile Generation options page
     */
    public function showAIProfileGeneration()
    {
        $user = Auth::user();
        
        if (!BouncerFacade::is($user)->an('academician')) {
            return redirect()->route('dashboard');
        }
        
        return Inertia::render('Auth/AIProfileGeneration');
    }

    /**
     * Trigger automatic AI profile generation using Google Search
     */
    public function triggerAutomaticGeneration(Request $request)
    {
        $user = Auth::user();
        
        if (!BouncerFacade::is($user)->an('academician')) {
            return response()->json(['error' => 'User is not an academician'], 403);
        }

        $academician = $user->academician()->with(['universityDetails', 'faculty', 'user'])->first();
        
        if (!$academician) {
            return response()->json(['error' => 'Academician profile not found'], 404);
        }

        // Set a generation flag in the session to indicate generation is in progress
        session(['ai_profile_generation_in_progress' => true]);
        session(['ai_profile_generation_method' => 'automatic']);
        
        // Prepare for generation
        $data = [
            'full_name'  => $academician->full_name,
            'university' => optional($academician->universityDetails)->full_name,
            'faculty'    => data_get($academician->toArray(), 'faculty.name'),
            'email'      => optional($academician->user)->email,
        ];
        
        // Actually initiate the generation process here
        try {
            // Create a new request with the automatic mode
            $generationRequest = new Request();
            $generationRequest->merge([
                'mode' => 'auto',
                'urls' => []
            ]);
            
            // Call the existing generateProfile method asynchronously
            // We don't need to wait for the result, as we'll fetch it later
            $this->generateProfile($generationRequest);
            
            // Store generated profile in the session or cache for later retrieval
            // This is optional and depends on your implementation
            
            // Generate a status message to return to the user
            $statusMessage = "Automatic profile generation initiated for {$data['full_name']}";
            
            return response()->json([
                'status' => 'success',
                'message' => $statusMessage,
                'generation_initiated' => true
            ]);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error initiating automatic profile generation: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to initiate profile generation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Save URLs provided by the user for profile generation
     */
    public function saveProfileURLs(Request $request)
    {
        $user = Auth::user();
        
        if (!BouncerFacade::is($user)->an('academician')) {
            return response()->json(['error' => 'User is not an academician'], 403);
        }

        $academician = $user->academician()->first();
        
        if (!$academician) {
            return response()->json(['error' => 'Academician profile not found'], 404);
        }

        $validated = $request->validate([
            'personalWebsite' => 'nullable|url',
            'institutionalWebsite' => 'nullable|url',
            'linkedinProfile' => 'nullable|url',
            'scholarProfile' => 'nullable|url',
            'researchgateProfile' => 'nullable|url',
        ]);

        // Ensure at least one URL is provided
        $hasAtLeastOneUrl = false;
        foreach ($validated as $url) {
            if (!empty($url)) {
                $hasAtLeastOneUrl = true;
                break;
            }
        }

        if (!$hasAtLeastOneUrl) {
            return response()->json(['error' => 'At least one URL must be provided'], 422);
        }

        // Map the form fields to database fields
        if (!empty($validated['personalWebsite'])) {
            $academician->personal_website = $validated['personalWebsite'];
        }
        
        if (!empty($validated['institutionalWebsite'])) {
            $academician->institution_website = $validated['institutionalWebsite'];
        }
        
        if (!empty($validated['linkedinProfile'])) {
            $academician->linkedin = $validated['linkedinProfile'];
        }
        
        // Update Google Scholar URL directly
        if (!empty($validated['scholarProfile'])) {
            $academician->google_scholar = $validated['scholarProfile'];
        }
        
        // Update ResearchGate URL directly
        if (!empty($validated['researchgateProfile'])) {
            $academician->researchgate = $validated['researchgateProfile'];
        }
        
        // Store institutional website in the session for later use
        if (!empty($validated['institutionalWebsite'])) {
            session(['institutional_website' => $validated['institutionalWebsite']]);
        }
        
        $academician->save();
        
        // Set a generation flag in the session to indicate generation is in progress
        session(['ai_profile_generation_in_progress' => true]);
        session(['ai_profile_generation_method' => 'url']);
        
        // Actually initiate the generation process here
        try {
            // Collect all URLs for processing (include the new institution_website)
            $urls = [];
            if ($academician->personal_website) $urls[] = $academician->personal_website;
            if ($academician->institution_website) $urls[] = $academician->institution_website;
            if ($academician->linkedin) $urls[] = $academician->linkedin;
            if ($academician->google_scholar) $urls[] = $academician->google_scholar;
            if ($academician->researchgate) $urls[] = $academician->researchgate;
            if (session('institutional_website')) $urls[] = session('institutional_website');
            
            // Create a new request with the URL mode
            $generationRequest = new Request();
            $generationRequest->merge([
                'mode' => 'url',
                'urls' => $urls
            ]);
            
            // Call the existing generateProfile method
            // We don't need to wait for the result, as we'll fetch it later
            $this->generateProfile($generationRequest);
            
            return response()->json([
                'status' => 'success',
                'message' => 'URLs saved successfully. Profile generation initiated.',
                'generation_initiated' => true
            ]);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Error initiating URL-based profile generation: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to initiate profile generation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check the generation status and retrieve the generated profile if available
     */
    public function checkGenerationStatus(Request $request)
    {
        $user = Auth::user();
        
        if (!BouncerFacade::is($user)->an('academician')) {
            return response()->json(['error' => 'User is not an academician'], 403);
        }

        $academician = $user->academician()->first();
        
        if (!$academician) {
            return response()->json(['error' => 'Academician profile not found'], 404);
        }

        $generationInProgress = session('ai_profile_generation_in_progress', false);
        $generationMethod = session('ai_profile_generation_method', null);

        // Check if we already have cached results
        $cacheKey = 'academician_profile_' . $user->id;
        $cachedProfile = \Illuminate\Support\Facades\Cache::get($cacheKey);
        
        if ($cachedProfile) {
            // Clear the session flags once generation is complete
            session()->forget(['ai_profile_generation_in_progress', 'ai_profile_generation_method']);
            
            // Return the cached profile data
            return response()->json($cachedProfile);
        }
        
        // For manual testing, we'll simulate completed generation when requested
        $isCompleted = $request->has('simulate_completed') ? true : false;

        if ($isCompleted) {
            // Clear the session flags once generation is complete
            session()->forget(['ai_profile_generation_in_progress', 'ai_profile_generation_method']);
            
            // Generate the profile using the existing generateProfile method
            // This approach reuses your existing implementation
            $generationRequest = new Request();
            $generationRequest->merge([
                'mode' => $generationMethod,
                'urls' => session('institutional_website') ? [$academician->website, $academician->linkedin, $academician->google_scholar, $academician->researchgate, session('institutional_website')] : []
            ]);
            
            // Call the existing method
            return $this->generateProfile($generationRequest);
        }
        
        return response()->json([
            'status' => 'in_progress',
            'method' => $generationMethod,
        ]);
    }

    /**
     * Show Google Scholar publications for the authenticated academician
     * 
     * @return \Inertia\Response
     */
    public function showPublications()
    {
        $user = Auth::user();
        
        if (!BouncerFacade::is($user)->an('academician')) {
            return redirect()->route('dashboard');
        }
        
        $academician = $user->academician;
        
        // Get the scholar profile to check if it exists
        $scholarProfile = $academician->scholarProfile;
        
        // Get publications for this academician, ordered by year (desc) and citations (desc)
        $publications = $academician->publications()
            ->orderBy('year', 'desc')
            ->orderBy('citations', 'desc')
            ->get();
            
        // Get research options for consistency with other views
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
        
        return Inertia::render('Role/GoogleScholar', [
            'academician' => $academician,
            'university' => UniversityList::find($academician->university),
            'faculty' => FacultyList::find($academician->faculty),
            'user' => $user,
            'publications' => $publications,
            'scholarProfile' => $scholarProfile,
            'researchOptions' => $researchOptions,
            'isEditing' => true, // Flag to indicate this is the edit view
        ]);
    }
}
