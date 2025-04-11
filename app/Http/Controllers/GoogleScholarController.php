<?php

namespace App\Http\Controllers;

use App\Models\Academician;
use App\Services\GoogleScholarService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GoogleScholarController extends Controller
{
    protected $scholarService;

    public function __construct(GoogleScholarService $scholarService)
    {
        $this->scholarService = $scholarService;
    }

    /**
     * Manually trigger Google Scholar scraping for the authenticated academician
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function scrapeOwnProfile(Request $request): JsonResponse
    {
        // Get the current user
        $user = Auth::user();
        
        // Make sure the user is an academician
        if (!$user || !$user->academician) {
            return response()->json([
                'success' => false,
                'message' => 'User is not an academician'
            ], 403);
        }
        
        $academician = $user->academician;
        
        // Check if Google Scholar URL is set
        if (empty($academician->google_scholar)) {
            return response()->json([
                'success' => false,
                'message' => 'Google Scholar URL is not set in your profile'
            ], 400);
        }
        
        // Check cooldown period (prevent too frequent scraping)
        $lastScraping = $academician->scrapingLogs()
            ->where('status', 'success')
            ->orderBy('created_at', 'desc')
            ->first();
            
        if ($lastScraping && $lastScraping->created_at->isAfter(now()->subHours(6))) {
            $nextAvailable = $lastScraping->created_at->addHours(6)->diffForHumans();
            
            return response()->json([
                'success' => false,
                'message' => "Profile was recently updated. Next update available {$nextAvailable}.",
                'next_available' => $lastScraping->created_at->addHours(6)->toIso8601String()
            ]);
        }
        
        // Perform the scraping
        Log::info('Manual scraping initiated by user: ' . $user->id);
        $result = $this->scholarService->scrapeProfile($academician);
        
        if ($result) {
            return response()->json([
                'success' => true,
                'message' => 'Your Google Scholar profile has been successfully updated'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update your Google Scholar profile. Please try again later.'
            ]);
        }
    }
    
    /**
     * Get the latest scraping status for the authenticated academician
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getScrapingStatus(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user || !$user->academician) {
            return response()->json([
                'success' => false,
                'message' => 'User is not an academician'
            ], 403);
        }
        
        $academician = $user->academician;
        
        // Get latest scraping log
        $latestLog = $academician->scrapingLogs()
            ->orderBy('created_at', 'desc')
            ->first();
            
        // Get scholar profile if exists
        $scholarProfile = $academician->scholarProfile;
        
        // Get publication count
        $publicationCount = $academician->publications()->count();
        
        return response()->json([
            'success' => true,
            'has_scholar_url' => !empty($academician->google_scholar),
            'latest_scraping' => $latestLog ? [
                'status' => $latestLog->status,
                'message' => $latestLog->message,
                'created_at' => $latestLog->created_at->toIso8601String(),
                'created_at_human' => $latestLog->created_at->diffForHumans()
            ] : null,
            'profile' => $scholarProfile ? [
                'citations' => $scholarProfile->total_citations,
                'h_index' => $scholarProfile->h_index,
                'i10_index' => $scholarProfile->i10_index,
                'last_updated' => $scholarProfile->last_scraped_at ? $scholarProfile->last_scraped_at->toIso8601String() : null,
                'last_updated_human' => $scholarProfile->last_scraped_at ? $scholarProfile->last_scraped_at->diffForHumans() : null
            ] : null,
            'publication_count' => $publicationCount,
            'can_update' => !$latestLog || 
                            $latestLog->status === 'failure' || 
                            $latestLog->created_at->isBefore(now()->subHours(6))
        ]);
    }
} 