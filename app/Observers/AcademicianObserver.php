<?php

namespace App\Observers;

use App\Models\Academician;
use App\Jobs\GenerateAcademicianEmbeddings;
use Illuminate\Support\Facades\Log;

class AcademicianObserver
{
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
     * Handle the Academician "created" event.
     */
    public function created(Academician $academician): void
    {
        $this->scheduleEmbeddingGeneration($academician);
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
        
        // If any relevant field was updated, schedule embedding regeneration
        if ($dirty) {
            $this->scheduleEmbeddingGeneration($academician);
        }
    }

    /**
     * Handle the Academician "deleted" event.
     */
    public function deleted(Academician $academician): void
    {
        // Nothing to do - embeddings will be deleted along with the record
    }

    /**
     * Handle the Academician "restored" event.
     */
    public function restored(Academician $academician): void
    {
        $this->scheduleEmbeddingGeneration($academician);
    }

    /**
     * Handle the Academician "force deleted" event.
     */
    public function forceDeleted(Academician $academician): void
    {
        // Nothing to do - embeddings will be deleted along with the record
    }
    
    /**
     * Schedule embedding generation for an academician
     */
    protected function scheduleEmbeddingGeneration(Academician $academician): void
    {
        try {
            // For verified academicians, generate immediately, otherwise delay
            if ($academician->verified && $academician->availability_as_supervisor) {
                GenerateAcademicianEmbeddings::dispatch($academician->id)->onQueue('embedding');
                Log::info("Scheduled immediate embedding generation for academician {$academician->id}");
            } else {
                // Lower priority for non-supervisors
                GenerateAcademicianEmbeddings::dispatch($academician->id)
                    ->onQueue('embedding')
                    ->delay(now()->addMinutes(30));
                Log::info("Scheduled delayed embedding generation for academician {$academician->id}");
            }
        } catch (\Exception $e) {
            Log::error("Failed to schedule embedding generation for academician {$academician->id}: " . $e->getMessage());
        }
    }
}
