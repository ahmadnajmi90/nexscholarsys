<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

class ShareMetaTags
{
    public function handle(Request $request, Closure $next)
    {
        // Default meta tags
        $defaultMetaTags = [
            'title' => config('app.name'),
            'description' => 'Discover the latest articles and resources on NexScholar.',
            'image' => url('storage/default.jpg'),
            'type' => 'website',
            'url' => url()->current(),
            'site_name' => 'NexScholar',
            'locale' => 'en_US',
            'published_time' => now()->toIso8601String(),
            'category' => 'General'
        ];

        // Share default meta tags with all views
        View::share('meta', $defaultMetaTags);

        return $next($request);
    }
} 