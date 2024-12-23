<?php

namespace App\Http\Controllers;
use App\Models\Postgraduate;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;
use App\Models\FieldOfResearch;
use App\Models\FacultyList;

use Illuminate\Http\Request;

class PostgraduateController extends Controller
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
        return Inertia::render('Networking/Postgraduate', [
            // Pass any data you want to the component here
            'postgraduates' => Postgraduate::all(),
            'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
            'isUndergraduate' => BouncerFacade::is(Auth::user())->an('undergraduate'),
            'isFacultyAdmin' => BouncerFacade::is(Auth::user())->an('faculty_admin'),
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
            'users' => User::all(),
            'researchOptions' => $researchOptions,
        ]);
    }

}
