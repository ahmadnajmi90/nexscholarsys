<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Silber\Bouncer\BouncerFacade as Bouncer;

class AdminMiddleware
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
        if (!Bouncer::is($request->user())->an('admin')) {
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        return $next($request);
    }
}