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
        $previous = CreatePost::where('created_at', '>', $post->created_at)
                            ->orderBy('created_at', 'desc')
                            ->first();

        $next = CreatePost::where('created_at', '<', $post->created_at)
                        ->orderBy('created_at', 'desc')
                        ->first();

        $post->increment('total_views'); // Increment view count
        $user = auth()->user();
        $post->liked = $user ? $post->likedUsers->contains($user->id) : false;

        // Ensure we have a clean description without HTML tags
        $description = strip_tags($post->content);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Ensure we have a proper image URL
        $imageUrl = $post->featured_image 
            ? secure_url('/storage/' . $post->featured_image) 
            : secure_url('/storage/default-image.jpg');

        $metaTags = [
            'title' => $post->title,
            'description' => $post->excerpt ?? $description,
            'image' => $imageUrl,
            'type' => 'article',
            'url' => secure_url()->current(),
            'published_time' => $post->created_at->toIso8601String(),
            'category' => $post->category ?? null,
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return Inertia::render('Post/Show', [
            'post'     => $post,
            'previous' => $previous,
            'next'     => $next,
            'users'     => User::all(),
            'academicians' => Academician::all(),
            'postgraduates' => Postgraduate::all(),
            'undergraduates' => Undergraduate::all(),
            'metaTags' => $metaTags,
        ])->with([
            'meta' => $metaTags
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
