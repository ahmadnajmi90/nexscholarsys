<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Academician;
use App\Services\EmbeddingService;
use Illuminate\Support\Facades\Log;

class RegenerateEmbeddingsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'embeddings:regenerate {--academician_id= : Specific academician ID to regenerate}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate embeddings for all academicians with improved text representation';

    /**
     * Execute the console command.
     */
    public function handle(EmbeddingService $embeddingService)
    {
        $specificId = $this->option('academician_id');
        
        if ($specificId) {
            $academician = Academician::find($specificId);
            if (!$academician) {
                $this->error("Academician with ID {$specificId} not found.");
                return 1;
            }
            
            $this->info("Regenerating embedding for academician: {$academician->full_name}");
            $this->regenerateEmbedding($academician, $embeddingService);
            return 0;
        }
        
        // Get all academicians (or those that need regeneration)
        $academicians = Academician::whereNotNull('research_expertise')
            ->whereNotNull('field_of_study')
            ->whereNotNull('academician_id')
            ->where('profile_picture', '!=', 'profile_pictures/default.jpg')
            ->where(function($query) {
                $query->where('research_expertise', '!=', '[]')
                      ->where('research_expertise', '!=', 'null')
                      ->whereNotNull('research_expertise');
            })
            ->get();
            
        $count = $academicians->count();
        $this->info("Found {$count} academicians with complete profiles for embedding regeneration");
        
        $bar = $this->output->createProgressBar($count);
        $bar->start();
        
        $success = 0;
        $failed = 0;
        
        foreach ($academicians as $academician) {
            $result = $this->regenerateEmbedding($academician, $embeddingService);
            if ($result) {
                $success++;
            } else {
                $failed++;
            }
            $bar->advance();
        }
        
        $bar->finish();
        $this->newLine();
        $this->info("Completed embedding regeneration: {$success} successful, {$failed} failed");
        
        return 0;
    }
    
    /**
     * Regenerate embedding for a single academician
     */
    protected function regenerateEmbedding(Academician $academician, EmbeddingService $embeddingService): bool
    {
        try {
            // Validate required fields
            if (empty($academician->research_expertise) ||
                empty($academician->field_of_study) ||
                empty($academician->academician_id) ||
                $academician->profile_picture === 'profile_pictures/default.jpg' ||
                $academician->research_expertise === '[]' ||
                $academician->research_expertise === 'null'
            ) {
                Log::warning("Skipping embedding generation for academician {$academician->id}: Incomplete profile");
                return false;
            }
            
            // Generate embedding
            $embedding = $embeddingService->generateAcademicianEmbedding($academician);
            
            if (!$embedding) {
                Log::warning("Failed to generate embedding for academician {$academician->id}");
                return false;
            }
            
            // Update the record with the embedding
            $academician->embedding_vector = $embedding;
            $academician->has_embedding = true;
            $academician->embedding_updated_at = now();
            $academician->save();
            
            Log::info("Regenerated embedding for academician {$academician->id}");
            return true;
        } catch (\Exception $e) {
            Log::error("Error regenerating embedding for academician {$academician->id}: " . $e->getMessage());
            return false;
        }
    }
} 