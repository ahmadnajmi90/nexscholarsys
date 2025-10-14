<?php

namespace App\Console\Commands;

use App\Models\Academician;
use App\Services\EmbeddingService;
use App\Services\QdrantService;
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
    protected $qdrantService;

    /**
     * Create a new command instance.
     */
    public function __construct(EmbeddingService $embeddingService, QdrantService $qdrantService)
    {
        parent::__construct();
        $this->embeddingService = $embeddingService;
        $this->qdrantService = $qdrantService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Ensure Qdrant collection exists before starting
        $this->info('Ensuring Qdrant collection exists...');
        $collectionName = config('services.qdrant.academicians_collection', 'nexscholar_academicians');
        
        if (!$this->qdrantService->createCollection($collectionName)) {
            $this->error("Failed to create or verify Qdrant collection: {$collectionName}. Aborting.");
            return Command::FAILURE;
        }
        
        $this->info("✅ Qdrant collection '{$collectionName}' is ready.");
        
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
        
        if (!$force && $academician->qdrant_migrated && $academician->qdrant_migrated_at && $academician->qdrant_migrated_at->isAfter(now()->subMonth())) {
            $this->info("Academician already has a recent embedding in Qdrant. Use --force to regenerate.");
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
            // Reset migration flags for force regeneration
            Academician::query()->update(['qdrant_migrated' => false, 'qdrant_migrated_at' => null]);
            $this->info("Marked all academicians for embedding regeneration");
        }
        
        // Get count of academicians needing embedding
        $query = Academician::where(function($query) {
            $query->where('qdrant_migrated', false)
                ->orWhereNull('qdrant_migrated')
                ->orWhereNull('qdrant_migrated_at')
                ->orWhere('qdrant_migrated_at', '<', now()->subMonth());
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
        
        // Ask for confirmation if it's a large number (but skip if in non-interactive mode)
        if ($count > 100 && $this->input->isInteractive() && !$this->confirm("This will process {$count} academicians. Continue?")) {
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
            $query->where('qdrant_migrated', false)
                ->orWhereNull('qdrant_migrated')
                ->orWhereNull('qdrant_migrated_at')
                ->orWhere('qdrant_migrated_at', '<', now()->subMonth());
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
            
            // Store directly in Qdrant only
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
                $embedding,
                $payload
            );
            
            if ($result) {
                // Update only the Qdrant status in MySQL
                $academician->qdrant_migrated = true;
                $academician->qdrant_migrated_at = now();
                $academician->save();
                
                Log::info("Successfully stored embedding in Qdrant for academician {$academician->id}");
                return true;
            } else {
                Log::error("Failed to store embedding in Qdrant for academician {$academician->id}");
                return false;
            }
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
