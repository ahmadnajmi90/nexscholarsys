<?php

namespace App\Console\Commands;

use App\Jobs\ScrapeGoogleScholarJob;
use App\Models\Academician;
use App\Models\ScholarProfile;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncGoogleScholarBatch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scholar:sync-batch {--limit=10 : Number of profiles to process} {--force : Force sync even if recently updated}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync a batch of Google Scholar profiles';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $limit = (int) $this->option('limit');
        $force = $this->option('force');
        
        $this->info("Starting batch sync of Google Scholar profiles...");
        
        // Get academicians with Google Scholar URLs
        $query = Academician::whereNotNull('google_scholar')
            ->where('google_scholar', '!=', '');
            
        if (!$force) {
            // Add a subquery to prioritize those not updated recently or never updated
            $query->leftJoin('scholar_profiles', 'academicians.academician_id', '=', 'scholar_profiles.academician_id')
                ->select('academicians.*')
                ->orderByRaw('scholar_profiles.last_scraped_at IS NULL DESC') // Prioritize those never scraped
                ->orderBy('scholar_profiles.last_scraped_at', 'asc'); // Then those not updated for longest time
        }
        
        $academicians = $query->limit($limit)->get();
        
        if ($academicians->isEmpty()) {
            $this->info("No academicians found with Google Scholar URLs.");
            return 0;
        }
        
        $this->info("Found {$academicians->count()} academicians to process.");
        
        $bar = $this->output->createProgressBar($academicians->count());
        $bar->start();
        
        foreach ($academicians as $academician) {
            // Dispatch the job to the queue
            ScrapeGoogleScholarJob::dispatch($academician);
            
            // Add a small delay between job dispatches to avoid overwhelming the queue
            if (!app()->environment('testing')) {
                sleep(1);
            }
            
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine();
        $this->info("Batch sync completed. Jobs dispatched to queue.");
        
        return 0;
    }
} 