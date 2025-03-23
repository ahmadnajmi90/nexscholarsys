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
    public function index()
    {
        $today = Carbon::today();
    
        $grants = PostGrant::where('status', 'published')
            ->orderByRaw("CASE WHEN start_date >= ? THEN 0 ELSE 1 END", [$today])
            ->orderBy('start_date', 'asc')
            ->get();

        return Inertia::render('Grant/Grant', [
            // Pass any data you want to the component here
            'grants' => $grants,
            // 'universities' => UniversityList::all(),
            'users' => User::all(),
        ]);
    }

    public function show(PostGrant $grant)
    {
        // Using created_at for ordering, matching the index order (newest first)
        $previous = PostGrant::where('created_at', '>', $grant->created_at)
                            ->orderBy('created_at', 'desc')
                            ->first();

        $next = PostGrant::where('created_at', '<', $grant->created_at)
                        ->orderBy('created_at', 'desc')
                        ->first();

        $grant->increment('total_views'); // Increment view count
        $user = auth()->user();
        $grant->liked = $user ? $grant->likedUsers->contains($user->id) : false;

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
            'grant'     => $grant,
            'previous' => $previous,
            'next'     => $next,
            'users'     => User::all(),
            'academicians' => Academician::all(),
            'metaTags' => $metaTags
        ])->with([
            'meta' => $metaTags
        ]);
    }

    public function toggleLike(Request $request, $url)
    {
        $grant = PostGrant::where('url', $url)->firstOrFail();
        $user = auth()->user();
        
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

    public function share($url)
    {
        $grant = PostGrant::where('url', $url)->firstOrFail();
        $grant->increment('total_shares');

        return response()->json(['total_shares' => $grant->total_shares]);
    }

}
