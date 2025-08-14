<?php

namespace App\Jobs;

use App\Models\PhDProgram;
use App\Services\EmbeddingService;
use App\Services\QdrantService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Bus\Queueable;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
    use App\Jobs\GenerateProgramResearchAreas;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Services\CVParserService;
use Illuminate\Support\Facades\Bus;
use App\Jobs\Callbacks\AllEnrichmentJobsCompleted;
use App\Jobs\Callbacks\EnrichmentJobFailed;

class GeneratePhDRecommendations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    public int $userId;
    public string $cvPath;
    public string $researchText;
    public string $jobKey; // for status tracking via cache
    public string $profileHash;

    public function __construct(int $userId, string $cvPath, string $researchText, string $jobKey, string $profileHash)
    {
        $this->userId = $userId;
        $this->cvPath = $cvPath;
        $this->researchText = $researchText;
        $this->jobKey = $jobKey;
        $this->profileHash = $profileHash;
    }

    public function handle(\App\Services\ProgramMatchingService $programMatchingService): void
    {
        try {
            Log::info("Job [{$this->jobKey}]: Starting program analysis for User ID: {$this->userId}.");

            $user = \App\Models\User::find($this->userId);
            if (!$user) {
                Log::error("Job [{$this->jobKey}]: User not found. Exiting.");
                return;
            }

            $programMatchingService->findAndAnalyzePrograms($user, $this->jobKey, $this->profileHash);

            Log::info("Job [{$this->jobKey}]: Program analysis complete.");
            Cache::put($this->jobKey, ['status' => 'completed', 'progress' => 100], now()->addMinutes(60));

        } catch (\Exception $e) {
            Log::error("Job [{$this->jobKey}]: An exception occurred: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            Cache::put($this->jobKey, ['status' => 'failed', 'progress' => 100, 'error' => $e->getMessage()], now()->addMinutes(30));
        }
    }
}

