<?php

namespace App\Console\Commands;

use App\Jobs\ScrapeGoogleScholarJob;
use App\Models\Academician;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SyncGoogleScholarScheduled extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scholar:sync-scheduled 
                            {--days=7 : Days since last update to consider for resync} 
                            {--batch=20 : Maximum number of profiles to update per run}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scheduled sync of Google Scholar profiles based on last update time';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $days = (int) $this->option('days');
        $batchSize = (int) $this->option('batch');
        
        $this->info("Starting scheduled sync of Google Scholar profiles...");
        Log::info("Starting scheduled Google Scholar sync (days: {$days}, batch: {$batchSize})");
        
        // Get academicians that need updating
        $academicians = Academician::whereNotNull('google_scholar')
            ->where('google_scholar', '!=', '')
            ->leftJoin('scholar_profiles', 'academicians.academician_id', '=', 'scholar_profiles.academician_id')
            ->select('academicians.*')
            ->where(function($query) use ($days) {
                $query->whereNull('scholar_profiles.last_scraped_at')
                    ->orWhere('scholar_profiles.last_scraped_at', '<', now()->subDays($days));
            })
            ->orderByRaw('scholar_profiles.last_scraped_at IS NULL DESC')
            ->orderBy('scholar_profiles.last_scraped_at', 'asc')
            ->limit($batchSize)
            ->get();
        
        $count = $academicians->count();
        
        if ($count === 0) {
            $this->info("No profiles need updating at this time.");
            Log::info("No Google Scholar profiles needed updating during scheduled run");
            return 0;
        }
        
        $this->info("Found {$count} academicians to update.");
        Log::info("Dispatching {$count} Google Scholar profile update jobs");
        
        // Process academicians
        foreach ($academicians as $academician) {
            ScrapeGoogleScholarJob::dispatch($academician);
            
            // Add a small delay between job dispatches
            if (!app()->environment('testing')) {
                usleep(500000); // 0.5 second delay
            }
        }
        
        $this->info("Scheduled sync completed. {$count} jobs dispatched to queue.");
        Log::info("Completed scheduled Google Scholar sync. {$count} jobs dispatched");
        
        return 0;
    }
} 