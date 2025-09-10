<?php

namespace App\Http\Controllers;

use App\Models\UniversityList;
use App\Models\FacultyList;
use App\Models\Academician;
use Illuminate\Http\Request;
use App\Models\FieldOfResearch;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Skill;

class UniversityController extends Controller
{
    public function index(Request $request)
    {
        $searchQuery = $request->input('search');
        
        $universities = UniversityList::query()
            ->when($searchQuery, function ($query, $search) {
                $query->where('full_name', 'like', "%{$search}%")
                      ->orWhere('short_name', 'like', "%{$search}%");
            })
            ->get();
            
        return inertia('Universities/UniversityList', [
            'universities' => $universities,
            'searchQuery' => $searchQuery,
        ]);
    }

    public function faculties(Request $request, UniversityList $university)
    {
        $searchQuery = $request->input('search');
        
        $faculties = $university->faculties()
            ->when($searchQuery, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->get();
            
        return inertia('Universities/FacultyList', [
            'faculties' => $faculties, 
            'university' => $university,
            'searchQuery' => $searchQuery,
        ]);
    }

    public function academicians(Request $request, FacultyList $faculty)
    {
        $searchQuery = $request->input('search');
        
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

        // Get only academicians with complete profiles
        $academicians = $faculty->academicians()
            ->with('user')
            ->where('profile_picture', '!=', 'profile_pictures/default.jpg')
            ->whereNotNull('research_expertise')
            ->where('research_expertise', '!=', '[]')
            ->when($searchQuery, function ($query, $search) {
                $query->where('full_name', 'like', "%{$search}%");
            })
            ->get();
            
        return inertia('Universities/AcademicianList', [
            'academicians'   => $academicians,
            'universities'   => UniversityList::all(),
            'faculties'      => FacultyList::all(),
            'faculty'        => $faculty,
            'university'     => $faculty->university,
            'researchOptions'=> $researchOptions,
            'users'          => User::with(['sentRequests', 'receivedRequests'])->get(),
            'searchQuery'    => $searchQuery,
        ]);
    }

    public function undergraduates(Request $request, FacultyList $faculty)
    {
        $searchQuery = $request->input('search');
        
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

        // Get only undergraduates with complete profiles
        $undergraduates = $faculty->undergraduates()
            ->with('user')
            ->where('profile_picture', '!=', 'profile_pictures/default.jpg')
            ->when($searchQuery, function ($query, $search) {
                $query->where('full_name', 'like', "%{$search}%");
            })
            ->get();
            
        return inertia('Universities/UndergraduateList', [
            'undergraduates' => $undergraduates,
            'universities'   => UniversityList::all(),
            'faculties'      => FacultyList::all(),
            'faculty'        => $faculty,
            'university'     => $faculty->university,
            'researchOptions'=> $researchOptions,
            'users'          => User::with(['sentRequests', 'receivedRequests'])->get(),
            'skills' => Skill::with('subdomain.domain')->get(),
            'searchQuery'    => $searchQuery,
        ]);
    }

    public function postgraduates(Request $request, FacultyList $faculty)
    {
        $searchQuery = $request->input('search');
        
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

        // Get only postgraduates with complete profiles
        $postgraduates = $faculty->postgraduates()
            ->with('user')
            ->where('profile_picture', '!=', 'profile_pictures/default.jpg')
            ->whereNotNull('field_of_research')
            ->where('field_of_research', '!=', '[]')
            ->when($searchQuery, function ($query, $search) {
                $query->where('full_name', 'like', "%{$search}%");
            })
            ->get();
            
        return inertia('Universities/PostgraduateList', [
            'postgraduates'  => $postgraduates,
            'universities'   => UniversityList::all(),
            'faculties'      => FacultyList::all(),
            'faculty'        => $faculty,
            'university'     => $faculty->university,
            'researchOptions'=> $researchOptions,
            'users'          => User::with(['sentRequests', 'receivedRequests'])->get(),
            'skills'        => Skill::with('subdomain.domain')->get(),
            'searchQuery'    => $searchQuery,
        ]);
    }

}
