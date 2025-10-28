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

        $user = $request->user();

        if ($user) {
            // Eager-load the academician relationship and its nested relationships
            // to ensure the data is available efficiently.
            $user->loadMissing('academician.scholarProfile', 'academician.publications');

            // Additional computed fields are provided via accessors on the model.
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
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
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'google_calendar_prompt' => session('google_calendar_prompt'),
                'task_for_calendar' => session('task_for_calendar'),
            ],
            'preferences' => [
                'feedback_bubble_dismissed' => session('feedback_bubble_dismissed', false),
            ],
        ]);
    }
}
