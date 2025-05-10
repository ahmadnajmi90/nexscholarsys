<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RedirectIfMotivationNotCollected
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Only redirect if the user is verified but has not completed profile
        if (
            $user &&
            $user->email_verified_at !== null &&
            !$user->is_profile_complete &&
            !$user->motivation &&
            !$request->routeIs('why-nexscholar.*') // Don't redirect if already on the motivation page
        ) {
            return redirect()->route('why-nexscholar.show');
        }

        return $next($request);
    }
}
