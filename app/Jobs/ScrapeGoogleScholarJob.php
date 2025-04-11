<?php

namespace App\Jobs;

use App\Models\Academician;
use App\Services\GoogleScholarService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ScrapeGoogleScholarJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The academician instance.
     *
     * @var \App\Models\Academician
     */
    protected $academician;

    /**
     * The number of tries to attempt.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The backoff time in seconds between retries.
     *
     * @var array
     */
    public $backoff = [30, 60, 120];

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     *
     * @var int
     */
    public $maxExceptions = 2;

    /**
     * Create a new job instance.
     *
     * @param \App\Models\Academician $academician
     * @return void
     */
    public function __construct(Academician $academician)
    {
        $this->academician = $academician;
        $this->onQueue('scraping');
    }

    /**
     * Get the unique ID for the job.
     *
     * @return string
     */
    public function uniqueId()
    {
        return 'google_scholar_' . $this->academician->academician_id;
    }

    /**
     * Execute the job.
     *
     * @param \App\Services\GoogleScholarService $googleScholarService
     * @return void
     */
    public function handle(GoogleScholarService $googleScholarService)
    {
        Log::info("Starting Google Scholar scraping job for academician: " . $this->academician->id);
        
        $result = $googleScholarService->scrapeProfile($this->academician);
        
        if ($result) {
            Log::info("Google Scholar scraping completed successfully for academician: " . $this->academician->id);
        } else {
            Log::warning("Google Scholar scraping failed for academician: " . $this->academician->id);
        }
    }
} 