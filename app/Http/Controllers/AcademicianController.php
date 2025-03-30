<?php

namespace App\Http\Controllers;
use App\Models\Academician;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;
use App\Models\FieldOfResearch;
use App\Models\FacultyList;

use Illuminate\Http\Request;

class AcademicianController extends Controller
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
        
        // Get only academicians with complete profiles
        $academicians = Academician::where(function($query) {
            $query->where('profile_picture', '!=', 'profile_pictures/default.jpg')
                //   ->whereNotNull('bio')
                //   ->where('bio', '!=', '')
                  ->whereNotNull('research_expertise')
                  ->where('research_expertise', '!=', '[]');
        })->get();
        
        return Inertia::render('Networking/Academician', [
            // Pass any data you want to the component here
            'academicians' => $academicians,
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
            'users' => User::all(),
            'researchOptions' => $researchOptions,
        ]);
    }

    public function show(Academician $academician)
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

        // Get user for this academician
        $user = User::where('unique_id', $academician->academician_id)->first();
        
        // Clean bio for meta description
        $description = strip_tags($academician->bio ?? '');
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . (strlen($description) > 200 ? '...' : '');
        
        // Meta tags for SEO
        $metaTags = [
            'title' => $academician->full_name,
            'description' => $description ?: 'Academician profile at Nexscholar',
            'image' => $academician->profile_picture 
                ? secure_url('/storage/' . $academician->profile_picture) 
                : secure_url('/storage/profile_pictures/default.jpg'),
            'type' => 'profile',
            'url' => route('academicians.show', $academician),
        ];

        return Inertia::render('Networking/AcademicianProfile', [
            'academician' => $academician,
            'university' => UniversityList::find($academician->university),
            'faculty' => FacultyList::find($academician->faculty),
            'user' => $user,
            'researchOptions' => $researchOptions,
            'metaTags' => $metaTags,
        ]);
    }
}
