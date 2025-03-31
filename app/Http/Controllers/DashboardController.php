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

class DashboardController extends Controller
{
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
            if (BouncerFacade::is(auth()->user())->an('admin')) {
                $topViewedAcademicians = Academician::where('total_views', '>', 0)
                    ->orderBy('total_views', 'desc')
                    ->take(10)
                    ->get();
            }

            return Inertia::render('Dashboard', [
                'postGrants' => $postGrants,
                'totalUsers' => User::where('id', '!=', Auth::id())->count(), // Except admin itself
                'events' => PostEvent::where('start_date', '>=', now())->orderBy('start_date', 'asc')->get(),
                'posts' => CreatePost::orderBy('created_at', 'desc')->get(),
                'projects' => PostProject::where('application_deadline', '>=', now())->orderBy('application_deadline', 'asc')->get(),
                'grants' => PostGrant::where('application_deadline', '>=', now())->orderBy('application_deadline', 'asc')->get(),
                'academicians' => $academicians ?? null,
                'universities' => UniversityList::all(),
                'faculties' => FacultyList::all(),
                'users' => User::all(),
                'researchOptions' => $researchOptions ?? null,
                'profileIncompleteAlert' => $profileIncompleteAlert, // Add the alert to the props
                'topViewedAcademicians' => $topViewedAcademicians, // Add top viewed academicians
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
}
