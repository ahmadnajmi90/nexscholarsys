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
        $undergraduates = Undergraduate::with('user')
            ->where(function($query) {
                $query->where('profile_picture', '!=', 'profile_pictures/default.jpg');
                    //   ->whereNotNull('bio')
                    //   ->where('bio', '!=', '');
            })->get();
        
        return Inertia::render('Networking/Undergraduate', [
            // Pass any data you want to the component here
            'undergraduates' => $undergraduates,
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
            'users' => User::with(['sentRequests', 'receivedRequests'])->get(),
            'researchOptions' => $researchOptions,
            'skills' => Skill::all(),
        ]);
    }

    public function show(Undergraduate $undergraduate)
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

        // Get user for this undergraduate
        $user = User::where('unique_id', $undergraduate->undergraduate_id)->first();
        
        // Clean bio for meta description
        $description = strip_tags($undergraduate->bio ?? '');
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . (strlen($description) > 200 ? '...' : '');
        
        // Meta tags for SEO
        $metaTags = [
            'title' => $undergraduate->full_name,
            'description' => $description ?: 'Undergraduate profile at Nexscholar',
            'image' => $undergraduate->profile_picture 
                ? secure_url('/storage/' . $undergraduate->profile_picture) 
                : secure_url('/storage/profile_pictures/default.jpg'),
            'type' => 'profile',
            'url' => route('undergraduates.show', $undergraduate),
        ];

        return Inertia::render('Networking/UndergraduateProfile', [
            'undergraduate' => $undergraduate,
            'university' => UniversityList::find($undergraduate->university),
            'faculty' => FacultyList::find($undergraduate->faculty),
            'user' => $user,
            'researchOptions' => $researchOptions,
            'skillsOptions' => Skill::all(),
            'metaTags' => $metaTags,
        ]);
    }
}
