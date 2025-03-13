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

        // For descending order, the "previous" post is the one with a created_at value greater than the current post.
        // If the current post is the latest, no such post exists.
        $previous = PostProject::where('created_at', '>', $project->created_at)
                            ->orderBy('created_at', 'desc')
                            ->first();

        // The "next" post is the one with a created_at value less than the current post.
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
        // Check if the authenticated user has liked the post
        $project->liked = $user ? $project->likedUsers->contains($user->id) : false;

        return Inertia::render('Project/Show', [
            'project'     => $project,
            'previous' => $previous,
            'next'     => $next,
            'users'     => User::all(),
            'academicians' => Academician::all(),
            'researchOptions' => $researchOptions,
            'universities' => UniversityList::all(),
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
