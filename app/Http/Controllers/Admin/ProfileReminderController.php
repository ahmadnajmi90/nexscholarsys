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
        // Determine active tab (default to academicians)
        $activeTab = $request->input('tab', 'academicians');

        // Initialize data arrays
        $academicians = null;
        $postgraduates = null;
        $undergraduates = null;

        // Load data only for the active tab
        switch ($activeTab) {
            case 'academicians':
                $academicians = $this->getAcademiciansData($request);
                break;
            case 'postgraduates':
                $postgraduates = $this->getPostgraduatesData($request);
                break;
            case 'undergraduates':
                $undergraduates = $this->getUndergraduatesData($request);
                break;
        }

        // Generate filter options for all user types (for dropdowns)
        $filterOptions = $this->getFilterOptions();

        // Prepare research options
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
            'activeTab' => $activeTab,
            'filterOptions' => $filterOptions,
            'researchOptions' => $researchOptions,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Get academicians data with filters
     */
    private function getAcademiciansData(Request $request)
    {
        $query = User::whereIs('academician')->with('academician.universityDetails', 'academician.faculty');

        // Apply filters for Academicians
        $query->when($request->input('academicians_search'), function ($query, $search) {
            $query->whereHas('academician', fn($q) => $q->where('full_name', 'like', "%{$search}%"));
        });
        $query->when($request->input('academicians_university'), function ($query, $universityId) {
            $query->whereHas('academician', fn($q) => $q->where('university', $universityId));
        });
        $query->when($request->input('academicians_faculty'), function ($query, $facultyId) {
            $query->whereHas('academician', fn($q) => $q->where('faculty', $facultyId));
        });
        $query->when($request->input('academicians_status'), function ($query, $status) {
            $query->whereHas('academician', function ($q) use ($status) {
                if ($status === 'Complete') {
                    $q->whereNotNull('bio')
                      ->whereNotNull('profile_picture')
                      ->whereNotNull('research_expertise')
                      ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                } elseif ($status === 'Needs Update') {
                    $q->where(function ($subQuery) {
                        $subQuery->whereNull('bio')
                                ->orWhereNull('profile_picture')
                                ->orWhereNull('research_expertise')
                                ->orWhere('profile_picture', 'profile_pictures/default.jpg');
                    });
                }
            });
        });

        return $query->paginate(self::ITEMS_PER_PAGE, ['*'], 'academicians_page')->withQueryString();
    }

    /**
     * Get postgraduates data with filters
     */
    private function getPostgraduatesData(Request $request)
    {
        $query = User::whereIs('postgraduate')->with('postgraduate.universityDetails', 'postgraduate.faculty');

        // Apply filters for Postgraduates
        $query->when($request->input('postgraduates_search'), function ($query, $search) {
            $query->whereHas('postgraduate', fn($q) => $q->where('full_name', 'like', "%{$search}%"));
        });
        $query->when($request->input('postgraduates_university'), function ($query, $universityId) {
            $query->whereHas('postgraduate', fn($q) => $q->where('university', $universityId));
        });
        $query->when($request->input('postgraduates_faculty'), function ($query, $facultyId) {
            $query->whereHas('postgraduate', fn($q) => $q->where('faculty', $facultyId));
        });
        $query->when($request->input('postgraduates_status'), function ($query, $status) {
            $query->whereHas('postgraduate', function ($q) use ($status) {
                if ($status === 'Complete') {
                    $q->whereNotNull('bio')
                      ->whereNotNull('profile_picture')
                      ->whereNotNull('field_of_research')
                      ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                } elseif ($status === 'Needs Update') {
                    $q->where(function ($subQuery) {
                        $subQuery->whereNull('bio')
                                ->orWhereNull('profile_picture')
                                ->orWhereNull('field_of_research')
                                ->orWhere('profile_picture', 'profile_pictures/default.jpg');
                    });
                }
            });
        });

        return $query->paginate(self::ITEMS_PER_PAGE, ['*'], 'postgraduates_page')->withQueryString();
    }

    /**
     * Get undergraduates data with filters
     */
    private function getUndergraduatesData(Request $request)
    {
        $query = User::whereIs('undergraduate')->with('undergraduate.universityDetails', 'undergraduate.faculty');

        // Apply filters for Undergraduates
        $query->when($request->input('undergraduates_search'), function ($query, $search) {
            $query->whereHas('undergraduate', fn($q) => $q->where('full_name', 'like', "%{$search}%"));
        });
        $query->when($request->input('undergraduates_university'), function ($query, $universityId) {
            $query->whereHas('undergraduate', fn($q) => $q->where('university', $universityId));
        });
        $query->when($request->input('undergraduates_faculty'), function ($query, $facultyId) {
            $query->whereHas('undergraduate', fn($q) => $q->where('faculty', $facultyId));
        });
        $query->when($request->input('undergraduates_status'), function ($query, $status) {
            $query->whereHas('undergraduate', function ($q) use ($status) {
                if ($status === 'Complete') {
                    $q->whereNotNull('bio')
                      ->whereNotNull('profile_picture')
                      ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                } elseif ($status === 'Needs Update') {
                    $q->where(function ($subQuery) {
                        $subQuery->whereNull('bio')
                                ->orWhereNull('profile_picture')
                                ->orWhere('profile_picture', 'profile_pictures/default.jpg');
                    });
                }
            });
        });

        return $query->paginate(self::ITEMS_PER_PAGE, ['*'], 'undergraduates_page')->withQueryString();
    }

    /**
     * Get filter options for all user types
     */
    private function getFilterOptions()
    {
        return [
            'academicians' => [
                'universities' => UniversityList::whereHas('academicians')
                    ->pluck('full_name', 'id')
                    ->sort()
                    ->all(),
                'faculties' => FacultyList::whereHas('academicians')
                    ->select('id', 'name', 'university_id')
                    ->get()
                    ->sortBy('name')
                    ->toArray(),
            ],
            'postgraduates' => [
                'universities' => UniversityList::whereHas('postgraduates')
                    ->pluck('full_name', 'id')
                    ->sort()
                    ->all(),
                'faculties' => FacultyList::whereHas('postgraduates')
                    ->select('id', 'name', 'university_id')
                    ->get()
                    ->sortBy('name')
                    ->toArray(),
            ],
            'undergraduates' => [
                'universities' => UniversityList::whereHas('undergraduates')
                    ->pluck('full_name', 'id')
                    ->sort()
                    ->all(),
                'faculties' => FacultyList::whereHas('undergraduates')
                    ->select('id', 'name', 'university_id')
                    ->get()
                    ->sortBy('name')
                    ->toArray(),
            ],
        ];
    }

    /**
     * Get faculties for a specific university
     */
    public function getFacultiesByUniversity(Request $request)
    {
        $universityId = $request->input('university_id');
        $userType = $request->input('user_type', 'academicians');

        if (!$universityId) {
            return response()->json(['faculties' => []]);
        }

        // Get all faculties that belong to the specified university
        $faculties = FacultyList::where('university_id', $universityId)
            ->select('id', 'name', 'university_id')
            ->get()
            ->sortBy('name')
            ->toArray();


        return response()->json(['faculties' => $faculties]);
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