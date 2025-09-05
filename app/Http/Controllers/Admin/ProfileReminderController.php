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

        // Initialize filter options
        $universities = [];
        $faculties = [];
        $statuses = ['Complete', 'Needs Update'];

        // Load data only for the active tab
        switch ($activeTab) {
            case 'academicians':
                $academicians = $this->getAcademiciansData($request);
                $universities = $this->getUniversitiesFromAcademicians($request);
                $faculties = $this->getFacultiesFromAcademicians($request);
                break;
            case 'postgraduates':
                $postgraduates = $this->getPostgraduatesData($request);
                $universities = $this->getUniversitiesFromPostgraduates($request);
                $faculties = $this->getFacultiesFromPostgraduates($request);
                break;
            case 'undergraduates':
                $undergraduates = $this->getUndergraduatesData($request);
                $universities = $this->getUniversitiesFromUndergraduates($request);
                $faculties = $this->getFacultiesFromUndergraduates($request);
                break;
        }

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
            'researchOptions' => $researchOptions,
            'universities' => $universities,
            'faculties' => $faculties,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Get academicians data
     */
    private function getAcademiciansData(Request $request)
    {
        $query = User::whereIs('academician')
            ->with('academician.universityDetails', 'academician.faculty');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('academician', function ($academicianQuery) use ($search) {
                      $academicianQuery->where('full_name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply university filter
        if ($request->filled('university')) {
            $query->whereHas('academician', function ($academicianQuery) use ($request) {
                $academicianQuery->where('university', $request->university);
            });
        }

        // Apply faculty filter
        if ($request->filled('faculty')) {
            $query->whereHas('academician', function ($academicianQuery) use ($request) {
                $academicianQuery->where('faculty', $request->faculty);
            });
        }

        // Apply status filter - Academicians: bio, research_expertise, profile_picture != profile_pictures/default.jpg
        if ($request->filled('status')) {
            if ($request->status === 'Complete') {
                $query->whereHas('academician', function ($academicianQuery) {
                    $academicianQuery->whereNotNull('bio')
                        ->whereNotNull('research_expertise')
                        ->whereNotNull('profile_picture')
                        ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                });
            } elseif ($request->status === 'Needs Update') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('academician')
                        ->orWhereHas('academician', function ($academicianQuery) {
                            $academicianQuery->whereNull('bio')
                                ->orWhereNull('research_expertise')
                                ->orWhereNull('profile_picture')
                                ->orWhere('profile_picture', '=', 'profile_pictures/default.jpg');
                        });
                });
            }
        }

        return $query->paginate(self::ITEMS_PER_PAGE, ['*'], 'academicians_page')
            ->withQueryString();
    }

    /**
     * Get postgraduates data
     */
    private function getPostgraduatesData(Request $request)
    {
        $query = User::whereIs('postgraduate')
            ->with('postgraduate.universityDetails', 'postgraduate.faculty');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('postgraduate', function ($postgraduateQuery) use ($search) {
                      $postgraduateQuery->where('full_name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply university filter
        if ($request->filled('university')) {
            $query->whereHas('postgraduate', function ($postgraduateQuery) use ($request) {
                $postgraduateQuery->where('university', $request->university);
            });
        }

        // Apply faculty filter
        if ($request->filled('faculty')) {
            $query->whereHas('postgraduate', function ($postgraduateQuery) use ($request) {
                $postgraduateQuery->where('faculty', $request->faculty);
            });
        }

        // Apply status filter - Postgraduates: bio, field_of_research, profile_picture != default.jpg
        if ($request->filled('status')) {
            if ($request->status === 'Complete') {
                $query->whereHas('postgraduate', function ($postgraduateQuery) {
                    $postgraduateQuery->whereNotNull('bio')
                        ->whereNotNull('field_of_research')
                        ->whereNotNull('profile_picture')
                        ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                });
            } elseif ($request->status === 'Needs Update') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('postgraduate')
                        ->orWhereHas('postgraduate', function ($postgraduateQuery) {
                            $postgraduateQuery->whereNull('bio')
                                ->orWhereNull('field_of_research')
                                ->orWhereNull('profile_picture')
                                ->orWhere('profile_picture', '=', 'profile_pictures/default.jpg');
                        });
                });
            }
        }

        return $query->paginate(self::ITEMS_PER_PAGE, ['*'], 'postgraduates_page')
            ->withQueryString();
    }

    /**
     * Get undergraduates data
     */
    private function getUndergraduatesData(Request $request)
    {
        $query = User::whereIs('undergraduate')
            ->with('undergraduate.universityDetails', 'undergraduate.faculty');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('undergraduate', function ($undergraduateQuery) use ($search) {
                      $undergraduateQuery->where('full_name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply university filter
        if ($request->filled('university')) {
            $query->whereHas('undergraduate', function ($undergraduateQuery) use ($request) {
                $undergraduateQuery->where('university', $request->university);
            });
        }

        // Apply faculty filter
        if ($request->filled('faculty')) {
            $query->whereHas('undergraduate', function ($undergraduateQuery) use ($request) {
                $undergraduateQuery->where('faculty', $request->faculty);
            });
        }

        // Apply status filter - Undergraduates: bio, profile_picture != default.jpg
        if ($request->filled('status')) {
            if ($request->status === 'Complete') {
                $query->whereHas('undergraduate', function ($undergraduateQuery) {
                    $undergraduateQuery->whereNotNull('bio')
                        ->whereNotNull('profile_picture')
                        ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                });
            } elseif ($request->status === 'Needs Update') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('undergraduate')
                        ->orWhereHas('undergraduate', function ($undergraduateQuery) {
                            $undergraduateQuery->whereNull('bio')
                                ->orWhereNull('profile_picture')
                                ->orWhere('profile_picture', '=', 'profile_pictures/default.jpg');
                        });
                });
            }
        }

        return $query->paginate(self::ITEMS_PER_PAGE, ['*'], 'undergraduates_page')
            ->withQueryString();
    }


    
    /**
     * Get universities from academicians data
     */
    private function getUniversitiesFromAcademicians(Request $request)
    {
        $query = User::whereIs('academician')
            ->with('academician.universityDetails')
            ->join('academicians', 'users.unique_id', '=', 'academicians.academician_id')
            ->join('university_list', 'academicians.university', '=', 'university_list.id')
            ->select('university_list.id', 'university_list.full_name as name')
            ->distinct();

        // Apply the same filters as data query for consistency
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('academicians.full_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'Complete') {
                $query->whereHas('academician', function ($academicianQuery) {
                    $academicianQuery->whereNotNull('bio')
                        ->whereNotNull('research_expertise')
                        ->whereNotNull('profile_picture')
                        ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                });
            } elseif ($request->status === 'Needs Update') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('academician')
                        ->orWhereHas('academician', function ($academicianQuery) {
                            $academicianQuery->whereNull('bio')
                                ->orWhereNull('research_expertise')
                                ->orWhereNull('profile_picture')
                                ->orWhere('profile_picture', '=', 'profile_pictures/default.jpg');
                        });
                });
            }
        }

        $universities = $query->get()->map(function ($item) {
            return ['id' => $item->id, 'name' => $item->name];
        })->toArray();

        // Ensure selected university from query params is included if not already present
        if ($request->filled('university')) {
            $selectedUniversityId = $request->university;
            $universityExists = collect($universities)->contains('id', $selectedUniversityId);

            if (!$universityExists) {
                $selectedUniversity = \App\Models\UniversityList::find($selectedUniversityId);
                if ($selectedUniversity) {
                    $universities[] = [
                        'id' => $selectedUniversity->id,
                        'name' => $selectedUniversity->full_name
                    ];
                }
            }
        }

        return $universities;
    }

    /**
     * Get faculties from academicians data
     */
    private function getFacultiesFromAcademicians(Request $request)
    {
        $query = User::whereIs('academician')
            ->with('academician.faculty')
            ->join('academicians', 'users.unique_id', '=', 'academicians.academician_id')
            ->join('faculty_list', 'academicians.faculty', '=', 'faculty_list.id')
            ->select('faculty_list.id', 'faculty_list.name as name')
            ->distinct();

        // Apply the same filters as data query for consistency
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('academicians.full_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('university')) {
            $query->where('academicians.university', $request->university);
        }

        if ($request->filled('status')) {
            if ($request->status === 'Complete') {
                $query->whereHas('academician', function ($academicianQuery) {
                    $academicianQuery->whereNotNull('bio')
                        ->whereNotNull('research_expertise')
                        ->whereNotNull('profile_picture')
                        ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                });
            } elseif ($request->status === 'Needs Update') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('academician')
                        ->orWhereHas('academician', function ($academicianQuery) {
                            $academicianQuery->whereNull('bio')
                                ->orWhereNull('research_expertise')
                                ->orWhereNull('profile_picture')
                                ->orWhere('profile_picture', '=', 'profile_pictures/default.jpg');
                        });
                });
            }
        }

        $faculties = $query->get()->map(function ($item) {
            return ['id' => $item->id, 'name' => $item->name];
        })->toArray();

        // Ensure selected faculty from query params is included if not already present
        if ($request->filled('faculty')) {
            $selectedFacultyId = $request->faculty;
            $facultyExists = collect($faculties)->contains('id', $selectedFacultyId);

            if (!$facultyExists) {
                $selectedFaculty = \App\Models\FacultyList::find($selectedFacultyId);
                if ($selectedFaculty) {
                    $faculties[] = [
                        'id' => $selectedFaculty->id,
                        'name' => $selectedFaculty->name
                    ];
                }
            }
        }

        return $faculties;
    }

    /**
     * Get universities from postgraduates data
     */
    private function getUniversitiesFromPostgraduates(Request $request)
    {
        $query = User::whereIs('postgraduate')
            ->with('postgraduate.universityDetails')
            ->join('postgraduates', 'users.unique_id', '=', 'postgraduates.postgraduate_id')
            ->join('university_list', 'postgraduates.university', '=', 'university_list.id')
            ->select('university_list.id', 'university_list.full_name as name')
            ->distinct();

        // Apply the same filters as data query for consistency
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('postgraduates.full_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'Complete') {
                $query->whereHas('postgraduate', function ($postgraduateQuery) {
                    $postgraduateQuery->whereNotNull('bio')
                        ->whereNotNull('field_of_research')
                        ->whereNotNull('profile_picture')
                        ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                });
            } elseif ($request->status === 'Needs Update') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('postgraduate')
                        ->orWhereHas('postgraduate', function ($postgraduateQuery) {
                            $postgraduateQuery->whereNull('bio')
                                ->orWhereNull('field_of_research')
                                ->orWhereNull('profile_picture')
                                ->orWhere('profile_picture', '=', 'profile_pictures/default.jpg');
                        });
                });
            }
        }

        $universities = $query->get()->map(function ($item) {
            return ['id' => $item->id, 'name' => $item->name];
        })->toArray();

        // Ensure selected university from query params is included if not already present
        if ($request->filled('university')) {
            $selectedUniversityId = $request->university;
            $universityExists = collect($universities)->contains('id', $selectedUniversityId);

            if (!$universityExists) {
                $selectedUniversity = \App\Models\UniversityList::find($selectedUniversityId);
                if ($selectedUniversity) {
                    $universities[] = [
                        'id' => $selectedUniversity->id,
                        'name' => $selectedUniversity->full_name
                    ];
                }
            }
        }

        return $universities;
    }

    /**
     * Get faculties from postgraduates data
     */
    private function getFacultiesFromPostgraduates(Request $request)
    {
        $query = User::whereIs('postgraduate')
            ->with('postgraduate.faculty')
            ->join('postgraduates', 'users.unique_id', '=', 'postgraduates.postgraduate_id')
            ->join('faculty_list', 'postgraduates.faculty', '=', 'faculty_list.id')
            ->select('faculty_list.id', 'faculty_list.name as name')
            ->distinct();

        // Apply the same filters as data query for consistency
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('postgraduates.full_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('university')) {
            $query->where('postgraduates.university', $request->university);
        }

        if ($request->filled('status')) {
            if ($request->status === 'Complete') {
                $query->whereHas('postgraduate', function ($postgraduateQuery) {
                    $postgraduateQuery->whereNotNull('bio')
                        ->whereNotNull('field_of_research')
                        ->whereNotNull('profile_picture')
                        ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                });
            } elseif ($request->status === 'Needs Update') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('postgraduate')
                        ->orWhereHas('postgraduate', function ($postgraduateQuery) {
                            $postgraduateQuery->whereNull('bio')
                                ->orWhereNull('field_of_research')
                                ->orWhereNull('profile_picture')
                                ->orWhere('profile_picture', '=', 'profile_pictures/default.jpg');
                        });
                });
            }
        }

        $faculties = $query->get()->map(function ($item) {
            return ['id' => $item->id, 'name' => $item->name];
        })->toArray();

        // Ensure selected faculty from query params is included if not already present
        if ($request->filled('faculty')) {
            $selectedFacultyId = $request->faculty;
            $facultyExists = collect($faculties)->contains('id', $selectedFacultyId);

            if (!$facultyExists) {
                $selectedFaculty = \App\Models\FacultyList::find($selectedFacultyId);
                if ($selectedFaculty) {
                    $faculties[] = [
                        'id' => $selectedFaculty->id,
                        'name' => $selectedFaculty->name
                    ];
                }
            }
        }

        return $faculties;
    }

    /**
     * Get universities from undergraduates data
     */
    private function getUniversitiesFromUndergraduates(Request $request)
    {
        $query = User::whereIs('undergraduate')
            ->with('undergraduate.universityDetails')
            ->join('undergraduates', 'users.unique_id', '=', 'undergraduates.undergraduate_id')
            ->join('university_list', 'undergraduates.university', '=', 'university_list.id')
            ->select('university_list.id', 'university_list.full_name as name')
            ->distinct();

        // Apply the same filters as data query for consistency
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('undergraduates.full_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'Complete') {
                $query->whereHas('undergraduate', function ($undergraduateQuery) {
                    $undergraduateQuery->whereNotNull('bio')
                        ->whereNotNull('profile_picture')
                        ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                });
            } elseif ($request->status === 'Needs Update') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('undergraduate')
                        ->orWhereHas('undergraduate', function ($undergraduateQuery) {
                            $undergraduateQuery->whereNull('bio')
                                ->orWhereNull('profile_picture')
                                ->orWhere('profile_picture', '=', 'profile_pictures/default.jpg');
                        });
                });
            }
        }

        $universities = $query->get()->map(function ($item) {
            return ['id' => $item->id, 'name' => $item->name];
        })->toArray();

        // Ensure selected university from query params is included if not already present
        if ($request->filled('university')) {
            $selectedUniversityId = $request->university;
            $universityExists = collect($universities)->contains('id', $selectedUniversityId);

            if (!$universityExists) {
                $selectedUniversity = \App\Models\UniversityList::find($selectedUniversityId);
                if ($selectedUniversity) {
                    $universities[] = [
                        'id' => $selectedUniversity->id,
                        'name' => $selectedUniversity->full_name
                    ];
                }
            }
        }

        return $universities;
    }

    /**
     * Get faculties from undergraduates data
     */
    private function getFacultiesFromUndergraduates(Request $request)
    {
        $query = User::whereIs('undergraduate')
            ->with('undergraduate.faculty')
            ->join('undergraduates', 'users.unique_id', '=', 'undergraduates.undergraduate_id')
            ->join('faculty_list', 'undergraduates.faculty', '=', 'faculty_list.id')
            ->select('faculty_list.id', 'faculty_list.name as name')
            ->distinct();

        // Apply the same filters as data query for consistency
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('undergraduates.full_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('university')) {
            $query->where('undergraduates.university', $request->university);
        }

        if ($request->filled('status')) {
            if ($request->status === 'Complete') {
                $query->whereHas('undergraduate', function ($undergraduateQuery) {
                    $undergraduateQuery->whereNotNull('bio')
                        ->whereNotNull('profile_picture')
                        ->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                });
            } elseif ($request->status === 'Needs Update') {
                $query->where(function ($q) {
                    $q->whereDoesntHave('undergraduate')
                        ->orWhereHas('undergraduate', function ($undergraduateQuery) {
                            $undergraduateQuery->whereNull('bio')
                                ->orWhereNull('profile_picture')
                                ->orWhere('profile_picture', '=', 'profile_pictures/default.jpg');
                        });
                });
            }
        }

        $faculties = $query->get()->map(function ($item) {
            return ['id' => $item->id, 'name' => $item->name];
        })->toArray();

        // Ensure selected faculty from query params is included if not already present
        if ($request->filled('faculty')) {
            $selectedFacultyId = $request->faculty;
            $facultyExists = collect($faculties)->contains('id', $selectedFacultyId);

            if (!$facultyExists) {
                $selectedFaculty = \App\Models\FacultyList::find($selectedFacultyId);
                if ($selectedFaculty) {
                    $faculties[] = [
                        'id' => $selectedFaculty->id,
                        'name' => $selectedFaculty->name
                    ];
                }
            }
        }

        return $faculties;
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