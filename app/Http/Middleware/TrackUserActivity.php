<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class TrackUserActivity
{
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            logger('Updating last_activity for user: ' . Auth::user()->id);
            Auth::user()->update(['last_activity' => now()]);
        }

        return $next($request);
    }
}
