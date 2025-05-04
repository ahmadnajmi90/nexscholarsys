<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Academician;
use App\Services\EmbeddingService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
    public function handle(EmbeddingService $embeddingService): void
    {
        // Process a single academician if an ID is specified
        if ($this->academicianId) {
            $academician = Academician::find($this->academicianId);
            if ($academician) {
                $this->processAcademician($academician, $embeddingService);
            }
            return;
        }
        
        // Process a batch of academicians
        $query = Academician::where(function($query) {
            $query->where('has_embedding', false)
                ->orWhereNull('has_embedding')
                ->orWhereNull('embedding_updated_at')
                ->orWhere('embedding_updated_at', '<', now()->subDays(30)); // Re-embed after 30 days
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
                $this->processAcademician($academician, $embeddingService);
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
    protected function processAcademician(Academician $academician, EmbeddingService $embeddingService): void
    {
        // Generate embedding
        $embedding = $embeddingService->generateAcademicianEmbedding($academician);
        
        if (!$embedding) {
            Log::warning("Failed to generate embedding for academician {$academician->id}");
            return;
        }
        
        // Update the record with the embedding
        if (config('database.default') === 'pgsql') {
            // For PostgreSQL, store as vector type
            DB::statement('UPDATE academicians SET embedding_vector = ?, has_embedding = true, embedding_updated_at = ? WHERE id = ?', [
                "[" . implode(',', $embedding) . "]", // Convert array to Postgres vector string format
                now(),
                $academician->id
            ]);
        } else {
            // For other databases, store as JSON
            $academician->embedding_vector = $embedding;
            $academician->has_embedding = true;
            $academician->embedding_updated_at = now();
            $academician->save();
        }
        
        Log::info("Generated embedding for academician {$academician->id}");
    }
}
