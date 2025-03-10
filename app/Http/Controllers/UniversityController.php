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

class UniversityController extends Controller
{
    public function index()
    {
        $universities = UniversityList::all();
        return inertia('Universities/UniversityList', 
        ['universities' => $universities]);
    }

    public function faculties(UniversityList $university)
    {
        $faculties = $university->faculties; // Assuming a relationship
        return inertia('Universities/FacultyList', 
        ['faculties' => $faculties, 'university' => $university]);
    }

    public function academicians(FacultyList $faculty)
    {
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

        $academicians = $faculty->academicians; // Assuming a relationship
        return inertia('Universities/AcademicianList', 
        ['academicians' => $academicians,
                'universities' => UniversityList::all(),
                'faculties' => FacultyList::all(),
                'faculty' => $faculty,
                'university' => $faculty->university,
                'researchOptions' => $researchOptions,
                'users' => User::all(),
            ]);
    }

    public function undergraduates(FacultyList $faculty)
    {
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

        // Retrieve undergraduates from the faculty model
        $undergraduates = $faculty->undergraduates; // Ensure the FacultyList model has a 'undergraduates' relationship
        return inertia('Universities/UndergraduateList', [
            'undergraduates' => $undergraduates,
            'universities'   => UniversityList::all(),
            'faculties'      => FacultyList::all(),
            'faculty'        => $faculty,
            'university'     => $faculty->university,
            'researchOptions'=> $researchOptions,
            'users'          => User::all(),
        ]);
    }

    public function postgraduates(FacultyList $faculty)
    {
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

        // Retrieve postgraduates from the faculty model
        $postgraduates = $faculty->postgraduates; // Ensure the FacultyList model has a 'postgraduates' relationship
        return inertia('Universities/PostgraduateList', [
            'postgraduates'  => $postgraduates,
            'universities'   => UniversityList::all(),
            'faculties'      => FacultyList::all(),
            'faculty'        => $faculty,
            'university'     => $faculty->university,
            'researchOptions'=> $researchOptions,
            'users'          => User::all(),
        ]);
    }

}
