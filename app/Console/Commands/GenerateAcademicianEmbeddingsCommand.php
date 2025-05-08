<?php

namespace App\Console\Commands;

use App\Models\Academician;
use App\Services\EmbeddingService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateAcademicianEmbeddingsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'embeddings:generate-academician 
                           {academician_id? : The ID of a specific academician} 
                           {--force : Force regeneration even if already embedded} 
                           {--batch-size=20 : Number of academicians to process per batch}
                           {--complete-only : Only process academicians with complete profiles}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate or regenerate embeddings for academicians for semantic search';

    protected $embeddingService;

    /**
     * Create a new command instance.
     */
    public function __construct(EmbeddingService $embeddingService)
    {
        parent::__construct();
        $this->embeddingService = $embeddingService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $academicianId = $this->argument('academician_id');
        $force = $this->option('force');
        $batchSize = (int)$this->option('batch-size');
        $completeOnly = $this->option('complete-only');
        
        if ($academicianId) {
            $this->processSpecificAcademician($academicianId, $force, $completeOnly);
        } else {
            $this->processAllAcademicians($force, $batchSize, $completeOnly);
        }
        
        return Command::SUCCESS;
    }
    
    /**
     * Process a specific academician
     */
    public function processSpecificAcademician($academicianId, $force, $completeOnly = false)
    {
        $academician = Academician::find($academicianId);
        
        if (!$academician) {
            $this->error("Academician with ID {$academicianId} not found");
            return;
        }
        
        if ($academician->has_embedding && !$force) {
            $this->info("Academician already has an embedding. Use --force to regenerate.");
            return;
        }
        
        // Check if complete profile is required
        if ($completeOnly && !$this->hasCompleteProfile($academician)) {
            $this->warn("Academician {$academician->full_name} (ID: {$academicianId}) has an incomplete profile. Skipping.");
            return;
        }
        
        $this->info("Generating embedding for {$academician->full_name}");
        $result = $this->processAcademician($academician);
        
        if ($result) {
            $this->info("Successfully generated embedding for academician ID {$academicianId}");
        } else {
            $this->error("Failed to generate embedding for academician ID {$academicianId}");
        }
    }
    
    /**
     * Process all academicians
     */
    public function processAllAcademicians($force, $batchSize, $completeOnly = false)
    {
        if ($force) {
            // For force, mark all as needing regeneration
            Academician::query()->update(['has_embedding' => false]);
            $this->info("Marked all academicians for embedding regeneration");
        }
        
        // Get count of academicians needing embedding
        $query = Academician::where(function($query) {
            $query->where('has_embedding', false)
                ->orWhereNull('has_embedding')
                ->orWhereNull('embedding_updated_at');
        });
        
        // Add complete profile filters if requested
        if ($completeOnly) {
            $query->whereNotNull('research_expertise')
                ->whereNotNull('field_of_study')
                ->whereNotNull('academician_id')
                ->where('profile_picture', '!=', 'profile_pictures/default.jpg')
                ->where(function($q) {
                    $q->where('research_expertise', '!=', '[]')
                      ->where('research_expertise', '!=', 'null')
                      ->whereNotNull('research_expertise');
                });
            
            $this->info("Filtering for academicians with complete profiles only");
        }
        
        $count = $query->count();
        
        if ($count === 0) {
            $this->info($completeOnly 
                ? "No academicians with complete profiles need embedding generation. Use --force to regenerate all." 
                : "No academicians need embedding generation. Use --force to regenerate all.");
            return;
        }
        
        $this->info("Found {$count} academicians needing embeddings");
        
        // Ask for confirmation if it's a large number
        if ($count > 100 && !$this->confirm("This will process {$count} academicians. Continue?")) {
            return;
        }
        
        // Process academicians in chunks
        $processedCount = 0;
        $failedCount = 0;
        $skippedCount = 0;
        
        $progressBar = $this->output->createProgressBar($count);
        $progressBar->start();
        
        // Build the base query
        $baseQuery = Academician::where(function($query) {
            $query->where('has_embedding', false)
                ->orWhereNull('has_embedding')
                ->orWhereNull('embedding_updated_at');
        });
        
        // Add complete profile filters if requested
        if ($completeOnly) {
            $baseQuery->whereNotNull('research_expertise')
                ->whereNotNull('field_of_study')
                ->whereNotNull('academician_id')
                ->where('profile_picture', '!=', 'profile_pictures/default.jpg')
                ->where(function($q) {
                    $q->where('research_expertise', '!=', '[]')
                      ->where('research_expertise', '!=', 'null')
                      ->whereNotNull('research_expertise');
                });
        }
        
        // Process in chunks to avoid memory issues
        $baseQuery->orderBy('verified', 'desc') // Prioritize verified academics
            ->orderBy('availability_as_supervisor', 'desc') // Prioritize available supervisors
            ->chunk($batchSize, function($academicians) use (&$processedCount, &$failedCount, &$skippedCount, $progressBar, $completeOnly) {
                foreach ($academicians as $academician) {
                    // Skip if complete profile is required but missing
                    if ($completeOnly && !$this->hasCompleteProfile($academician)) {
                        $skippedCount++;
                        $progressBar->advance();
                        continue;
                    }
                    
                    $result = $this->processAcademician($academician);
                    
                    if ($result) {
                        $processedCount++;
                    } else {
                        $failedCount++;
                    }
                    
                    $progressBar->advance();
                }
            });
        
        $progressBar->finish();
        $this->newLine();
        
        $this->info("Completed embedding generation: {$processedCount} successful, {$failedCount} failed" . 
                    ($skippedCount > 0 ? ", {$skippedCount} skipped (incomplete profiles)" : ""));
    }
    
    /**
     * Process a single academician record
     */
    protected function processAcademician(Academician $academician): bool
    {
        try {
            // If checking for complete profiles, make sure the academician has required fields
            if (!$this->hasMinimumRequiredFields($academician)) {
                Log::warning("Skipping embedding generation for academician {$academician->id}: Missing minimum required fields");
                return false;
            }
            
            // Generate embedding
            $embedding = $this->embeddingService->generateAcademicianEmbedding($academician);
            
            if (!$embedding) {
                $this->error("Failed to generate embedding for academician {$academician->id}");
                return false;
            }
            
            // Store only in MySQL
            $academician->embedding_vector = $embedding;
            $academician->has_embedding = true;
            $academician->embedding_updated_at = now();
            $academician->save();
            
            return true;
        } catch (\Exception $e) {
            Log::error("Error generating embedding for academician {$academician->id}: " . $e->getMessage());
            $this->error("Error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Check if an academician has all fields for a complete profile
     */
    protected function hasCompleteProfile(Academician $academician): bool
    {
        return !empty($academician->research_expertise) &&
               !empty($academician->field_of_study) &&
               !empty($academician->academician_id) &&
               $academician->profile_picture !== 'profile_pictures/default.jpg' &&
               $academician->research_expertise !== '[]' &&
               $academician->research_expertise !== 'null';
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
