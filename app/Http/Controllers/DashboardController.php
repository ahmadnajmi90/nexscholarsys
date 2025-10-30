<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Silber\Bouncer\BouncerFacade;
use App\Models\PostGrant;
use App\Models\PostProject;
use App\Models\PostEvent;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use App\Models\CreatePost;
use App\Models\FieldOfResearch;
use App\Models\UniversityList;
use App\Models\FacultyList;
use Illuminate\Support\Facades\Log;
use App\Services\GoogleAnalyticsService;

class DashboardController extends Controller
{
    protected $googleAnalyticsService;

    public function __construct(GoogleAnalyticsService $googleAnalyticsService)
    {
        $this->googleAnalyticsService = $googleAnalyticsService;
    }

    public function index()
    {
        if (!Auth::user()->is_profile_complete) {
            return redirect()->route('profile.complete');
        }
        else{
            $postGrants = auth()->user()->postGrants;
            $user = Auth::user();
            
            // Check profile completeness based on role
            $profileIncompleteAlert = $this->checkProfileCompleteness($user);

            $isFacultyAdmin = BouncerFacade::is(auth()->user())->an('faculty_admin'); // Assuming you have a method to check if the user is a faculty admin

            if($isFacultyAdmin)
            {
                $facultyAdmin = auth()->user(); // Assuming the faculty admin is logged in
                $facultyId = $facultyAdmin->facultyAdmin->faculty; // Assuming `faculty_admin` relationship exists
                $academicians = Academician::where('faculty', $facultyId)
                ->with('user') // Assuming you want user details too
                ->get();

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
            }

            // Get top viewed academicians (only for admin dashboard)
            $topViewedAcademicians = null;
            $analyticsData = null;
            $userMotivationData = null;
            
            if (BouncerFacade::is(auth()->user())->an('admin')) {
                // START OF NEW CODE
                $motivations = \App\Models\UserMotivation::all();

                $mainReasonLabels = [
                    'A' => 'To find a research supervisor or specific research opportunities.',
                    'B' => 'To find students or collaborators for my research.',
                    'C' => 'To discover and follow research projects, publications, and grants.',
                    'D' => 'To build my academic profile and showcase my work.',
                    'E' => 'To network with other researchers and professionals in my field.',
                    'F' => 'To stay updated on academic events and news.',
                    'G' => 'I\'m just exploring the platform for now.',
                    'H' => 'Other.',
                ];

                $featuresInterestedLabels = [
                    'A' => 'AI-powered matching (for supervisors, students, or collaborators).',
                    'B' => 'Building and managing my detailed academic profile.',
                    'C' => 'Accessing the directory of universities, faculties, and researchers.',
                    'D' => 'Finding and sharing academic content (e.g., research updates, projects, events).',
                    'E' => 'Tools for CV generation or tracking research impact (like Google Scholar integration).',
                    'F' => 'General networking and connection features.',
                    'G' => 'I\'m not sure yet.',
                ];

                // Process Main Reasons
                $mainReasonCounts = $motivations->countBy('main_reason');
                $processedMainReasons = collect($mainReasonCounts)->map(function ($count, $key) use ($mainReasonLabels) {
                    return [
                        'label' => $mainReasonLabels[$key] ?? $key,
                        'count' => $count,
                    ];
                })->sortByDesc('count')->values();

                // Process Features Interested
                $featuresInterestedCounts = $motivations->pluck('features_interested')->flatten()->countBy();
                $processedFeaturesInterested = collect($featuresInterestedCounts)->map(function ($count, $key) use ($featuresInterestedLabels) {
                    return [
                        'label' => $featuresInterestedLabels[$key] ?? $key,
                        'count' => $count,
                    ];
                })->sortByDesc('count')->values();
                
                // Get latest additional feedback
                $latestFeedback = $motivations->whereNotNull('additional_info')->where('additional_info', '!=', '')->sortByDesc('updated_at')->take(5)->pluck('additional_info');

                $userMotivationData = [
                    'mainReasons' => $processedMainReasons,
                    'featuresInterested' => $processedFeaturesInterested,
                    'latestFeedback' => $latestFeedback,
                ];
                // END OF NEW CODE

                // Top 10 viewed academicians (global)
                $topViewedAcademicians = Academician::orderBy('total_views', 'desc')
                    ->limit(10)
                    ->get();
                
                // Get analytics data if the service is available
                try {
                    $analyticsService = app(\App\Services\GoogleAnalyticsService::class);
                    $analyticsData = [
                        'activeUsers' => $analyticsService->getActiveUsers(),
                        'avgSessionDuration' => $analyticsService->getAverageSessionDuration(),
                        'topPages' => $analyticsService->getTopPages(5),
                        'pageViewsOverTime' => $analyticsService->getPageViewsOverTime(30),
                    ];
                } catch (\Exception $e) {
                    // Analytics service not available or error
                    Log::error('Error loading Google Analytics data: ' . $e->getMessage());
                }
            }
            
            // Get faculty admin dashboard data
            $facultyAdminDashboardData = null;
            if($isFacultyAdmin) {
                $facultyAdminDashboardData = $this->getFacultyAdminDashboardData($user);
            }

            return Inertia::render('Dashboard', [
                'postGrants' => $postGrants,
                'totalUsers' => User::where('id', '!=', Auth::id())->count(), // Except admin itself
                'events' => PostEvent::orderByRaw('
                    CASE 
                        WHEN registration_deadline >= CURDATE() THEN 0 
                        ELSE 1 
                    END,
                    CASE 
                        WHEN registration_deadline >= CURDATE() THEN registration_deadline 
                        ELSE NULL 
                    END ASC,
                    CASE 
                        WHEN registration_deadline < CURDATE() THEN registration_deadline 
                        ELSE NULL 
                    END DESC
                ')->get(),
                'posts' => CreatePost::orderBy('created_at', 'desc')->get(),
                'projects' => PostProject::where('application_deadline', '>=', now())->orderBy('application_deadline', 'asc')->get(),
                'grants' => PostGrant::where('application_deadline', '>=', now())->orderBy('application_deadline', 'asc')->get(),
                'scholarships' => \App\Models\PostScholarship::where('application_deadline', '>=', now())->orderBy('application_deadline', 'asc')->get(),
                'academicians' => $academicians ?? null,
                'universities' => UniversityList::all(),
                'faculties' => FacultyList::all(),
                'users' => User::all(),
                'researchOptions' => $researchOptions ?? null,
                'profileIncompleteAlert' => $profileIncompleteAlert, // Add the alert to the props
                'topViewedAcademicians' => $topViewedAcademicians, // Add top viewed academicians
                'analyticsData' => $analyticsData, // Add Google Analytics data
                'userMotivationData' => $userMotivationData, // Add user motivation analytics data
                'facultyAdminDashboardData' => $facultyAdminDashboardData,
            ]);
        }
    }

    /**
     * Check if the user's profile is incomplete based on their role
     * 
     * @param User $user
     * @return array|null
     */
    private function checkProfileCompleteness($user)
    {
        $uniqueId = $user->unique_id;
        $prefix = substr($uniqueId, 0, 4); // Get the first 4 characters
        
        if ($prefix === 'ACAD') {
            // Check academician profile
            $profile = Academician::where('academician_id', $uniqueId)->first();
            
            if ($profile) {
                $isIncomplete = $profile->profile_picture === 'profile_pictures/default.jpg' || 
                                empty($profile->bio) || 
                                empty($profile->research_expertise);
                
                if ($isIncomplete) {
                    return [
                        'show' => true,
                        'message' => '⚠️ Please update your information, else you will not show in the academicians list.'
                    ];
                }
            }
        } elseif ($prefix === 'PG') {
            // Check postgraduate profile
            $profile = Postgraduate::where('postgraduate_id', $uniqueId)->first();
            
            if ($profile) {
                $isIncomplete = $profile->profile_picture === 'profile_pictures/default.jpg' || 
                                empty($profile->bio) || 
                                empty($profile->field_of_research);
                
                if ($isIncomplete) {
                    return [
                        'show' => true,
                        'message' => '⚠️ Please update your information, else you will not show in the postgraduates list.'
                    ];
                }
            }
        } elseif ($prefix === 'UG') {
            // Check undergraduate profile
            $profile = Undergraduate::where('undergraduate_id', $uniqueId)->first();
            
            if ($profile) {
                $isIncomplete = $profile->profile_picture === 'profile_pictures/default.jpg' || 
                                empty($profile->bio);
                
                if ($isIncomplete) {
                    return [
                        'show' => true,
                        'message' => '⚠️ Please update your information, else you will not show in the undergraduates list.'
                    ];
                }
            }
        }
        
        // Default return if no alert is needed
        return [
            'show' => false,
            'message' => ''
        ];
    }

    /**
     * Get dashboard data for faculty admin
     * 
     * @param \App\Models\User $user
     * @return array
     */
    private function getFacultyAdminDashboardData($user)
    {
        // Get faculty ID from faculty admin
        $facultyId = $user->facultyAdmin->faculty;
        
        // Get faculty and university details
        $faculty = FacultyList::with('university')->find($facultyId);
        
        // Count academicians in this faculty
        $academiciansCount = Academician::where('faculty', $facultyId)->count();
        
        // Count postgraduates and undergraduates in this faculty
        $postgraduatesCount = \App\Models\Postgraduate::where('faculty', $facultyId)->count();
        $undergraduatesCount = \App\Models\Undergraduate::where('faculty', $facultyId)->count();
        $studentsCount = $postgraduatesCount + $undergraduatesCount;
        
        // Get projects linked to academicians in this faculty
        $academicianIds = Academician::where('faculty', $facultyId)
            ->pluck('academician_id')
            ->toArray();
            
        $projectsCount = \App\Models\PostProject::whereIn('author_id', $academicianIds)
            ->where('project_status', 'published')
            ->count();
        
        // Get top viewed academicians from this faculty
        $topViewedAcademicians = Academician::where('faculty', $facultyId)
            ->orderBy('total_views', 'desc')
            ->limit(5)
            ->get();
            
        return [
            'faculty' => $faculty,
            'academiciansCount' => $academiciansCount,
            'studentsCount' => $studentsCount,
            'studentsBreakdown' => [
                'postgraduates' => $postgraduatesCount,
                'undergraduates' => $undergraduatesCount,
            ],
            'projectsCount' => $projectsCount,
            'topViewedAcademicians' => $topViewedAcademicians,
        ];
    }
}
