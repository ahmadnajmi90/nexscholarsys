<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectGuestsToWelcome
{
    /**
     * Handle an incoming request.
     *
     * Redirects unauthenticated users to the welcome route for public content.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only redirect if user is not authenticated
        if (!Auth::check()) {
            $path = $request->path();
            
            // Check if the current route matches content patterns
            // Matches: events/{slug}, posts/{slug}, projects/{slug}, funding/grants/{slug}, funding/scholarships/{slug}
            if (preg_match('#^(events|posts|projects|funding/(grants|scholarships))/([^/]+)$#', $path)) {
                // Build the welcome route URL
                $welcomePath = 'welcome/' . $path;
                
                // Redirect to the welcome version with all query parameters
                return redirect($welcomePath . ($request->getQueryString() ? '?' . $request->getQueryString() : ''));
            }
        }

        return $next($request);
    }
}

