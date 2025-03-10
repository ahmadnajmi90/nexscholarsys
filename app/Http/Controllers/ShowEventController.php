<?php

namespace App\Http\Controllers;
use App\Models\PostEvent;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;
use Carbon\Carbon;
use App\Models\FieldOfResearch;
use App\Models\Academician;

use Illuminate\Http\Request;

class ShowEventController extends Controller
{
    public function index()
    {   
        $today = Carbon::today();

        $events = PostEvent::where('event_status', 'published')
            ->orderByRaw("CASE WHEN start_date >= ? THEN 0 ELSE 1 END", [$today])
            ->orderBy('start_date', 'asc')
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

        return Inertia::render('Event/Event', [
            // Pass any data you want to the component here\
            'events' => $events,
            // 'universities' => UniversityList::all(),
            'users' => User::all(),
            'researchOptions' => $researchOptions,
        ]);
    }

    public function show(PostEvent $event)
    {
        // Using created_at for ordering, matching the index order (newest first)

        // For descending order, the "previous" post is the one with a created_at value greater than the current post.
        // If the current post is the latest, no such post exists.
        $previous = PostEvent::where('created_at', '>', $event->created_at)
                            ->orderBy('created_at', 'desc')
                            ->first();

        // The "next" post is the one with a created_at value less than the current post.
        $next = PostEvent::where('created_at', '<', $event->created_at)
                        ->orderBy('created_at', 'desc')
                        ->first();
        
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

        return Inertia::render('Event/Show', [
            'event'     => $event,
            'previous' => $previous,
            'next'     => $next,
            'users'     => User::all(),
            'academicians' => Academician::all(),
            'researchOptions' => $researchOptions,
        ]);
    }
}
