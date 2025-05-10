<?php

namespace App\Console\Commands;

use App\Models\Academician;
use App\Services\GoogleScholarPythonService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ScrapeGoogleScholar extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scholar:scrape 
                            {academician_id? : The academician ID to scrape}
                            {--url= : The Google Scholar URL to scrape (for testing)}
                            {--all : Scrape all academicians with Google Scholar URLs}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Scrape Google Scholar profiles using Python script';

    /**
     * The GoogleScholarPythonService instance.
     *
     * @var \App\Services\GoogleScholarPythonService
     */
    protected $scholarService;

    /**
     * Create a new command instance.
     *
     * @param \App\Services\GoogleScholarPythonService $scholarService
     * @return void
     */
    public function __construct(GoogleScholarPythonService $scholarService)
    {
        parent::__construct();
        $this->scholarService = $scholarService;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Direct URL test (mainly for debugging)
        if ($this->option('url')) {
            $url = $this->option('url');
            $academicianId = $this->argument('academician_id') ?? 'test_user';
            
            $this->info("Testing direct scraping of URL: {$url}");
            $result = $this->scholarService->runScriptDirectly($url, $academicianId);
            
            if ($result['success']) {
                $this->info("Success! Output: " . $result['output']);
                return 0;
            } else {
                $this->error("Failed. Error: " . $result['error']);
                return 1;
            }
        }
        
        // Scrape all academicians with Google Scholar URLs
        if ($this->option('all')) {
            $academicians = Academician::whereNotNull('google_scholar')
                ->where('google_scholar', '!=', '')
                ->get();
                
            $this->info("Found {$academicians->count()} academicians with Google Scholar URLs");
            
            $success = 0;
            $failed = 0;
            
            foreach ($academicians as $academician) {
                $this->info("Scraping academician: {$academician->full_name} ({$academician->academician_id})");
                try {
                    $result = $this->scholarService->scrapeProfile($academician);
                    if ($result) {
                        $this->info("✓ Successfully scraped profile");
                        $success++;
                    } else {
                        $this->warn("✗ Failed to scrape profile");
                        $failed++;
                    }
                } catch (\Exception $e) {
                    $this->error("✗ Error: " . $e->getMessage());
                    Log::error("Scholar scrape error: " . $e->getMessage());
                    $failed++;
                }
                
                // Wait a bit between requests to avoid rate limiting
                sleep(5);
            }
            
            $this->info("\nScraping completed. Success: {$success}, Failed: {$failed}");
            return $failed > 0 ? 1 : 0;
        }
        
        // Scrape a specific academician
        $academicianId = $this->argument('academician_id');
        if (!$academicianId) {
            $this->error("Please provide an academician_id or use the --all option");
            return 1;
        }
        
        $academician = Academician::where('academician_id', $academicianId)->first();
        if (!$academician) {
            $this->error("Academician not found with ID: {$academicianId}");
            return 1;
        }
        
        if (empty($academician->google_scholar)) {
            $this->error("This academician does not have a Google Scholar URL set");
            return 1;
        }
        
        $this->info("Scraping Google Scholar profile for: {$academician->full_name}");
        $this->info("URL: {$academician->google_scholar}");
        
        try {
            $result = $this->scholarService->scrapeProfile($academician);
            if ($result) {
                $this->info("✓ Successfully scraped profile");
                return 0;
            } else {
                $this->warn("✗ Failed to scrape profile");
                return 1;
            }
        } catch (\Exception $e) {
            $this->error("✗ Error: " . $e->getMessage());
            Log::error("Scholar scrape error: " . $e->getMessage());
            return 1;
        }
    }
} 