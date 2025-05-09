<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Academician;
use App\Services\EmbeddingService;
use App\Services\QdrantService;
use Illuminate\Support\Facades\Log;

class GenerateAcademicianEmbeddings implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $academicianId;
    protected $batchSize;

    /**
     * Create a new job instance.
     * 
     * @param int|null $academicianId Process specific academician or null for batch processing
     * @param int $batchSize Number of records to process in batch mode
     */
    public function __construct($academicianId = null, $batchSize = 20)
    {
        $this->academicianId = $academicianId;
        $this->batchSize = $batchSize;
    }

    /**
     * Execute the job.
     */
    public function handle(EmbeddingService $embeddingService, QdrantService $qdrantService): void
    {
        // Process a single academician if an ID is specified
        if ($this->academicianId) {
            $academician = Academician::find($this->academicianId);
            if ($academician) {
                $this->processAcademician($academician, $embeddingService, $qdrantService);
            }
            return;
        }
        
        // Process a batch of academicians
        $query = Academician::where(function($query) {
            $query->where('qdrant_migrated', false)
                ->orWhereNull('qdrant_migrated')
                ->orWhereNull('qdrant_migrated_at')
                ->orWhere('qdrant_migrated_at', '<', now()->subMonth()); // Re-embed after 30 days
        });
        
        // Prioritize verified academics with availability as supervisor
        $academicians = $query->where('verified', 1)
            ->where('availability_as_supervisor', 1)
            ->take($this->batchSize)
            ->get();
            
        // Process each academician
        $count = 0;
        foreach ($academicians as $academician) {
            try {
                $this->processAcademician($academician, $embeddingService, $qdrantService);
                $count++;
            } catch (\Exception $e) {
                Log::error("Error generating embedding for academician {$academician->id}: " . $e->getMessage());
            }
        }
        
        Log::info("Generated embeddings for {$count} academicians");
        
        // If we processed less than the batch size, there are no more, so we're done
        if ($count < $this->batchSize) {
            Log::info('Completed embedding generation for all academicians');
            return;
        }
        
        // If there are more to process, dispatch another job for the next batch
        self::dispatch()->delay(now()->addSeconds(15));
    }
    
    /**
     * Process a single academician record
     */
    protected function processAcademician(Academician $academician, EmbeddingService $embeddingService, QdrantService $qdrantService): void
    {
        // Generate embedding
        $embedding = $embeddingService->generateAcademicianEmbedding($academician);
        
        if (!$embedding) {
            Log::warning("Failed to generate embedding for academician {$academician->id}");
            return;
        }
        
        // Prepare payload with additional academician data
        $payload = [
            'full_name' => $academician->full_name,
            'university_id' => $academician->university,
            'has_embedding' => true
        ];
        
        // Add additional payload fields if available
        if (!empty($academician->department)) {
            $payload['department'] = $academician->department;
        }
        
        if (!empty($academician->field_of_study)) {
            $payload['field_of_study'] = $academician->field_of_study;
        }
        
        if (!empty($academician->current_position)) {
            $payload['current_position'] = $academician->current_position;
        }
        
        // Store in Qdrant
        $result = $qdrantService->upsertAcademicianEmbedding(
            $academician->academician_id,
            $academician->id,
            $embedding,
            $payload
        );
        
        if ($result) {
            // Update only the Qdrant status in MySQL
            $academician->qdrant_migrated = true;
            $academician->qdrant_migrated_at = now();
            $academician->save();
            
            Log::info("Generated and stored embedding in Qdrant for academician {$academician->id}");
        } else {
            Log::error("Failed to store embedding in Qdrant for academician {$academician->id}");
        }
    }
}
