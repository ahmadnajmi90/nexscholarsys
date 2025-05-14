<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\FacultyAdmin;
use App\Models\UniversityList;
use App\Models\FacultyList;
use App\Notifications\FacultyAdminInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\Academician;
use App\Models\FieldOfResearch;
use App\Models\ResearchArea;
use App\Models\NicheDomain;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FacultyAdminController extends Controller
{
    // Show the Faculty Admin creation page
    public function index()
    {
        // if(Auth::user()->cannot('create-facultyAdmin')) {
        //     abort(403, 'You do not have permission to view this page.');
        // }
        // else{
            $universities = UniversityList::all(); // Assuming a University model
            $faculties = FacultyList::all(); // Assuming a University model
            return inertia('Admin/FacultyAdmins', [
                'universities' => $universities,
                'faculties' => $faculties,
            ]);
        // }
    }

    // Store a new Faculty Admin
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'worker_id' => 'nullable|string|max:255',
            'university' => 'nullable|exists:university_list,id',
            'faculty' => 'nullable|exists:faculty_list,id',
        ]);

        // Retrieve the faculty name based on the provided faculty ID
        $faculty = FacultyList::find($request->faculty);
        $facultyName = $faculty ? $faculty->name : null;

        // Check if faculty name exists
        if (!$facultyName) {
            return back()->withErrors(['faculty' => 'Invalid faculty selected.']);
        }

        $uniqueId = 'FA-' . Str::random(8);

        // Create the user
        $user = User::create([
            'name' => $facultyName,
            'email' => $request->email,
            'password' => Hash::make("password"),
            'unique_id' => $uniqueId,
            'is_profile_complete' => true,
        ]);

        $user->assign('faculty_admin');

        // Create the faculty admin record
        FacultyAdmin::create([
            'worker_id' => $request->worker_id,
            'faculty_admin_id' => $uniqueId,
            'faculty_name' => $facultyName,
            'university' => $request->university,
            'faculty' => $request->faculty,
            'profile_picture' => "faculty_profile_pictures/default.jpg",
            'background_image' => "faculty_background_images/default.jpg",
        ]);

        // Send confirmation email
        $user->notify(new FacultyAdminInvitation($user));

        return back()->with('success', 'Faculty Admin has been created and invited via email.');
    }

    // Handle account confirmation
    public function confirm($id)
    {
        $user = User::findOrFail($id);

        $user->update(['email_verified_at' => now()]);
    
        // Redirect to the dashboard or login page
        return redirect()->route('dashboard')->with('success', 'Your email has been verified. You can now log in.');
    }

    public function listAcademicians(Request $request)
    {
        $isFacultyAdmin = BouncerFacade::is(Auth::user())->an('faculty_admin');
        if(!$isFacultyAdmin) {
            abort(403, 'You do not have permission to view this page.');
        }
        else{
            // Get the faculty admin record for the authenticated user
            $facultyAdmin = FacultyAdmin::where('faculty_admin_id', Auth::user()->unique_id)->first();
            if (!$facultyAdmin) {
                abort(403, 'Faculty admin record not found.');
            }
            
            $facultyId = $facultyAdmin->faculty; // Get the faculty ID
            $universities = UniversityList::all();
            $faculties = FacultyList::all();

            // Fetch unverified academicians in the same faculty
            $academicians = Academician::where('faculty', $facultyId)
                ->where('verified', false)
                ->with('user')
                ->get();
            
            // Prepare research options in the same format as AcademicianController
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
            
            return inertia('FacultyAdmin/AcademiciansList', [
                'academicians' => $academicians,
                'universities' => $universities,
                'faculties' => $faculties,
                'researchOptions' => $researchOptions,
            ]);
        }
    }
    
    /**
     * List all academicians in the faculty admin's faculty
     */
    public function listAllAcademicians(Request $request)
    {
        // Check if user is a faculty admin
        $isFacultyAdmin = BouncerFacade::is(Auth::user())->an('faculty_admin');
        if(!$isFacultyAdmin) {
            abort(403, 'You do not have permission to view this page.');
        }
        
        // Get the faculty admin record for the authenticated user
        $facultyAdmin = FacultyAdmin::where('faculty_admin_id', Auth::user()->unique_id)->first();
        if (!$facultyAdmin) {
            abort(403, 'Faculty admin record not found.');
        }
        
        $facultyId = $facultyAdmin->faculty; // Get the faculty ID
        $faculty = FacultyList::with('university')->find($facultyId);
        
        // Get all academicians in the same faculty
        $academicians = Academician::where('faculty', $facultyId)
            ->with('user')
            ->orderBy('verified', 'asc') // Show unverified first
            ->orderBy('full_name', 'asc') // Then sort by name
            ->get();
        
        // Prepare research options for filtering
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
        
        // Return the view with academicians and supporting data
        return inertia('FacultyAdmin/AcademicianDirectory', [
            'academicians' => $academicians,
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
            'faculty' => $faculty,
            'researchOptions' => $researchOptions,
            'users' => User::all(),
        ]);
    }

    // Verify an academician
    public function verifyAcademician($id)
    {
        $isFacultyAdmin = BouncerFacade::is(Auth::user())->an('faculty_admin');
        if(!$isFacultyAdmin) {
            abort(403, 'You do not have permission to view this page.');
        }
        else{
            $academician = Academician::findOrFail($id);
            
            // Get the faculty admin record for the authenticated user
            $facultyAdmin = FacultyAdmin::where('faculty_admin_id', Auth::user()->unique_id)->first();
            if (!$facultyAdmin) {
                abort(403, 'Faculty admin record not found.');
            }

            // Check if the faculty admin has permission to verify this academician
            if ($facultyAdmin->faculty !== $academician->faculty) {
                abort(403, 'You do not have permission to verify this academician.');
            }

            // Update verified status
            $academician->update(['verified' => true]);

            return back()->with('success', 'Academician verified successfully.');
        }
    }
    
    // Verify multiple academicians in batch
    public function verifyAcademiciansBatch(Request $request)
    {
        // Enhanced logging for CSRF debugging
        Log::info('Batch verification request headers', [
            'csrf_token' => $request->header('X-CSRF-TOKEN'),
            'x_xsrf_token' => $request->header('X-XSRF-TOKEN'),
            'x_inertia' => $request->header('X-Inertia'),
            'all_headers' => $request->header()
        ]);
        
        // Log raw request data for debugging
        Log::info('Batch verification raw request', [
            'request_all' => $request->all(),
            'request_input' => $request->input(),
            'content_type' => $request->header('Content-Type'),
            'academician_ids_direct' => $request->input('academician_ids'),
            'method' => $request->method(),
            'user_id' => Auth::id(),
            'user_unique_id' => Auth::user()->unique_id ?? 'unknown'
        ]);
        
        // Simplified validation approach - directly validate the request
        try {
            $validated = $request->validate([
                'academician_ids' => 'required|array',
                'academician_ids.*' => 'required|integer|exists:academicians,id',
            ]);
            
            Log::info('Validation passed', [
                'validated_data' => $validated
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation failed for batch verification', [
                'errors' => $e->errors()
            ]);
            return back()->withErrors($e->errors());
        }
        
        $isFacultyAdmin = BouncerFacade::is(Auth::user())->an('faculty_admin');
        if(!$isFacultyAdmin) {
            Log::warning('Non-faculty admin attempted batch verification', [
                'user_id' => Auth::id()
            ]);
            abort(403, 'You do not have permission to view this page.');
        }
        
        // Get the faculty admin record for the authenticated user
        $facultyAdmin = FacultyAdmin::where('faculty_admin_id', Auth::user()->unique_id)->first();
        if (!$facultyAdmin) {
            Log::warning('Faculty admin record not found', [
                'user_id' => Auth::id(),
                'unique_id' => Auth::user()->unique_id
            ]);
            abort(403, 'Faculty admin record not found.');
        }
        
        $facultyId = $facultyAdmin->faculty;
        $successCount = 0;
        $unauthorizedCount = 0;
        $errorCount = 0;
        
        Log::info('Processing academician IDs', [
            'faculty_id' => $facultyId,
            'count' => count($validated['academician_ids'])
        ]);
        
        // Process each academician ID
        foreach ($validated['academician_ids'] as $academicianId) {
            try {
                $academician = Academician::findOrFail($academicianId);
                
                // Check if the faculty admin has permission to verify this academician
                if ($academician->faculty !== $facultyId) {
                    $unauthorizedCount++;
                    Log::warning('Unauthorized verification attempt', [
                        'faculty_admin_id' => Auth::user()->unique_id,
                        'academician_id' => $academicianId,
                        'admin_faculty' => $facultyId,
                        'academician_faculty' => $academician->faculty
                    ]);
                    continue; // Skip this academician
                }
                
                // Only verify if not already verified
                if (!$academician->verified) {
                    $academician->update(['verified' => true]);
                    $successCount++;
                    Log::info('Academician verified', [
                        'academician_id' => $academicianId,
                        'faculty_id' => $facultyId
                    ]);
                } else {
                    Log::info('Academician already verified', [
                        'academician_id' => $academicianId
                    ]);
                }
            } catch (\Exception $e) {
                $errorCount++;
                Log::error('Error verifying academician', [
                    'academician_id' => $academicianId,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }
        
        $message = "{$successCount} academician(s) verified successfully.";
        
        if ($unauthorizedCount > 0 || $errorCount > 0) {
            $message .= " However, ";
            
            if ($unauthorizedCount > 0) {
                $message .= "{$unauthorizedCount} academician(s) could not be verified due to permission issues.";
            }
            
            if ($errorCount > 0) {
                $message .= " {$errorCount} academician(s) could not be verified due to an error.";
            }
        }
        
        Log::info('Batch verification completed', [
            'success_count' => $successCount,
            'unauthorized_count' => $unauthorizedCount,
            'error_count' => $errorCount
        ]);
        
        return back()->with('success', $message);
    }
}
