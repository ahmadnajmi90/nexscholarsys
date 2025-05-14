<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use App\Models\UniversityList;
use App\Models\FacultyList;
use App\Models\FieldOfResearch;
use App\Models\ResearchArea;
use App\Models\NicheDomain;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use App\Mail\ProfileUpdateReminder;
use Illuminate\Support\Facades\Auth;

class ProfileReminderController extends Controller
{
    /**
     * Number of items per page for each role table
     */
    const ITEMS_PER_PAGE = 10;

    /**
     * Construct the controller with admin middleware
     */
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!Auth::check() || !BouncerFacade::is(Auth::user())->an('admin')) {
                abort(403, 'Unauthorized action.');
            }
            
            return $next($request);
        });
    }
    
    /**
     * Display the profile management page with paginated data
     */
    public function index(Request $request)
    {
        // Get universities and faculties for dropdowns
        $universities = UniversityList::pluck('full_name', 'id')->all();
        $faculties = FacultyList::pluck('name', 'id')->all();
        
        // Academicians with pagination
        $academiciansPaginated = User::whereIs('academician')
            ->with('academician.universityDetails', 'academician.faculty')
            ->paginate(self::ITEMS_PER_PAGE, ['*'], 'academicians_page');
            
        $academicians = [
            'data' => $academiciansPaginated->items(),
            'links' => $academiciansPaginated->links()->toHtml(),
            'current_page' => $academiciansPaginated->currentPage(),
            'last_page' => $academiciansPaginated->lastPage(),
            'from' => $academiciansPaginated->firstItem(),
            'to' => $academiciansPaginated->lastItem(),
            'total' => $academiciansPaginated->total(),
            'per_page' => $academiciansPaginated->perPage(),
        ];
        
        // Postgraduates with pagination
        $postgraduatesPaginated = User::whereIs('postgraduate')
            ->with('postgraduate.universityDetails', 'postgraduate.faculty')
            ->paginate(self::ITEMS_PER_PAGE, ['*'], 'postgraduates_page');
            
        $postgraduates = [
            'data' => $postgraduatesPaginated->items(),
            'links' => $postgraduatesPaginated->links()->toHtml(),
            'current_page' => $postgraduatesPaginated->currentPage(),
            'last_page' => $postgraduatesPaginated->lastPage(),
            'from' => $postgraduatesPaginated->firstItem(),
            'to' => $postgraduatesPaginated->lastItem(),
            'total' => $postgraduatesPaginated->total(),
            'per_page' => $postgraduatesPaginated->perPage(),
        ];
        
        // Undergraduates with pagination
        $undergraduatesPaginated = User::whereIs('undergraduate')
            ->with('undergraduate.universityDetails', 'undergraduate.faculty')
            ->paginate(self::ITEMS_PER_PAGE, ['*'], 'undergraduates_page');
            
        $undergraduates = [
            'data' => $undergraduatesPaginated->items(),
            'links' => $undergraduatesPaginated->links()->toHtml(),
            'current_page' => $undergraduatesPaginated->currentPage(),
            'last_page' => $undergraduatesPaginated->lastPage(),
            'from' => $undergraduatesPaginated->firstItem(),
            'to' => $undergraduatesPaginated->lastItem(),
            'total' => $undergraduatesPaginated->total(),
            'per_page' => $undergraduatesPaginated->perPage(),
        ];
        
        // Prepare research options in the same format as in FacultyAdminController
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
        
        return Inertia::render('Admin/ProfileReminder', [
            'academicians' => $academicians,
            'postgraduates' => $postgraduates,
            'undergraduates' => $undergraduates,
            'universities' => $universities,
            'faculties' => $faculties,
            'researchOptions' => $researchOptions,
        ]);
    }
    
    /**
     * Send a profile update reminder email
     */
    public function sendReminder(Request $request)
    {
        $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'role' => 'required|string|in:academician,postgraduate,undergraduate',
        ]);
        
        $user = User::findOrFail($request->userId);
        
        // Send email reminder
        Mail::to($user->email)->send(new ProfileUpdateReminder($user, $request->role));
        
        return response()->json(['success' => true, 'message' => 'Reminder sent successfully']);
    }
    
    /**
     * Send profile update reminder emails to multiple users
     */
    public function sendBatchReminder(Request $request)
    {
        $request->validate([
            'userIds' => 'required|array',
            'userIds.*' => 'integer|exists:users,id',
            'role' => 'required|string|in:academician,postgraduate,undergraduate',
        ]);
        
        $users = User::whereIn('id', $request->userIds)->get();
        
        foreach ($users as $user) {
            // Send email reminder
            Mail::to($user->email)->send(new ProfileUpdateReminder($user, $request->role));
        }
        
        return response()->json([
            'success' => true, 
            'message' => 'Batch reminders sent successfully',
            'count' => count($users)
        ]);
    }
}