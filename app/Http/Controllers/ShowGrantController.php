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

        // For descending order, the "previous" post is the one with a created_at value greater than the current post.
        // If the current post is the latest, no such post exists.
        $previous = PostGrant::where('created_at', '>', $grant->created_at)
                            ->orderBy('created_at', 'desc')
                            ->first();

        // The "next" post is the one with a created_at value less than the current post.
        $next = PostGrant::where('created_at', '<', $grant->created_at)
                        ->orderBy('created_at', 'desc')
                        ->first();

        $grant->increment('total_views'); // Increment view count
        $user = auth()->user();
        // Check if the authenticated user has liked the post
        $grant->liked = $user ? $grant->likedUsers->contains($user->id) : false;

        return Inertia::render('Grant/Show', [
            'grant'     => $grant,
            'previous' => $previous,
            'next'     => $next,
            'users'     => User::all(),
            'academicians' => Academician::all(),
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
