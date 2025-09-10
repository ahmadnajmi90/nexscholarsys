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
use App\Models\Skill;
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
        
        // Get search query from request
        $searchQuery = request('search');
        
        // Get only postgraduates with complete profiles
        $postgraduates = Postgraduate::with('user')
            ->where(function($query) {
                $query->where('profile_picture', '!=', 'profile_pictures/default.jpg')
                    //   ->whereNotNull('bio')
                    //   ->where('bio', '!=', '')
                      ->whereNotNull('field_of_research')
                      ->where('field_of_research', '!=', '[]');
            })
            ->when($searchQuery, function($query) use ($searchQuery) {
                $query->where('full_name', 'like', '%' . $searchQuery . '%');
            })
            ->get();
        
        // Load skills for each postgraduate
        $postgraduates->each(function ($postgraduate) {
            if ($postgraduate->user) {
                $postgraduate->skills = $postgraduate->user->skills()->with('subdomain.domain')->get();
            } else {
                $postgraduate->skills = collect([]);
            }
        });
        
        return Inertia::render('Networking/Postgraduate', [
            // Pass any data you want to the component here
            'postgraduates' => $postgraduates,
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
            'users' => User::with(['sentRequests', 'receivedRequests'])->get(),
            'researchOptions' => $researchOptions,
            'skills' => Skill::with('subdomain.domain')->get(),
            'searchQuery' => $searchQuery,
        ]);
    }

    public function show(Postgraduate $postgraduate)
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

        // Get user for this postgraduate
        $user = User::where('unique_id', $postgraduate->postgraduate_id)->first();
        
        // Clean bio for meta description
        $description = strip_tags($postgraduate->bio ?? '');
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . (strlen($description) > 200 ? '...' : '');
        
        // Meta tags for SEO
        $metaTags = [
            'title' => $postgraduate->full_name,
            'description' => $description ?: 'Postgraduate profile at Nexscholar',
            'image' => $postgraduate->profile_picture 
                ? secure_url('/storage/' . $postgraduate->profile_picture) 
                : secure_url('/storage/profile_pictures/default.jpg'),
            'type' => 'profile',
            'url' => route('postgraduates.show', $postgraduate),
        ];

        // Load skills for the postgraduate
        if ($user) {
            $postgraduate->skills = $user->skills()->with('subdomain.domain')->get();
        } else {
            $postgraduate->skills = collect([]);
        }
        
        return Inertia::render('Networking/PostgraduateProfile', [
            'postgraduate' => $postgraduate,
            'university' => UniversityList::find($postgraduate->university),
            'faculty' => FacultyList::find($postgraduate->faculty),
            'user' => $user,
            'researchOptions' => $researchOptions,
            'skillsOptions' => Skill::with('subdomain.domain')->get(),
            'metaTags' => $metaTags,
        ]);
    }
}
