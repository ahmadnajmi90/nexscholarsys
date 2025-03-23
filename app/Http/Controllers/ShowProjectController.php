<?php

namespace App\Http\Controllers;
use App\Models\PostProject;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Academician;
use App\Models\FieldOfResearch;

use Illuminate\Http\Request;

class ShowProjectController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        
        $projects = PostProject::where('project_status', 'published')
            ->orderByRaw("CASE WHEN start_date >= ? THEN 0 ELSE 1 END", [$today])
            ->orderBy('start_date', 'asc')
            ->get();

        return Inertia::render('Project/Project', [
            // Pass any data you want to the component here
            'projects' => $projects,
            // 'universities' => UniversityList::all(),
            'users' => User::all(),
        ]);
    }

    public function show(PostProject $project)
    {
        // Using created_at for ordering, matching the index order (newest first)
        $previous = PostProject::where('created_at', '>', $project->created_at)
                            ->orderBy('created_at', 'desc')
                            ->first();

        $next = PostProject::where('created_at', '<', $project->created_at)
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

        $project->increment('total_views'); // Increment view count
        $user = auth()->user();
        $project->liked = $user ? $project->likedUsers->contains($user->id) : false;

        // Clean description for meta tags
        $description = strip_tags($project->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $project->image 
            ? secure_url('/storage/' . $project->image) 
            : secure_url('/storage/default-image.jpg');

        $metaTags = [
            'title' => $project->title,
            'description' => $description,
            'image' => $imageUrl,
            'type' => 'article',
            'url' => route('welcome.projects.show', $project),
            'published_time' => $project->created_at->toIso8601String(),
            'category' => 'Project',
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return Inertia::render('Project/Show', [
            'project'     => $project,
            'previous' => $previous,
            'next'     => $next,
            'users'     => User::all(),
            'academicians' => Academician::all(),
            'researchOptions' => $researchOptions,
            'universities' => UniversityList::all(),
            'metaTags' => $metaTags
        ])->with([
            'meta' => $metaTags
        ]);
    }

    public function toggleLike(Request $request, $url)
    {
        $project = PostProject::where('url', $url)->firstOrFail();
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($project->likedUsers()->where('user_id', $user->id)->exists()) {
            // Unlike
            $project->likedUsers()->detach($user->id);
        } else {
            // Like
            $project->likedUsers()->attach($user->id);
        }
        
        // Optionally update a cached total like count on the posts table.
        $project->total_likes = $project->likedUsers()->count();
        $project->save();

        return response()->json([
            'total_likes' => $project->total_likes,
            'liked' => $project->likedUsers()->where('user_id', $user->id)->exists()
        ]);
    }

    public function share($url)
    {
        $project = PostProject::where('url', $url)->firstOrFail();
        $project->increment('total_shares');

        return response()->json(['total_shares' => $project->total_shares]);
    }

}
