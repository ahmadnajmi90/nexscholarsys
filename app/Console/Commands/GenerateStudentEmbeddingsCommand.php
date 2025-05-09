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
                            {--batch-size=20 : Number of students to process per batch}';

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
        $studentId = $this->argument('student_id');
        $type = $this->option('type');
        $force = $this->option('force');
        $batchSize = (int)$this->option('batch-size');
        
        if (!in_array($type, ['postgraduate', 'undergraduate', 'both'])) {
            $this->error("Invalid type. Use 'postgraduate', 'undergraduate', or 'both'.");
            return Command::FAILURE;
        }
        
        if ($studentId) {
            $this->processSpecificStudent($studentId, $type, $force);
        } else {
            $this->processAllStudents($type, $force, $batchSize);
        }
        
        return Command::SUCCESS;
    }
    
    /**
     * Process a specific student by ID
     */
    protected function processSpecificStudent($studentId, $type, $force)
    {
        if ($type === 'postgraduate' || $type === 'both') {
            $postgraduate = Postgraduate::find($studentId);
            if ($postgraduate) {
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
            $undergraduate = Undergraduate::find($studentId);
            if ($undergraduate) {
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
    protected function processAllStudents($type, $force, $batchSize)
    {
        if ($type === 'postgraduate' || $type === 'both') {
            $this->processAllPostgraduates($force, $batchSize);
        }
        
        if ($type === 'undergraduate' || $type === 'both') {
            $this->processAllUndergraduates($force, $batchSize);
        }
    }
    
    /**
     * Process all postgraduates
     */
    protected function processAllPostgraduates($force, $batchSize)
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
        
        $count = $query->count();
        
        if ($count === 0) {
            $this->info("No postgraduates need embedding generation. Use --force to regenerate all.");
            return;
        }
        
        $this->info("Found {$count} postgraduates needing embeddings");
        
        // Process postgraduates in chunks
        $processedCount = 0;
        $failedCount = 0;
        $skipCount = 0;
        
        $progressBar = $this->output->createProgressBar($count);
        $progressBar->start();
        
        // Process in chunks to avoid memory issues
        Postgraduate::where(function($query) {
            $query->where('qdrant_migrated', false)
                ->orWhereNull('qdrant_migrated')
                ->orWhereNull('qdrant_migrated_at')
                ->orWhere('qdrant_migrated_at', '<', now()->subMonth());
        })
        ->chunk($batchSize, function($postgraduates) use (&$processedCount, &$failedCount, &$skipCount, $progressBar) {
            foreach ($postgraduates as $postgraduate) {
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
    protected function processAllUndergraduates($force, $batchSize)
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
        
        $count = $query->count();
        
        if ($count === 0) {
            $this->info("No undergraduates need embedding generation. Use --force to regenerate all.");
            return;
        }
        
        $this->info("Found {$count} undergraduates needing embeddings");
        
        // Process undergraduates in chunks
        $processedCount = 0;
        $failedCount = 0;
        $skipCount = 0;
        
        $progressBar = $this->output->createProgressBar($count);
        $progressBar->start();
        
        // Process in chunks to avoid memory issues
        Undergraduate::where(function($query) {
            $query->where('qdrant_migrated', false)
                ->orWhereNull('qdrant_migrated')
                ->orWhereNull('qdrant_migrated_at')
                ->orWhere('qdrant_migrated_at', '<', now()->subMonth());
        })
        ->chunk($batchSize, function($undergraduates) use (&$processedCount, &$failedCount, &$skipCount, $progressBar) {
            foreach ($undergraduates as $undergraduate) {
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
                'postgraduate',
                $postgraduate->id,
                $postgraduate->id,
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
                'undergraduate',
                $undergraduate->id,
                $undergraduate->id,
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
} 