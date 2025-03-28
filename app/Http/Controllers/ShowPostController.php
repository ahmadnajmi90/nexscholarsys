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
        // Get the current user (authenticated or null)
        $user = Auth::check() ? Auth::user() : null;
        
        // Get the visitor's IP address if not authenticated
        $ipAddress = !$user ? request()->ip() : null;
        
        // Record the view and automatically increment total_views if needed
        $post->recordView($user ? $user->id : null, $ipAddress);

        // Get the previous and next posts
        $previous = CreatePost::where('created_at', '<', $post->created_at)
            ->orderBy('created_at', 'desc')
            ->first();

        $next = CreatePost::where('created_at', '>', $post->created_at)
            ->orderBy('created_at', 'asc')
            ->first();

        // Get 4 latest posts excluding the current post
        $relatedPosts = CreatePost::where('id', '!=', $post->id)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

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
            'url' => route('welcome.posts.show', $post),
            'published_time' => $post->created_at->toIso8601String(),
            'category' => $post->category ?? null,
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return Inertia::render('Post/Show', [
            'post' => $post,
            'previous' => $previous,
            'next' => $next,
            'academicians' => Academician::all(),
            'postgraduates' => Postgraduate::all(),
            'undergraduates' => Undergraduate::all(),
            'relatedPosts' => $relatedPosts,
            'metaTags' => $metaTags,
        ])->with([
            'meta' => $metaTags
        ]);
    }

    public function toggleLike(Request $request, $url)
    {
        $post = CreatePost::where('url', $url)->firstOrFail();
        $user = Auth::user();
        
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

    public function share(Request $request, $url)
    {
        $post = CreatePost::where('url', $url)->firstOrFail();
        
        // Clean description for meta tags
        $description = strip_tags($post->content);
        $description = str_replace(["\n", "\r", "\t"], ' ', $description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = substr($description, 0, 200) . '...';

        // Handle image URL and dimensions
        $imageUrl = $post->featured_image 
            ? secure_url('/storage/' . $post->featured_image) 
            : secure_url('/storage/default-image.jpg');

        // Get image dimensions
        $imagePath = $post->featured_image 
            ? storage_path('app/public/' . $post->featured_image)
            : public_path('storage/default-image.jpg');
            
        $imageSize = @getimagesize($imagePath);
        $imageWidth = $imageSize ? $imageSize[0] : 1200;
        $imageHeight = $imageSize ? $imageSize[1] : 630;

        $metaTags = [
            'title' => $post->title,
            'description' => $description,
            'image' => $imageUrl,
            'image_width' => $imageWidth,
            'image_height' => $imageHeight,
            'type' => 'article',
            'url' => route('welcome.posts.show', $post),
            'published_time' => $post->created_at->toIso8601String(),
            'category' => 'Post',
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return response()->json([
            'success' => true,
            'metaTags' => $metaTags
        ]);
    }
}
