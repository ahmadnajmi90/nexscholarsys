<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Silber\Bouncer\BouncerFacade as Bouncer;

class PostgraduateMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Bouncer::is($request->user())->a('postgraduate')) {
            return response()->json(['message' => 'Unauthorized. Postgraduate access required.'], 403);
        }

        return $next($request);
    }
}

