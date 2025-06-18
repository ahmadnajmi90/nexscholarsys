<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Connection;
use Illuminate\Support\Facades\Auth;

class ShareInertiaData
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
        // Only share data if user is authenticated
        if (Auth::check()) {
            $user = Auth::user();
            
            // Get count of pending received connection requests
            $pendingRequestCount = Connection::where('recipient_id', $user->id)
                ->where('status', 'pending')
                ->count();
            
            // Share the count with Inertia
            Inertia::share('pendingRequestCount', $pendingRequestCount);
        }
        
        return $next($request);
    }
} 