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

        $event->increment('total_views'); // Increment view count
        $user = auth()->user();
        // Check if the authenticated user has liked the post
        $event->liked = $user ? $event->likedUsers->contains($user->id) : false;

        return Inertia::render('Event/Show', [
            'event'     => $event,
            'previous' => $previous,
            'next'     => $next,
            'users'     => User::all(),
            'academicians' => Academician::all(),
            'researchOptions' => $researchOptions,
        ]);
    }

    public function toggleLike(Request $request, $url)
    {
        $event = PostEvent::where('url', $url)->firstOrFail();
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($event->likedUsers()->where('user_id', $user->id)->exists()) {
            // Unlike
            $event->likedUsers()->detach($user->id);
        } else {
            // Like
            $event->likedUsers()->attach($user->id);
        }
        
        // Optionally update a cached total like count on the posts table.
        $event->total_likes = $event->likedUsers()->count();
        $event->save();

        return response()->json([
            'total_likes' => $event->total_likes,
            'liked' => $event->likedUsers()->where('user_id', $user->id)->exists()
        ]);
    }

    public function share($url)
    {
        $event = PostEvent::where('url', $url)->firstOrFail();
        $event->increment('total_shares');

        return response()->json(['total_shares' => $event->total_shares]);
    }
}
