<?php

namespace App\Http\Controllers;

use App\Models\CreatePost;
use App\Models\PostEvent;
use App\Models\PostProject;
use App\Models\PostGrant;
use App\Models\FieldOfResearch;
use App\Models\UniversityList;
use App\Models\User;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

class WelcomeController extends Controller
{
    public function index()
    {
        $posts = CreatePost::where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $today = Carbon::today();

        $events = PostEvent::where('event_status', 'published')
            ->where('start_date', '>=', $today)
            ->orderBy('start_date', 'asc')
            ->take(5)
            ->get();
        
        $projects = PostProject::where('project_status', 'published')
            ->where('application_deadline', '>=', $today)
            ->orderBy('application_deadline', 'asc')
            ->take(5)
            ->get();
        
        $grants = PostGrant::where('status', 'published')
            ->where('application_deadline', '>=', $today)
            ->orderBy('application_deadline', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'posts' => $posts,
            'events' => $events,
            'projects' => $projects,
            'grants' => $grants,
        ]);
    }
    
    public function showPost(CreatePost $post)
    {
        // Using created_at for ordering
        $previous = CreatePost::where('created_at', '>', $post->created_at)
                            ->orderBy('created_at', 'desc')
                            ->first();

        $next = CreatePost::where('created_at', '<', $post->created_at)
                        ->orderBy('created_at', 'desc')
                        ->first();

        $post->increment('total_views'); // Increment view count

        // Ensure we have a clean description without HTML tags
        $description = strip_tags($post->content);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Ensure we have a proper image URL and dimensions
        $imageUrl = $post->featured_image 
            ? url('storage/' . $post->featured_image) 
            : url('storage/default.jpg');

        // Get image dimensions if possible
        $imagePath = $post->featured_image 
            ? storage_path('app/public/' . $post->featured_image)
            : public_path('storage/default.jpg');
            
        $imageSize = @getimagesize($imagePath);
        $imageWidth = $imageSize ? $imageSize[0] : 1200;
        $imageHeight = $imageSize ? $imageSize[1] : 630;

        // Get the full URL for the current page
        $currentUrl = url()->current();

        $metaTags = [
            'title' => $post->title,
            'description' => $post->excerpt ?? $description,
            'image' => $imageUrl,
            'image_width' => $imageWidth,
            'image_height' => $imageHeight,
            'type' => 'article',
            'url' => $currentUrl,
            'published_time' => $post->created_at->toIso8601String(),
            'category' => $post->category,
            'site_name' => 'NexScholar',
            'locale' => 'en_US'
        ];

        // Log the meta tags for debugging
        Log::info('Meta Tags:', $metaTags);

        // Store meta tags in session
        Session::put('meta', $metaTags);

        return Inertia::render('Post/WelcomePostShow', [
            'post' => $post,
            'previous' => $previous,
            'next' => $next,
            'users' => User::all(),
            'academicians' => Academician::all(),
            'postgraduates' => Postgraduate::all(),
            'undergraduates' => Undergraduate::all(),
            'metaTags' => $metaTags
        ]);
    }

    public function showEvent(PostEvent $event)
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

        $event->increment('total_views');

        // Clean description for meta tags
        $description = strip_tags($event->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $event->image 
            ? url('storage/' . $event->image) 
            : url('storage/default.jpg');

        // Get image dimensions
        $imagePath = $event->image 
            ? storage_path('app/public/' . $event->image)
            : public_path('storage/default.jpg');
            
        $imageSize = @getimagesize($imagePath);
        $imageWidth = $imageSize ? $imageSize[0] : 1200;
        $imageHeight = $imageSize ? $imageSize[1] : 630;

        // Prepare meta tags
        $metaTags = [
            'title' => $event->event_name,
            'description' => $description,
            'image' => $imageUrl,
            'image_width' => $imageWidth,
            'image_height' => $imageHeight,
            'type' => 'article',
            'url' => url()->current(),
            'published_time' => $event->created_at->toIso8601String(),
            'category' => 'Event',
            'site_name' => 'NexScholar',
            'locale' => 'en_US'
        ];

        // Store in session for blade template
        Session::put('meta', $metaTags);

        return Inertia::render('Event/WelcomeEventShow', [
            'event' => $event,
            'academicians' => Academician::all(),
            'researchOptions' => $researchOptions,
            'metaTags' => $metaTags
        ]);
    }

    public function showProject(PostProject $project)
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

        $project->increment('total_views');

        // Clean description for meta tags
        $description = strip_tags($project->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $project->image 
            ? url('storage/' . $project->image) 
            : url('storage/default.jpg');

        // Get image dimensions
        $imagePath = $project->image 
            ? storage_path('app/public/' . $project->image)
            : public_path('storage/default.jpg');
            
        $imageSize = @getimagesize($imagePath);
        $imageWidth = $imageSize ? $imageSize[0] : 1200;
        $imageHeight = $imageSize ? $imageSize[1] : 630;

        // Prepare meta tags
        $metaTags = [
            'title' => $project->title,
            'description' => $description,
            'image' => $imageUrl,
            'image_width' => $imageWidth,
            'image_height' => $imageHeight,
            'type' => 'article',
            'url' => url()->current(),
            'published_time' => $project->created_at->toIso8601String(),
            'category' => 'Project',
            'site_name' => 'NexScholar',
            'locale' => 'en_US'
        ];

        // Store in session for blade template
        Session::put('meta', $metaTags);

        return Inertia::render('Project/WelcomeProjectShow', [
            'project' => $project,
            'academicians' => Academician::all(),
            'researchOptions' => $researchOptions,
            'universities' => UniversityList::all(),
            'metaTags' => $metaTags
        ]);
    }

    public function showGrant(PostGrant $grant)
    {
        $grant->increment('total_views');

        // Clean description for meta tags
        $description = strip_tags($grant->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $grant->image 
            ? url('storage/' . $grant->image) 
            : url('storage/default.jpg');

        // Get image dimensions
        $imagePath = $grant->image 
            ? storage_path('app/public/' . $grant->image)
            : public_path('storage/default.jpg');
            
        $imageSize = @getimagesize($imagePath);
        $imageWidth = $imageSize ? $imageSize[0] : 1200;
        $imageHeight = $imageSize ? $imageSize[1] : 630;

        // Prepare meta tags
        $metaTags = [
            'title' => $grant->title,
            'description' => $description,
            'image' => $imageUrl,
            'image_width' => $imageWidth,
            'image_height' => $imageHeight,
            'type' => 'article',
            'url' => url()->current(),
            'published_time' => $grant->created_at->toIso8601String(),
            'category' => 'Grant',
            'site_name' => 'NexScholar',
            'locale' => 'en_US'
        ];

        // Store in session for blade template
        Session::put('meta', $metaTags);

        return Inertia::render('Grant/WelcomeGrantShow', [
            'grant' => $grant,
            'academicians' => Academician::all(),
            'metaTags' => $metaTags
        ]);
    }
} 