<?php

namespace App\Console\Commands;

use App\Models\Postgraduate;
use App\Models\Undergraduate;
use App\Services\EmbeddingService;
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
     * Process a specific student
     */
    public function processSpecificStudent($studentId, $type, $force)
    {
        $processed = false;
        
        if ($type === 'postgraduate' || $type === 'both') {
            $student = Postgraduate::find($studentId);
            if ($student) {
                $processed = true;
                $this->processPostgraduate($student, $force);
            }
        }
        
        if ($type === 'undergraduate' || $type === 'both') {
            $student = Undergraduate::find($studentId);
            if ($student) {
                $processed = true;
                $this->processUndergraduate($student, $force);
            }
        }
        
        if (!$processed) {
            $this->error("Student with ID {$studentId} not found for specified type(s)");
        }
    }
    
    /**
     * Process all students
     */
    public function processAllStudents($type, $force, $batchSize)
    {
        if ($type === 'postgraduate' || $type === 'both') {
            $this->info('Processing postgraduates...');
            $this->processAllPostgraduates($force, $batchSize);
        }
        
        if ($type === 'undergraduate' || $type === 'both') {
            $this->info('Processing undergraduates...');
            $this->processAllUndergraduates($force, $batchSize);
        }
    }
    
    /**
     * Process all postgraduates
     */
    private function processAllPostgraduates($force, $batchSize)
    {
        if ($force) {
            // For force, mark all as needing regeneration
            Postgraduate::query()->update(['has_embedding' => false]);
            $this->info("Marked all postgraduates for embedding regeneration");
        }
        
        // Get count of postgraduates needing embedding
        $query = Postgraduate::where(function($query) {
            $query->where('has_embedding', false)
                ->orWhereNull('has_embedding')
                ->orWhereNull('embedding_updated_at');
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
            $query->where('has_embedding', false)
                ->orWhereNull('has_embedding')
                ->orWhereNull('embedding_updated_at');
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
        
        $this->info("Completed postgraduate embedding generation: {$processedCount} successful, {$skipCount} skipped (no research data), {$failedCount} failed");
    }
    
    /**
     * Process all undergraduates
     */
    private function processAllUndergraduates($force, $batchSize)
    {
        if ($force) {
            // For force, mark all as needing regeneration
            Undergraduate::query()->update(['has_embedding' => false]);
            $this->info("Marked all undergraduates for embedding regeneration");
        }
        
        // Get count of undergraduates needing embedding
        $query = Undergraduate::where(function($query) {
            $query->where('has_embedding', false)
                ->orWhereNull('has_embedding')
                ->orWhereNull('embedding_updated_at');
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
            $query->where('has_embedding', false)
                ->orWhereNull('has_embedding')
                ->orWhereNull('embedding_updated_at');
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
        
        $this->info("Completed undergraduate embedding generation: {$processedCount} successful, {$skipCount} skipped (no research data), {$failedCount} failed");
    }
    
    /**
     * Process a single postgraduate record
     * 
     * @return bool|null True if successful, false if error, null if skipped
     */
    protected function processPostgraduate(Postgraduate $postgraduate, $force = false, $verbose = true): ?bool
    {
        try {
            if ($postgraduate->has_embedding && !$force) {
                if ($verbose) {
                    $this->info("Postgraduate already has an embedding. Use --force to regenerate.");
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
                $postgraduate->has_embedding = false;
                $postgraduate->embedding_updated_at = now();
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
            
            // Store embedding
            $postgraduate->research_embedding = $embedding;
            $postgraduate->has_embedding = true;
            $postgraduate->embedding_updated_at = now();
            $postgraduate->save();
            
            if ($verbose) {
                $this->info("Successfully generated embedding for postgraduate ID {$postgraduate->id}");
            }
            
            return true;
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
     * @return bool|null True if successful, false if error, null if skipped
     */
    protected function processUndergraduate(Undergraduate $undergraduate, $force = false, $verbose = true): ?bool
    {
        try {
            if ($undergraduate->has_embedding && !$force) {
                if ($verbose) {
                    $this->info("Undergraduate already has an embedding. Use --force to regenerate.");
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
                $undergraduate->has_embedding = false;
                $undergraduate->embedding_updated_at = now();
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
            
            // Store embedding
            $undergraduate->research_embedding = $embedding;
            $undergraduate->has_embedding = true;
            $undergraduate->embedding_updated_at = now();
            $undergraduate->save();
            
            if ($verbose) {
                $this->info("Successfully generated embedding for undergraduate ID {$undergraduate->id}");
            }
            
            return true;
        } catch (\Exception $e) {
            Log::error("Error generating embedding for undergraduate {$undergraduate->id}: " . $e->getMessage());
            if ($verbose) {
                $this->error("Error: " . $e->getMessage());
            }
            return false;
        }
    }
} 