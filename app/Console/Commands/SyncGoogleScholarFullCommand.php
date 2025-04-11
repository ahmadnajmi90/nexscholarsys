<?php

namespace App\Console\Commands;

use App\Jobs\ScrapeGoogleScholarJob;
use App\Models\Academician;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SyncGoogleScholarFullCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scholar:sync-full 
                            {--chunk=25 : Number of academicians to process per batch} 
                            {--delay=10 : Seconds to delay between batches}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize ALL academicians with Google Scholar profiles';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $chunkSize = (int) $this->option('chunk');
        $delaySeconds = (int) $this->option('delay');
        
        $this->info("Starting full synchronization of all Google Scholar profiles...");
        Log::info("Starting full Google Scholar synchronization");
        
        // Count total academicians with Google Scholar URLs
        $total = Academician::whereNotNull('google_scholar')
            ->where('google_scholar', '!=', '')
            ->count();
            
        if ($total === 0) {
            $this->info("No academicians found with Google Scholar URLs.");
            Log::info("No Google Scholar profiles found for synchronization");
            return 0;
        }
        
        $this->info("Found {$total} academicians with Google Scholar profiles.");
        Log::info("Found {$total} academicians with Google Scholar profiles for full sync");
        
        // Set up progress bar
        $bar = $this->output->createProgressBar($total);
        $bar->start();
        
        // Process in chunks to avoid memory issues
        Academician::whereNotNull('google_scholar')
            ->where('google_scholar', '!=', '')
            ->chunkById(
                $chunkSize, 
                function ($academicians) use ($bar, $delaySeconds) {
                    foreach ($academicians as $academician) {
                        // Dispatch job to queue
                        ScrapeGoogleScholarJob::dispatch($academician);
                        $bar->advance();
                    }
                    
                    // Add delay between chunks to avoid rate limiting
                    if ($delaySeconds > 0 && !app()->environment('testing')) {
                        sleep($delaySeconds);
                    }
                }
            );
        
        $bar->finish();
        $this->newLine(2);
        $this->info("Full synchronization completed. All jobs dispatched to queue.");
        Log::info("Completed dispatching all jobs for full Google Scholar synchronization");
        
        return 0;
    }
} 