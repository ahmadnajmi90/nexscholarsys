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
        $previous = PostEvent::where('created_at', '>', $event->created_at)
                            ->orderBy('created_at', 'desc')
                            ->first();

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
        $event->liked = $user ? $event->likedUsers->contains($user->id) : false;

        // Clean description for meta tags
        $description = strip_tags($event->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $event->image 
            ? secure_url('/storage/' . $event->image) 
            : secure_url('/storage/default-image.jpg');

        $metaTags = [
            'title' => $event->event_name,
            'description' => $description,
            'image' => $imageUrl,
            'type' => 'article',
            'url' => route('welcome.events.show', $event),
            'published_time' => $event->created_at->toIso8601String(),
            'category' => 'Event',
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return Inertia::render('Event/Show', [
            'event'     => $event,
            'previous' => $previous,
            'next'     => $next,
            'users'     => User::all(),
            'academicians' => Academician::all(),
            'researchOptions' => $researchOptions,
            'metaTags' => $metaTags
        ])->with([
            'meta' => $metaTags
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

    public function share(Request $request, $url)
    {
        $event = PostEvent::where('url', $url)->firstOrFail();
        
        // Clean description for meta tags
        $description = strip_tags($event->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $event->image 
            ? secure_url('/storage/' . $event->image) 
            : secure_url('/storage/default-image.jpg');

        // Get image dimensions
        $imagePath = $event->image 
            ? storage_path('app/public/' . $event->image)
            : public_path('storage/default-image.jpg');
            
        $imageSize = @getimagesize($imagePath);
        $imageWidth = $imageSize ? $imageSize[0] : 1200;
        $imageHeight = $imageSize ? $imageSize[1] : 630;

        $metaTags = [
            'title' => $event->event_name,
            'description' => $description,
            'image' => $imageUrl,
            'image_width' => $imageWidth,
            'image_height' => $imageHeight,
            'type' => 'article',
            'url' => route('welcome.events.show', $event),
            'published_time' => $event->created_at->toIso8601String(),
            'category' => 'Event',
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return response()->json([
            'success' => true,
            'metaTags' => $metaTags
        ]);
    }
}
