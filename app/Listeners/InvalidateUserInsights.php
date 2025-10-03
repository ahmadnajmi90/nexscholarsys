<?php

namespace App\Listeners;

use App\Events\ProfileDataChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class InvalidateUserInsights implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 2;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = 5;

    public function handle(ProfileDataChanged $event): void
    {
        Log::info('Invalidating user insights and cache', [
            'user_id' => $event->user->id
        ]);

        $userId = $event->user->id;

        try {
            // Delete ONLY the supervisor-specific insights for this user
            \App\Models\SupervisorInsight::where('user_id', $userId)->delete();
            
            // Also clear the user's cached vector to force regeneration on the next run
            Cache::forget('postgraduate_rec_user_vec_' . $userId);
            
            Log::info('Successfully invalidated insights for user', [
                'user_id' => $userId
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to invalidate insights for user', [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            
            throw $e;
        }
    }
}

