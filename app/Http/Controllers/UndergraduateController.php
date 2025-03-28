<?php

namespace App\Http\Controllers;
use App\Models\Undergraduate;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;
use App\Models\FieldOfResearch;
use App\Models\FacultyList;
use App\Models\Skill;

use Illuminate\Http\Request;

class UndergraduateController extends Controller
{
    public function index()
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
        
        // Get only undergraduates with complete profiles
        $undergraduates = Undergraduate::where(function($query) {
            $query->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                //   ->whereNotNull('bio')
                //   ->where('bio', '!=', '');
        })->get();
        
        return Inertia::render('Networking/Undergraduate', [
            // Pass any data you want to the component here
            'undergraduates' => $undergraduates,
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
            'users' => User::all(),
            'researchOptions' => $researchOptions,
            'skills' => Skill::all(),
        ]);
    }

}
