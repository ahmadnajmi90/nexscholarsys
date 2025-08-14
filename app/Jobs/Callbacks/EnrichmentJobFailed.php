<?php

namespace App\Jobs\Callbacks;

use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class EnrichmentJobFailed
{
    public string $jobKey;

    public function __construct(string $jobKey)
    {
        $this->jobKey = $jobKey;
    }

    public function __invoke(Batch $batch, \Throwable $e): void
    {
        Log::error("Job Batch [{$this->jobKey}]: A job in the enrichment batch failed.", ['exception' => $e->getMessage()]);
        Cache::put($this->jobKey, ['status' => 'failed', 'error' => 'Data enrichment failed for one or more programs.'], now()->addMinutes(60));
    }
}

