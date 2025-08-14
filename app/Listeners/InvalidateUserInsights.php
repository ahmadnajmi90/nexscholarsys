<?php

namespace App\Listeners;

use App\Events\ProfileDataChanged;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class InvalidateUserInsights
{
    public function handle(ProfileDataChanged $event): void
    {
        // Log::info('InvalidateUserInsights listener triggered for User ID: ' . $event->user->id);

        $userId = $event->user->id;

        // Delete ONLY the supervisor-specific insights for this user
        \App\Models\SupervisorInsight::where('user_id', $userId)->delete();
        
        // Also clear the user's cached vector to force regeneration on the next run
        \Illuminate\Support\Facades\Cache::forget('phd_rec_user_vec_' . $userId);
    }
}

