<?php

namespace App\Http\Controllers;
use App\Models\CreatePost;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;

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

        return Inertia::render('Post/Show', [
            'post'     => $post,
            'previous' => $previous,
            'next'     => $next,
        ]);
    }
}
