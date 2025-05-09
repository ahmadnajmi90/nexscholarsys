<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class QdrantRolloutMiddleware
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
        // Check if Qdrant is enabled globally
        $qdrantEnabled = config('services.qdrant.enabled', false);
        
        // If Qdrant is globally disabled, skip rollout logic
        if (!$qdrantEnabled) {
            $this->setQdrantFlag(false);
            return $next($request);
        }
        
        // Get the rollout percentage from config
        $rolloutPercentage = config('services.qdrant.percentage', 0);
        
        // If explicitly set to 100%, enable for everyone
        if ($rolloutPercentage >= 100) {
            $this->setQdrantFlag(true);
            return $next($request);
        }
        
        // Check for debug parameter to force Qdrant usage
        if ($request->has('use_qdrant') && $request->user() && $request->user()->can('debug_features')) {
            // Allow admin/debug users to explicitly test with Qdrant
            $useQdrant = filter_var($request->input('use_qdrant'), FILTER_VALIDATE_BOOLEAN);
            $this->setQdrantFlag($useQdrant);
            
            // Log this explicit override
            Log::info('Explicit Qdrant usage override', [
                'user_id' => $request->user()->id,
                'use_qdrant' => $useQdrant
            ]);
            
            return $next($request);
        }
        
        // For normal users, use session to keep their experience consistent
        if (Session::has('use_qdrant')) {
            // Use the stored value to ensure consistent user experience
            return $next($request);
        }
        
        // For new sessions, make a random determination based on percentage
        $useQdrant = (mt_rand(1, 100) <= $rolloutPercentage);
        $this->setQdrantFlag($useQdrant);
        
        // Log for monitoring rollout
        if ($request->user() && $useQdrant) {
            Log::info('User included in Qdrant rollout', [
                'user_id' => $request->user()->id,
                'rollout_percentage' => $rolloutPercentage
            ]);
        }
        
        return $next($request);
    }
    
    /**
     * Set the Qdrant usage flag in both session and config
     *
     * @param bool $useQdrant
     * @return void
     */
    protected function setQdrantFlag(bool $useQdrant): void
    {
        // Store in session for consistent experience across requests
        Session::put('use_qdrant', $useQdrant);
        
        // Also set in config for this request
        Config::set('services.qdrant.use_for_request', $useQdrant);
    }
} 