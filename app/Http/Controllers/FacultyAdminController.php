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
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;

class FacultyAdminController extends Controller
{
    // Show the Faculty Admin creation page
    public function index()
    {
        if(Auth::user()->cannot('create-facultyAdmin')) {
            abort(403, 'You do not have permission to view this page.');
        }
        else{
            $universities = UniversityList::all(); // Assuming a University model
            $faculties = FacultyList::all(); // Assuming a University model
            return inertia('Admin/FacultyAdmins', [
                'universities' => $universities,
                'faculties' => $faculties,
            ]);
        }
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
        $isFacultyAdmin = BouncerFacade::is(auth()->user())->an('faculty_admin'); // Assuming you have a method to check if the user is a faculty admin
        if(!$isFacultyAdmin) {
            abort(403, 'You do not have permission to view this page.');
        }
        else{
            $facultyAdmin = auth()->user(); // Assuming the faculty admin is logged in
            $facultyId = $facultyAdmin->facultyAdmin->faculty; // Assuming `faculty_admin` relationship exists
            $universities = UniversityList::all(); // Assuming a University model
            $faculties = FacultyList::all(); // Assuming a University model

            // Fetch unverified academicians in the same faculty
            $academicians = Academician::where('faculty', $facultyId)
            ->where('verified', false)
            ->with('user') // Assuming you want user details too
            ->get();

            return inertia('FacultyAdmin/AcademiciansList', [
                'academicians' => $academicians,
                'universities' => $universities,
                'faculties' => $faculties,
            ]);
        }
    }

    // Verify an academician
    public function verifyAcademician($id)
    {
        $isFacultyAdmin = BouncerFacade::is(auth()->user())->an('faculty_admin'); // Assuming you have a method to check if the user is a faculty admin
        if(!$isFacultyAdmin) {
            abort(403, 'You do not have permission to view this page.');
        }
        else{
            $academician = Academician::findOrFail($id);

            // Check if the faculty admin has permission to verify this academician
            if (auth()->user()->facultyAdmin->faculty !== $academician->faculty) {
                abort(403, 'You do not have permission to verify this academician.');
            }

            // Update verified status
            $academician->update(['verified' => true]);

            return back()->with('success', 'Academician verified successfully.');
        }
    }
}
