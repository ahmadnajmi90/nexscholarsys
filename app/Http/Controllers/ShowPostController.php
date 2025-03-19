<?php

namespace App\Http\Controllers;
use App\Models\CreatePost;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use Illuminate\Support\Str;

use Illuminate\Http\Request;

class ShowPostController extends Controller
{
    // In ShowPostController.php
    public function index()
    {
        $posts = CreatePost::where('status', 'published')
                    ->orderBy('created_at', 'desc')
                    ->get();

        return Inertia::render('Post/Post', [
            'posts' => $posts,
        ]);
    }

    public function show(CreatePost $post)
    {
        // Using created_at for ordering, matching the index order (newest first)

        // For descending order, the "previous" post is the one with a created_at value greater than the current post.
        // If the current post is the latest, no such post exists.
        $previous = CreatePost::where('created_at', '>', $post->created_at)
                            ->orderBy('created_at', 'desc')
                            ->first();

        // The "next" post is the one with a created_at value less than the current post.
        $next = CreatePost::where('created_at', '<', $post->created_at)
                        ->orderBy('created_at', 'desc')
                        ->first();

        $post->increment('total_views'); // Increment view count
        $user = auth()->user();
        // Check if the authenticated user has liked the post
        $post->liked = $user ? $post->likedUsers->contains($user->id) : false;

        $ogTitle = $post->title;
        $ogDescription = $post->excerpt ?? Str::limit(strip_tags($post->content), 200);
        $ogUrl = url()->current();
        $ogImage = $post->featured_image 
            ? asset('storage/' . $post->featured_image) 
            : asset('storage/default-image.jpg');

        return Inertia::render('Post/Show', [
            'post'     => $post,
            'previous' => $previous,
            'next'     => $next,
            'users'     => User::all(),
            'academicians' => Academician::all(),
            'postgraduates' => Postgraduate::all(),
            'undergraduates' => Undergraduate::all(),
            'ogTitle' => $ogTitle,
            'ogDescription' => $ogDescription,
            'ogUrl' => $ogUrl,
            'ogImage' => $ogImage,
        ]);
    }

    public function toggleLike(Request $request, $url)
    {
        $post = CreatePost::where('url', $url)->firstOrFail();
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if ($post->likedUsers()->where('user_id', $user->id)->exists()) {
            // Unlike
            $post->likedUsers()->detach($user->id);
        } else {
            // Like
            $post->likedUsers()->attach($user->id);
        }
        
        // Optionally update a cached total like count on the posts table.
        $post->total_likes = $post->likedUsers()->count();
        $post->save();

        return response()->json([
            'total_likes' => $post->total_likes,
            'liked' => $post->likedUsers()->where('user_id', $user->id)->exists()
        ]);
    }

    public function share($url)
    {
        $post = CreatePost::where('url', $url)->firstOrFail();
        $post->increment('total_shares');

        return response()->json(['total_shares' => $post->total_shares]);
    }
}
