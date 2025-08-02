<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\RedirectIfMotivationNotCollected::class,
            \App\Http\Middleware\ShareInertiaData::class,
        ]);

        // Register the QdrantRolloutMiddleware as a global middleware
        $middleware->append(\App\Http\Middleware\QdrantRolloutMiddleware::class);
        
        // Optionally create a named middleware alias
        $middleware->alias([
            'qdrant.rollout' => \App\Http\Middleware\QdrantRolloutMiddleware::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->withSchedule(function (Schedule $schedule) {
        // Daily scheduled synchronization at midnight is now removed
        // Weekly full batch processing on Sundays is now removed
        
        // Keep any other scheduled tasks that are not related to Google Scholar
    })
    ->create();
