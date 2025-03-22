<?php

namespace App\Http\Controllers;

use App\Models\CreatePost;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;

class WelcomeController extends Controller
{
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

        // Ensure we have a proper image URL
        $imageUrl = $post->featured_image 
            ? secure_url('/storage/' . $post->featured_image) 
            : secure_url('/storage/default-image.jpg');

        $metaTags = [
            'title' => $post->title,
            'description' => $post->excerpt ?? $description,
            'image' => $imageUrl,
            'type' => 'article',
            'url' => secure_url(request()->path()),
            'published_time' => $post->created_at->toIso8601String(),
            'category' => $post->category ?? null,
            'site_name' => config('app.name'),
            'locale' => 'en_US'
        ];

        return Inertia::render('Post/WelcomePostShow', [
            'post' => $post,
            'previous' => $previous,
            'next' => $next,
            'users' => User::all(),
            'academicians' => Academician::all(),
            'postgraduates' => Postgraduate::all(),
            'undergraduates' => Undergraduate::all(),
            'metaTags' => $metaTags,
        ])->with([
            'meta' => $metaTags
        ]);
    }
} 