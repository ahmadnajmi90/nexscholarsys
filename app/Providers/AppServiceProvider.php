<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Http\Middleware\InjectUserRoles;
use App\Models\Academician;
use App\Observers\AcademicianObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    // protected $policies = [
    //     PostGrantForStudent::class => PostGrantForStudentPolicy::class,
    // ];

    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Register the middleware manually
        $this->app['router']->pushMiddlewareToGroup('web', InjectUserRoles::class);

        // Register model observers
        Academician::observe(AcademicianObserver::class);

        // Disable response caching during debugging
        \Inertia\Inertia::version(function () {
            return uniqid();
        });
    }
}
