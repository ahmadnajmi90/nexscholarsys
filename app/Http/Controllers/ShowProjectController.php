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
        // Get the current user (authenticated or null)
        $user = Auth::user();
        
        // Get the visitor's IP address if not authenticated
        $ipAddress = !$user ? request()->ip() : null;
        
        // Record the view and automatically increment total_views if needed
        $project->recordView($user ? $user->id : null, $ipAddress);
        
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

        $project->liked = $user ? $project->likedUsers->contains($user->id) : false;

        // Get 3 latest projects excluding the current project, ordered by application_deadline
        $relatedProjects = PostProject::where('id', '!=', $project->id)
            ->where('project_status', 'published')
            ->where('application_deadline', '>=', now())
            ->orderBy('application_deadline', 'asc')
            ->take(3)
            ->get();

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

        // Check if this post project has an associated ScholarLab project
        $scholarLabProject = null;
        $joinRequestStatus = null;
        $isMember = false;
        
        if ($project->scholarLabProject) {
            $scholarLabProject = $project->scholarLabProject;
            
            // Check if the user is already a member of the project
            if ($user) {
                $isMember = $scholarLabProject->members()->where('user_id', $user->id)->exists() || 
                           $scholarLabProject->owner_id === $user->id;
                
                // If not a member, check if they've sent a join request
                if (!$isMember) {
                    $joinRequest = \App\Models\ProjectJoinRequest::where('project_id', $scholarLabProject->id)
                        ->where('user_id', $user->id)
                        ->first();
                    
                    $joinRequestStatus = $joinRequest ? $joinRequest->status : null;
                }
            }
        }

        return Inertia::render('Project/Show', [
            'project' => $project,
            'users' => User::all(),
            'academicians' => Academician::all(),
            'researchOptions' => $researchOptions,
            'universities' => UniversityList::all(),
            'metaTags' => $metaTags,
            'relatedProjects' => $relatedProjects,
            'scholarLabProject' => $scholarLabProject,
            'joinRequestStatus' => $joinRequestStatus,
            'isMember' => $isMember
        ])->with([
            'meta' => $metaTags
        ]);
    }

    public function toggleLike(Request $request, $url)
    {
        $project = PostProject::where('url', $url)->firstOrFail();
        $user = Auth::user();
        
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

    public function share(Request $request, $url)
    {
        $project = PostProject::where('url', $url)->firstOrFail();
        
        // Clean description for meta tags
        $description = strip_tags($project->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $project->image 
            ? secure_url('/storage/' . $project->image) 
            : secure_url('/storage/default-image.jpg');

        // Get image dimensions
        $imagePath = $project->image 
            ? storage_path('app/public/' . $project->image)
            : public_path('storage/default-image.jpg');
            
        $imageSize = @getimagesize($imagePath);
        $imageWidth = $imageSize ? $imageSize[0] : 1200;
        $imageHeight = $imageSize ? $imageSize[1] : 630;

        $metaTags = [
            'title' => $project->title,
            'description' => $description,
            'image' => $imageUrl,
            'image_width' => $imageWidth,
            'image_height' => $imageHeight,
            'type' => 'article',
            'url' => route('welcome.projects.show', $project),
            'published_time' => $project->created_at->toIso8601String(),
            'category' => 'Project',
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return response()->json([
            'success' => true,
            'metaTags' => $metaTags
        ]);
    }

}
