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
use App\Models\PostProject;
use App\Models\Publication;
use App\Models\Skill;

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
        
        // Get search query from request
        $searchQuery = request('search');
        
        // Get only academicians with complete profiles
        $academicians = Academician::with('user')
            ->where(function($query) {
                $query->where('profile_picture', '!=', 'profile_pictures/default.jpg')
                    //   ->whereNotNull('bio')
                    //   ->where('bio', '!=', '')
                      ->whereNotNull('research_expertise')
                      ->where('research_expertise', '!=', '[]');
            })
            ->when($searchQuery, function($query) use ($searchQuery) {
                $query->where(function($q) use ($searchQuery) {
                    $q->where('full_name', 'like', '%' . $searchQuery . '%')
                      ->orWhere('research_expertise', 'like', '%' . $searchQuery . '%');
                });
            })
            ->get();
        
        // Load skills for each academician
        $academicians->each(function ($academician) {
            if ($academician->user) {
                $academician->skills = $academician->user->skills()->with('subdomain.domain')->get();
            } else {
                $academician->skills = collect([]);
            }
        });
        
        return Inertia::render('Networking/Academician', [
            // Pass any data you want to the component here
            'academicians' => $academicians,
            'universities' => UniversityList::all(),
            'faculties' => FacultyList::all(),
            'users' => User::with(['sentRequests', 'receivedRequests'])->get(),
            'researchOptions' => $researchOptions,
            'skills' => Skill::with('subdomain.domain')->get(),
            'searchQuery' => $searchQuery,
        ]);
    }

    public function show(Academician $academician)
    {
        // Get the current user (authenticated or null)
        $user = Auth::check() ? Auth::user() : null;
        
        // Get the visitor's IP address if not authenticated
        $ipAddress = !$user ? request()->ip() : null;
        
        // Record the view and automatically increment total_views if needed
        $academician->recordView($user ? $user->id : null, $ipAddress);

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

        // Load skills for the academician
        if ($user) {
            $academician->skills = $user->skills()->with('subdomain.domain')->get();
        } else {
            $academician->skills = collect([]);
        }
        
        return Inertia::render('Networking/AcademicianProfile', [
            'academician' => $academician,
            'university' => UniversityList::find($academician->university),
            'faculty' => FacultyList::find($academician->faculty),
            'user' => $user,
            'researchOptions' => $researchOptions,
            'skillsOptions' => Skill::with('subdomain.domain')->get(),
            'metaTags' => $metaTags,
        ]);
    }

    public function showProjects(Academician $academician)
    {
        // Get user for this academician
        $user = User::where('unique_id', $academician->academician_id)->first();
        
        // Get projects for this academician
        $projects = PostProject::where('author_id', $academician->academician_id)
            ->where('project_status', 'published')
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Get research options for filtering
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
        
        return Inertia::render('Networking/AcademicianProjects', [
            'academician' => $academician,
            'university' => UniversityList::find($academician->university),
            'faculty' => FacultyList::find($academician->faculty),
            'user' => $user,
            'projects' => $projects,
            'researchOptions' => $researchOptions,
        ]);
    }

    public function showPublications(Academician $academician)
    {
        // Get user for this academician
        $user = User::where('unique_id', $academician->academician_id)->first();
        
        // Get the scholar profile to check if it exists
        $scholarProfile = $academician->scholarProfile;
        
        // Get publications for this academician, ordered by year (desc) and citations (desc)
        $publications = $academician->publications()
            ->orderBy('year', 'desc')
            ->orderBy('citations', 'desc')
            ->get();
            
        // Get research options for consistency with other views
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
        
        // Clean bio for meta description
        $description = strip_tags($academician->bio ?? '');
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 150) . '... Publications';
        
        // Meta tags for SEO
        $metaTags = [
            'title' => $academician->full_name . ' - Publications | NexScholar',
            'description' => $description,
            'image' => $academician->profile_picture 
                ? secure_url('/storage/' . $academician->profile_picture) 
                : secure_url('/storage/profile_pictures/default.jpg'),
            'type' => 'profile',
            'url' => route('academicians.publications', $academician),
        ];
        
        return Inertia::render('Networking/AcademicianPublications', [
            'academician' => $academician,
            'university' => UniversityList::find($academician->university),
            'faculty' => FacultyList::find($academician->faculty),
            'user' => $user,
            'publications' => $publications,
            'scholarProfile' => $scholarProfile,
            'researchOptions' => $researchOptions,
            'metaTags' => $metaTags,
        ]);
    }

    /**
     * Get quick info about an academician for modal display
     * 
     * @param string $academicianId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getQuickInfo($academicianId)
    {
        $academician = Academician::where('academician_id', $academicianId)->firstOrFail();
        
        // Count projects
        $projectsCount = PostProject::where('author_id', $academicianId)
            ->where('project_status', 'published')
            ->count();
            
        // Count grants
        $grantsCount = \App\Models\PostGrant::where('author_id', $academicianId)
            ->where('status', 'published')
            ->count();
            
        // Count publications
        $publicationsCount = Publication::where('academician_id', $academicianId)
            ->count();
            
        // Count supervised students (placeholder - implement actual logic)
        $supervisedStudentsCount = 0;
        
        return response()->json([
            'academician' => $academician,
            'projects_count' => $projectsCount,
            'grants_count' => $grantsCount,
            'publications_count' => $publicationsCount,
            'supervised_students_count' => $supervisedStudentsCount
        ]);
    }
}
