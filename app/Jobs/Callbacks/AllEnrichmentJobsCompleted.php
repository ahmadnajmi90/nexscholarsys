<?php

namespace App\Jobs\Callbacks;

use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AllEnrichmentJobsCompleted
{
    public string $jobKey;

    public function __construct(string $jobKey)
    {
        $this->jobKey = $jobKey;
    }

    public function __invoke(Batch $batch): void
    {
        Log::info("Job Batch [{$this->jobKey}]: All enrichment jobs completed successfully.");
        Cache::put($this->jobKey, ['status' => 'completed', 'progress' => 100], now()->addMinutes(60));
    }
}

