<?php

namespace App\Observers;

use App\Models\Academician;
use App\Services\EmbeddingService;
use App\Services\QdrantService;
use App\Jobs\GenerateAcademicianEmbeddings;
use Illuminate\Support\Facades\Log;

class AcademicianObserver
{
    protected $qdrantService;
    protected $embeddingService;

    /**
     * Fields that affect the semantic meaning of an academician profile
     */
    protected $embeddingRelevantFields = [
        'research_expertise',
        'bio',
        'publication_summary',
        'style_of_supervision',
        'current_position',
        'department',
    ];
    
    /**
     * Create a new observer instance.
     */
    public function __construct(QdrantService $qdrantService, EmbeddingService $embeddingService)
    {
        $this->qdrantService = $qdrantService;
        $this->embeddingService = $embeddingService;
    }

    /**
     * Handle the Academician "created" event.
     */
    public function created(Academician $academician): void
    {
        // Dispatch job instead of generating synchronously
        $this->dispatchEmbeddingJob($academician);
    }

    /**
     * Handle the Academician "updated" event.
     */
    public function updated(Academician $academician): void
    {
        // Check if any of the relevant fields were changed
        $dirty = false;
        foreach ($this->embeddingRelevantFields as $field) {
            if ($academician->isDirty($field)) {
                $dirty = true;
                break;
            }
        }
        
        // If any relevant field was updated, dispatch job instead of generating synchronously
        if ($dirty) {
            $this->dispatchEmbeddingJob($academician);
        }
    }

    /**
     * Dispatch a job to generate embeddings asynchronously
     */
    protected function dispatchEmbeddingJob(Academician $academician): void
    {
        // Skip if we don't have enough data to generate a meaningful embedding
        if (!$this->hasMinimumRequiredFields($academician)) {
            Log::info("Skipping embedding generation for academician {$academician->id}: Insufficient data");
            return;
        }

        Log::info("Dispatching async embedding job for academician", [
            'academician_id' => $academician->id,
            'academician_unique_id' => $academician->academician_id
        ]);

        // Dispatch job to queue instead of processing synchronously
        GenerateAcademicianEmbeddings::dispatch($academician->id)
            ->onQueue('embeddings'); // Use dedicated queue for embeddings
    }

    /**
     * Handle the Academician "deleted" event.
     */
    public function deleted(Academician $academician): void
    {
        // Delete embedding from Qdrant
        try {
            $this->qdrantService->deleteAcademicianEmbedding($academician->academician_id);
            Log::info("Deleted embedding from Qdrant for academician {$academician->id}");
        } catch (\Exception $e) {
            Log::error("Failed to delete embedding from Qdrant for academician {$academician->id}: " . $e->getMessage());
        }
    }

    /**
     * Handle the Academician "restored" event.
     */
    public function restored(Academician $academician): void
    {
        $this->generateAndStoreEmbedding($academician);
    }

    /**
     * Handle the Academician "force deleted" event.
     */
    public function forceDeleted(Academician $academician): void
    {
        // Same as soft delete - remove from Qdrant
        try {
            $this->qdrantService->deleteAcademicianEmbedding($academician->academician_id);
            Log::info("Deleted embedding from Qdrant for academician {$academician->id} (force deleted)");
        } catch (\Exception $e) {
            Log::error("Failed to delete embedding from Qdrant for academician {$academician->id} (force deleted): " . $e->getMessage());
        }
    }
    
    /**
     * Generate and store embedding for an academician directly in Qdrant
     */
    protected function generateAndStoreEmbedding(Academician $academician): void
    {
        // Skip if we don't have enough data to generate a meaningful embedding
        if (!$this->hasMinimumRequiredFields($academician)) {
            Log::info("Skipping embedding generation for academician {$academician->id}: Insufficient data");
            return;
        }
        
        try {
            // Generate embedding
            $embeddingVector = $this->embeddingService->generateAcademicianEmbedding($academician);
            
            if (!$embeddingVector) {
                Log::error("Failed to generate embedding for academician {$academician->id}");
                return;
            }
            
            // Prepare additional payload
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
            
            // Upsert to Qdrant
            $result = $this->qdrantService->upsertAcademicianEmbedding(
                $academician->academician_id,
                $academician->id,
                $embeddingVector,
                $payload
            );
            
            if ($result) {
                // Update Qdrant status in MySQL for tracking
                $academician->qdrant_migrated = true;
                $academician->qdrant_migrated_at = now();
                $academician->save();
                
                Log::info("Successfully stored embedding in Qdrant for academician {$academician->id}");
            } else {
                Log::error("Failed to store embedding in Qdrant for academician {$academician->id}");
            }
        } catch (\Exception $e) {
            Log::error("Error handling embedding for academician {$academician->id}: " . $e->getMessage());
        }
    }
    
    /**
     * Check if an academician has minimum required fields for embedding
     */
    protected function hasMinimumRequiredFields(Academician $academician): bool
    {
        // For embedding, we at least need some text about their research
        return (!empty($academician->research_expertise) && $academician->research_expertise !== '[]' && $academician->research_expertise !== 'null') || 
               !empty($academician->research_interests) ||
               !empty($academician->bio) ||
               !empty($academician->field_of_study);
    }
}
