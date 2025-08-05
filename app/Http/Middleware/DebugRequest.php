<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class DebugRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log the request details
        Log::info('Request URL: ' . $request->fullUrl());
        Log::info('Request Method: ' . $request->method());
        Log::info('Request Headers: ' . json_encode($request->headers->all()));
        Log::info('Request Body: ' . json_encode($request->all()));
        
        // Continue with the request
        $response = $next($request);
        
        // Log the response details
        Log::info('Response Status: ' . $response->getStatusCode());
        Log::info('Response Body: ' . $response->getContent());
        
        return $response;
    }
}