<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Silber\Bouncer\BouncerFacade;
use App\Models\ClickTracking;
use App\Models\PostGrant;
use App\Models\PostProject;
use App\Models\PostEvent;
use App\Models\Academician;
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


            return Inertia::render('Dashboard', [
                'postGrants' => $postGrants,
                'totalUsers' => User::where('id', '!=', Auth::id())->count(), // Except admin itself
                'onlineUsers' => User::where('id', '!=', Auth::id())
                    ->where('last_activity', '>=', now()->subMinutes(5))
                    ->count(),
                'clicksByType' => $this->getClickDetails(), // Corrected method call
                'events' => PostEvent::where('start_date', '>=', now())->orderBy('start_date', 'asc')->get(),
                'posts' => CreatePost::orderBy('created_at', 'desc')->get(),
                'projects' => PostProject::where('application_deadline', '>=', now())->orderBy('application_deadline', 'asc')->get(),
                'grants' => PostGrant::where('application_deadline', '>=', now())->orderBy('application_deadline', 'asc')->get(),
                'academicians' => $academicians ?? null,
                'universities' => UniversityList::all(),
                'faculties' => FacultyList::all(),
                'users' => User::all(),
                'researchOptions' => $researchOptions ?? null,
            ]);
        }
    }

    public function getClickDetails()
    {
        $clickDetails = ClickTracking::selectRaw('entity_type, action, entity_id, COUNT(*) as total_clicks')
            ->groupBy('entity_type', 'action', 'entity_id')
            ->get()
            ->map(function ($click) {
                $entityName = null;

                switch ($click->entity_type) {
                    case 'grant':
                        $entityName = PostGrant::where('id', $click->entity_id)->value('title');
                        break;
                    case 'project':
                        $entityName = PostProject::where('id', $click->entity_id)->value('title');
                        break;
                    case 'event':
                        $entityName = PostEvent::where('id', $click->entity_id)->value('event_name');
                        break;
                }

                return [
                    'entity_type' => $click->entity_type,
                    'entity_name' => $entityName ?? 'Unknown',
                    'action' => $click->action,
                    'total_clicks' => $click->total_clicks,
                ];
            });

        return $clickDetails;
    }
}
