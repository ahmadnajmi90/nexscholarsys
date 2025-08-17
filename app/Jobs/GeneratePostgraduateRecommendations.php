<?php

namespace App\Jobs;

use App\Models\PostgraduateProgram;
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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Services\CVParserService;
use Illuminate\Support\Facades\Bus;
use App\Jobs\Callbacks\AllEnrichmentJobsCompleted;
use App\Jobs\Callbacks\EnrichmentJobFailed;

class GeneratePostgraduateRecommendations implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    public int $userId;
    public string $cvPath;
    public string $researchText;
    public string $programType;
    public string $jobKey; // for status tracking via cache
    public string $profileHash;

    public function __construct(int $userId, string $cvPath, string $researchText, string $programType, string $jobKey, string $profileHash)
    {
        $this->userId = $userId;
        $this->cvPath = $cvPath;
        $this->researchText = $researchText;
        $this->programType = $programType;
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

            // Step 1: Find and analyze programs
            $results = $programMatchingService->findAndAnalyzePrograms($user, $this->jobKey, $this->profileHash, $this->programType);

            Log::info("Job [{$this->jobKey}]: Program analysis complete. Found " . count($results) . " recommendations.");

            // Step 2: Check which programs need research area enrichment
            $programsNeedingEnrichment = [];
            foreach ($results as $result) {
                $program = PostgraduateProgram::find($result['postgraduate_program_id']);
                if ($program && is_null($program->research_areas)) {
                    Log::info("Job [{$this->jobKey}]: Program ID {$program->id} needs research area enrichment.");
                    $programsNeedingEnrichment[] = new GenerateProgramResearchAreas($program);
                }
            }

            // Step 3: Dispatch enrichment batch if needed
            if (!empty($programsNeedingEnrichment)) {
                Log::info("Job [{$this->jobKey}]: Dispatching " . count($programsNeedingEnrichment) . " enrichment jobs.");
                
                $batch = Bus::batch($programsNeedingEnrichment)
                    ->then(new AllEnrichmentJobsCompleted($this->jobKey))
                    ->catch(new EnrichmentJobFailed($this->jobKey))
                    ->name("postgraduate-enrichment-{$this->jobKey}")
                    ->dispatch();

                Log::info("Job [{$this->jobKey}]: Enrichment batch dispatched with ID: {$batch->id}");
                
                // Update cache to indicate enrichment is in progress
                Cache::put($this->jobKey, ['status' => 'generating_recommendations', 'progress' => 90], now()->addMinutes(60));
            } else {
                Log::info("Job [{$this->jobKey}]: No programs need enrichment. Marking as completed.");
                Cache::put($this->jobKey, ['status' => 'completed', 'progress' => 100], now()->addMinutes(60));
            }

        } catch (\Exception $e) {
            Log::error("Job [{$this->jobKey}]: An exception occurred: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            Cache::put($this->jobKey, ['status' => 'failed', 'progress' => 100, 'error' => $e->getMessage()], now()->addMinutes(30));
        }
    }
}