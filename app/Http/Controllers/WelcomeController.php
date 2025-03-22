<?php

namespace App\Http\Controllers;

use App\Models\CreatePost;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

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
            ? url('storage/' . $post->featured_image) 
            : url('storage/default.jpg');

        // Get the full URL for the current page
        $currentUrl = url()->current();

        $metaTags = [
            'title' => $post->title,
            'description' => $post->excerpt ?? $description,
            'image' => $imageUrl,
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
} 