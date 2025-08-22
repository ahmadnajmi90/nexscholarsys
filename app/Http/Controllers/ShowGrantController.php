<?php

namespace App\Http\Controllers;
use App\Models\PostGrant;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Academician;

use Illuminate\Http\Request;

class ShowGrantController extends Controller
{
    public function index(Request $request)
    {
        $searchQuery = $request->input('search');
        $today = Carbon::today();
    
        $grants = PostGrant::query()
            ->where('status', 'published')
            ->when($searchQuery, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderByRaw("CASE WHEN start_date >= ? THEN 0 ELSE 1 END", [$today])
            ->orderBy('start_date', 'asc')
            ->get();

        return Inertia::render('Grant/Grant', [
            // Pass any data you want to the component here
            'grants' => $grants,
            // 'universities' => UniversityList::all(),
            'users' => User::all(),
            'searchQuery' => $searchQuery, // Pass the search query back
        ]);
    }

    public function show(PostGrant $grant)
    {
        // Get the current user (authenticated or null)
        $user = Auth::user();
        
        // Get the visitor's IP address if not authenticated
        $ipAddress = !$user ? request()->ip() : null;
        
        // Record the view and automatically increment total_views if needed
        $grant->recordView($user ? $user->id : null, $ipAddress);
        
        $grant->liked = $user ? $grant->likedUsers->contains($user->id) : false;

        // Get 3 latest grants excluding the current grant, ordered by application_deadline
        $relatedGrants = PostGrant::where('id', '!=', $grant->id)
            ->where('status', 'published')
            ->where('application_deadline', '>=', now())
            ->orderBy('application_deadline', 'asc')
            ->take(3)
            ->get();

        // Clean description for meta tags
        $description = strip_tags($grant->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $grant->image 
            ? secure_url('/storage/' . $grant->image) 
            : secure_url('/storage/default-image.jpg');

        $metaTags = [
            'title' => $grant->title,
            'description' => $description,
            'image' => $imageUrl,
            'type' => 'article',
            'url' => route('welcome.grants.show', $grant),
            'published_time' => $grant->created_at->toIso8601String(),
            'category' => 'Grant',
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return Inertia::render('Grant/Show', [
            'grant' => $grant,
            'users' => User::all(),
            'academicians' => Academician::all(),
            'metaTags' => $metaTags,
            'relatedGrants' => $relatedGrants
        ])->with([
            'meta' => $metaTags
        ]);
    }

    public function toggleLike(Request $request, $url)
    {
        $grant = PostGrant::where('url', $url)->firstOrFail();
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($grant->likedUsers()->where('user_id', $user->id)->exists()) {
            // Unlike
            $grant->likedUsers()->detach($user->id);
        } else {
            // Like
            $grant->likedUsers()->attach($user->id);
        }
        
        // Optionally update a cached total like count on the posts table.
        $grant->total_likes = $grant->likedUsers()->count();
        $grant->save();

        return response()->json([
            'total_likes' => $grant->total_likes,
            'liked' => $grant->likedUsers()->where('user_id', $user->id)->exists()
        ]);
    }

    public function share(Request $request, $url)
    {
        $grant = PostGrant::where('url', $url)->firstOrFail();
        
        // Clean description for meta tags
        $description = strip_tags($grant->description);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $grant->image 
            ? secure_url('/storage/' . $grant->image) 
            : secure_url('/storage/default-image.jpg');

        // Get image dimensions
        $imagePath = $grant->image 
            ? storage_path('app/public/' . $grant->image)
            : public_path('storage/default-image.jpg');
            
        $imageSize = @getimagesize($imagePath);
        $imageWidth = $imageSize ? $imageSize[0] : 1200;
        $imageHeight = $imageSize ? $imageSize[1] : 630;

        $metaTags = [
            'title' => $grant->title,
            'description' => $description,
            'image' => $imageUrl,
            'image_width' => $imageWidth,
            'image_height' => $imageHeight,
            'type' => 'article',
            'url' => route('welcome.grants.show', $grant),
            'published_time' => $grant->created_at->toIso8601String(),
            'category' => 'Grant',
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return response()->json([
            'success' => true,
            'metaTags' => $metaTags
        ]);
    }

}
