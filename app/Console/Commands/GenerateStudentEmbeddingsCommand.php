<?php

namespace App\Console\Commands;

use App\Models\Postgraduate;
use App\Models\Undergraduate;
use App\Services\EmbeddingService;
use App\Services\QdrantService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GenerateStudentEmbeddingsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'embeddings:generate-student 
                            {student_id? : The ID of a specific student} 
                            {--type=both : Type of student (postgraduate, undergraduate, or both)} 
                            {--force : Force regeneration even if already embedded} 
                            {--batch-size=20 : Number of students to process per batch}
                            {--complete-only : Only process students with complete research profiles}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate embeddings for students (postgraduates and undergraduates) for semantic search';

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
        $collectionName = config('services.qdrant.students_collection', 'nexscholar_students');
        
        if (!$this->qdrantService->createCollection($collectionName)) {
            $this->error("Failed to create or verify Qdrant collection: {$collectionName}. Aborting.");
            return Command::FAILURE;
        }
        
        $this->info("✅ Qdrant collection '{$collectionName}' is ready.");
        
        $studentId = $this->argument('student_id');
        $type = $this->option('type');
        $force = $this->option('force');
        $batchSize = (int)$this->option('batch-size');
        $completeOnly = $this->option('complete-only');
        
        if (!in_array($type, ['postgraduate', 'undergraduate', 'both'])) {
            $this->error("Invalid type. Use 'postgraduate', 'undergraduate', or 'both'.");
            return Command::FAILURE;
        }
        
        if ($studentId) {
            $this->processSpecificStudent($studentId, $type, $force, $completeOnly);
        } else {
            $this->processAllStudents($type, $force, $batchSize, $completeOnly);
        }
        
        return Command::SUCCESS;
    }
    
    /**
     * Process a specific student by ID
     */
    protected function processSpecificStudent($studentId, $type, $force, $completeOnly = false)
    {
        if ($type === 'postgraduate' || $type === 'both') {
            $postgraduate = Postgraduate::with('user')->find($studentId);
            if ($postgraduate) {
                // Check if complete profile is required
                if ($completeOnly && !$this->hasCompletePostgraduateProfile($postgraduate)) {
                    $this->warn("Postgraduate {$postgraduate->full_name} (ID: {$studentId}) has an incomplete profile. Skipping.");
                    return;
                }
                
                $this->info("Processing postgraduate: {$postgraduate->full_name}");
                $result = $this->processPostgraduate($postgraduate, $force, true);
                if ($result === true) {
                    $this->info("Successfully generated embedding for postgraduate ID {$studentId}");
                } elseif ($result === null) {
                    $this->warn("Skipped postgraduate ID {$studentId}: No research data available");
                } else {
                    $this->error("Failed to generate embedding for postgraduate ID {$studentId}");
                }
            } else if ($type === 'postgraduate') {
                $this->error("Postgraduate with ID {$studentId} not found");
            }
        }
        
        if ($type === 'undergraduate' || $type === 'both') {
            $undergraduate = Undergraduate::with('user')->find($studentId);
            if ($undergraduate) {
                // Check if complete profile is required
                if ($completeOnly && !$this->hasCompleteUndergraduateProfile($undergraduate)) {
                    $this->warn("Undergraduate {$undergraduate->full_name} (ID: {$studentId}) has an incomplete profile. Skipping.");
                    return;
                }
                
                $this->info("Processing undergraduate: {$undergraduate->full_name}");
                $result = $this->processUndergraduate($undergraduate, $force, true);
                if ($result === true) {
                    $this->info("Successfully generated embedding for undergraduate ID {$studentId}");
                } elseif ($result === null) {
                    $this->warn("Skipped undergraduate ID {$studentId}: No research preference data available");
                } else {
                    $this->error("Failed to generate embedding for undergraduate ID {$studentId}");
                }
            } else if ($type === 'undergraduate') {
                $this->error("Undergraduate with ID {$studentId} not found");
            }
        }
    }
    
    /**
     * Process all students of the specified type
     */
    protected function processAllStudents($type, $force, $batchSize, $completeOnly = false)
    {
        if ($type === 'postgraduate' || $type === 'both') {
            $this->processAllPostgraduates($force, $batchSize, $completeOnly);
        }
        
        if ($type === 'undergraduate' || $type === 'both') {
            $this->processAllUndergraduates($force, $batchSize, $completeOnly);
        }
    }
    
    /**
     * Process all postgraduates
     */
    protected function processAllPostgraduates($force, $batchSize, $completeOnly = false)
    {
        if ($force) {
            // Reset migration flags for force regeneration
            Postgraduate::query()->update(['qdrant_migrated' => false, 'qdrant_migrated_at' => null]);
            $this->info("Marked all postgraduates for embedding regeneration");
        }
        
        // Get count of postgraduates needing embedding
        $query = Postgraduate::where(function($query) {
            $query->where('qdrant_migrated', false)
                ->orWhereNull('qdrant_migrated')
                ->orWhereNull('qdrant_migrated_at')
                ->orWhere('qdrant_migrated_at', '<', now()->subMonth());
        });
        
        // Add complete profile filters if requested
        if ($completeOnly) {
            $query->whereNotNull('field_of_research');
            $this->info("Filtering for postgraduates with complete research profiles only");
        }
        
        $count = $query->count();
        
        if ($count === 0) {
            $this->info($completeOnly 
                ? "No postgraduates with complete research profiles need embedding generation. Use --force to regenerate all." 
                : "No postgraduates need embedding generation. Use --force to regenerate all.");
            return;
        }
        
        $this->info("Found {$count} postgraduates needing embeddings");
        
        // Process postgraduates in chunks
        $processedCount = 0;
        $failedCount = 0;
        $skipCount = 0;
        
        $progressBar = $this->output->createProgressBar($count);
        $progressBar->start();
        
        // Build the base query
        $baseQuery = Postgraduate::where(function($query) {
            $query->where('qdrant_migrated', false)
                ->orWhereNull('qdrant_migrated')
                ->orWhereNull('qdrant_migrated_at')
                ->orWhere('qdrant_migrated_at', '<', now()->subMonth());
        });
        
        // Add complete profile filters if requested
        if ($completeOnly) {
            $baseQuery->whereNotNull('field_of_research');
        }
        
        // Process in chunks to avoid memory issues
        $baseQuery->with('user')->chunk($batchSize, function($postgraduates) use (&$processedCount, &$failedCount, &$skipCount, $progressBar, $completeOnly) {
            foreach ($postgraduates as $postgraduate) {
                // Skip if complete profile is required but missing
                if ($completeOnly && !$this->hasCompletePostgraduateProfile($postgraduate)) {
                    $skipCount++;
                    $progressBar->advance();
                    continue;
                }
                
                $result = $this->processPostgraduate($postgraduate, false, false);
                
                if ($result === true) {
                    $processedCount++;
                } elseif ($result === false) {
                    $failedCount++;
                } else { // null = skipped due to no research data
                    $skipCount++;
                }
                
                $progressBar->advance();
            }
        });
        
        $progressBar->finish();
        $this->newLine();
        
        $this->info("Completed postgraduate embedding generation: {$processedCount} successful, {$failedCount} failed, {$skipCount} skipped (no research data)");
    }
    
    /**
     * Process all undergraduates
     */
    protected function processAllUndergraduates($force, $batchSize, $completeOnly = false)
    {
        if ($force) {
            // Reset migration flags for force regeneration
            Undergraduate::query()->update(['qdrant_migrated' => false, 'qdrant_migrated_at' => null]);
            $this->info("Marked all undergraduates for embedding regeneration");
        }
        
        // Get count of undergraduates needing embedding
        $query = Undergraduate::where(function($query) {
            $query->where('qdrant_migrated', false)
                ->orWhereNull('qdrant_migrated')
                ->orWhereNull('qdrant_migrated_at')
                ->orWhere('qdrant_migrated_at', '<', now()->subMonth());
        });
        
        // Add complete profile filters if requested
        if ($completeOnly) {
            $query->whereNotNull('research_preference');
            $this->info("Filtering for undergraduates with complete research profiles only");
        }
        
        $count = $query->count();
        
        if ($count === 0) {
            $this->info($completeOnly 
                ? "No undergraduates with complete research profiles need embedding generation. Use --force to regenerate all." 
                : "No undergraduates need embedding generation. Use --force to regenerate all.");
            return;
        }
        
        $this->info("Found {$count} undergraduates needing embeddings");
        
        // Process undergraduates in chunks
        $processedCount = 0;
        $failedCount = 0;
        $skipCount = 0;
        
        $progressBar = $this->output->createProgressBar($count);
        $progressBar->start();
        
        // Build the base query
        $baseQuery = Undergraduate::where(function($query) {
            $query->where('qdrant_migrated', false)
                ->orWhereNull('qdrant_migrated')
                ->orWhereNull('qdrant_migrated_at')
                ->orWhere('qdrant_migrated_at', '<', now()->subMonth());
        });
        
        // Add complete profile filters if requested
        if ($completeOnly) {
            $baseQuery->whereNotNull('research_preference');
        }
        
        // Process in chunks to avoid memory issues
        $baseQuery->with('user')->chunk($batchSize, function($undergraduates) use (&$processedCount, &$failedCount, &$skipCount, $progressBar, $completeOnly) {
            foreach ($undergraduates as $undergraduate) {
                // Skip if complete profile is required but missing
                if ($completeOnly && !$this->hasCompleteUndergraduateProfile($undergraduate)) {
                    $skipCount++;
                    $progressBar->advance();
                    continue;
                }
                
                $result = $this->processUndergraduate($undergraduate, false, false);
                
                if ($result === true) {
                    $processedCount++;
                } elseif ($result === false) {
                    $failedCount++;
                } else { // null = skipped due to no research data
                    $skipCount++;
                }
                
                $progressBar->advance();
            }
        });
        
        $progressBar->finish();
        $this->newLine();
        
        $this->info("Completed undergraduate embedding generation: {$processedCount} successful, {$failedCount} failed, {$skipCount} skipped (no research data)");
    }
    
    /**
     * Process a single postgraduate record
     * 
     * @return bool|null True if successful, false if failed, null if skipped
     */
    protected function processPostgraduate(Postgraduate $postgraduate, $force = false, $verbose = false)
    {
        try {
            if (!$force && $postgraduate->qdrant_migrated && $postgraduate->qdrant_migrated_at && $postgraduate->qdrant_migrated_at->isAfter(now()->subMonth())) {
                if ($verbose) {
                    $this->info("Postgraduate already has a recent embedding in Qdrant. Use --force to regenerate.");
                }
                return true;
            }
            
            // Skip if no field_of_research data
            if (empty($postgraduate->field_of_research) || 
                (is_array($postgraduate->field_of_research) && count($postgraduate->field_of_research) === 0)) {
                
                Log::info("Skipping embedding generation for postgraduate {$postgraduate->id}: No field_of_research data");
                if ($verbose) {
                    $this->warn("Skipping postgraduate {$postgraduate->id}: No field_of_research data");
                }
                
                // Mark as processed but no embedding
                $postgraduate->qdrant_migrated = false;
                $postgraduate->qdrant_migrated_at = now();
                $postgraduate->save();
                
                return null; // Skipped
            }
            
            if ($verbose) {
                $this->info("Generating embedding for postgraduate: {$postgraduate->full_name}");
            }
            
            // Generate embedding
            $embedding = $this->embeddingService->generatePostgraduateEmbedding($postgraduate);
            
            if (!$embedding) {
                if ($verbose) {
                    $this->error("Failed to generate embedding for postgraduate {$postgraduate->id}");
                }
                return false;
            }
            
            // Prepare additional payload
            $payload = [
                'full_name' => $postgraduate->full_name,
                'has_embedding' => true
            ];
            
            // Add additional payload fields if available
            if (!empty($postgraduate->university_id)) {
                $payload['university_id'] = $postgraduate->university_id;
            }
            
            if (!empty($postgraduate->faculty_id)) {
                $payload['faculty_id'] = $postgraduate->faculty_id;
            }
            
            // Upsert to Qdrant
            $result = $this->qdrantService->upsertStudentEmbedding(
                $postgraduate,
                $embedding,
                $payload
            );
            
            if ($result) {
                // Update only the Qdrant status in MySQL
                $postgraduate->qdrant_migrated = true;
                $postgraduate->qdrant_migrated_at = now();
                $postgraduate->save();
                
                Log::info("Successfully stored embedding in Qdrant for postgraduate {$postgraduate->id}");
                
                if ($verbose) {
                    $this->info("Successfully generated embedding for postgraduate ID {$postgraduate->id}");
                }
                
                return true;
            } else {
                Log::error("Failed to store embedding in Qdrant for postgraduate {$postgraduate->id}");
                return false;
            }
            
        } catch (\Exception $e) {
            Log::error("Error generating embedding for postgraduate {$postgraduate->id}: " . $e->getMessage());
            if ($verbose) {
                $this->error("Error: " . $e->getMessage());
            }
            return false;
        }
    }
    
    /**
     * Process a single undergraduate record
     * 
     * @return bool|null True if successful, false if failed, null if skipped
     */
    protected function processUndergraduate(Undergraduate $undergraduate, $force = false, $verbose = false)
    {
        try {
            if (!$force && $undergraduate->qdrant_migrated && $undergraduate->qdrant_migrated_at && $undergraduate->qdrant_migrated_at->isAfter(now()->subMonth())) {
                if ($verbose) {
                    $this->info("Undergraduate already has a recent embedding in Qdrant. Use --force to regenerate.");
                }
                return true;
            }
            
            // Skip if no research_preference data
            if (empty($undergraduate->research_preference) || 
                (is_array($undergraduate->research_preference) && count($undergraduate->research_preference) === 0)) {
                
                Log::info("Skipping embedding generation for undergraduate {$undergraduate->id}: No research_preference data");
                if ($verbose) {
                    $this->warn("Skipping undergraduate {$undergraduate->id}: No research_preference data");
                }
                
                // Mark as processed but no embedding
                $undergraduate->qdrant_migrated = false;
                $undergraduate->qdrant_migrated_at = now();
                $undergraduate->save();
                
                return null; // Skipped
            }
            
            if ($verbose) {
                $this->info("Generating embedding for undergraduate: {$undergraduate->full_name}");
            }
            
            // Generate embedding
            $embedding = $this->embeddingService->generateUndergraduateEmbedding($undergraduate);
            
            if (!$embedding) {
                if ($verbose) {
                    $this->error("Failed to generate embedding for undergraduate {$undergraduate->id}");
                }
                return false;
            }
            
            // Prepare additional payload
            $payload = [
                'full_name' => $undergraduate->full_name,
                'has_embedding' => true
            ];
            
            // Add additional payload fields if available
            if (!empty($undergraduate->university_id)) {
                $payload['university_id'] = $undergraduate->university_id;
            }
            
            if (!empty($undergraduate->faculty_id)) {
                $payload['faculty_id'] = $undergraduate->faculty_id;
            }
            
            // Upsert to Qdrant
            $result = $this->qdrantService->upsertStudentEmbedding(
                $undergraduate,
                $embedding,
                $payload
            );
            
            if ($result) {
                // Update only the Qdrant status in MySQL
                $undergraduate->qdrant_migrated = true;
                $undergraduate->qdrant_migrated_at = now();
                $undergraduate->save();
                
                Log::info("Successfully stored embedding in Qdrant for undergraduate {$undergraduate->id}");
                
                if ($verbose) {
                    $this->info("Successfully generated embedding for undergraduate ID {$undergraduate->id}");
                }
                
                return true;
            } else {
                Log::error("Failed to store embedding in Qdrant for undergraduate {$undergraduate->id}");
                return false;
            }
            
        } catch (\Exception $e) {
            Log::error("Error generating embedding for undergraduate {$undergraduate->id}: " . $e->getMessage());
            if ($verbose) {
                $this->error("Error: " . $e->getMessage());
            }
            return false;
        }
    }
    
    /**
     * Check if a postgraduate has a complete research profile
     */
    protected function hasCompletePostgraduateProfile(Postgraduate $postgraduate): bool
    {
        return !empty($postgraduate->field_of_research) &&
               (is_array($postgraduate->field_of_research) ? count($postgraduate->field_of_research) > 0 : true);
    }
    
    /**
     * Check if an undergraduate has a complete research profile
     */
    protected function hasCompleteUndergraduateProfile(Undergraduate $undergraduate): bool
    {
        return !empty($undergraduate->research_preference) &&
               (is_array($undergraduate->research_preference) ? count($undergraduate->research_preference) > 0 : true);
    }
} 