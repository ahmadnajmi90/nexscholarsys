<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $defaultMetaTags = [
            'title' => config('app.name'),
            'description' => 'Discover the latest articles and resources on NexScholar.',
            'image' => url('storage/default.jpg'),
            'image_width' => 1200,
            'image_height' => 630,
            'type' => 'website',
            'url' => url()->current(),
            'site_name' => 'NexScholar',
            'locale' => 'en_US',
            'published_time' => now()->toIso8601String(),
            'category' => 'General'
        ];

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => [
                'url' => $request->url(),
                'port' => null,
                'defaults' => [],
                'routes' => collect(Route::getRoutes()->getRoutesByName())
                    ->map(function ($route) {
                        return [
                            'uri' => $route->uri(),
                            'methods' => $route->methods(),
                        ];
                    }),
            ],
            'meta' => session('meta', $defaultMetaTags),
        ]);
    }
}
