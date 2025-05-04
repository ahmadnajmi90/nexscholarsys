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
    protected $signature = 'embeddings:generate-academician {academician_id? : The ID of a specific academician} {--force : Force regeneration even if already embedded} {--batch-size=20 : Number of academicians to process per batch}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate embeddings for academicians for semantic search';

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
        
        if ($academicianId) {
            $this->processSpecificAcademician($academicianId, $force);
        } else {
            $this->processAllAcademicians($force, $batchSize);
        }
        
        return Command::SUCCESS;
    }
    
    /**
     * Process a specific academician
     */
    private function processSpecificAcademician($academicianId, $force)
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
    private function processAllAcademicians($force, $batchSize)
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
        
        $count = $query->count();
        
        if ($count === 0) {
            $this->info("No academicians need embedding generation. Use --force to regenerate all.");
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
        
        $progressBar = $this->output->createProgressBar($count);
        $progressBar->start();
        
        // Process in chunks to avoid memory issues
        Academician::where(function($query) {
            $query->where('has_embedding', false)
                ->orWhereNull('has_embedding')
                ->orWhereNull('embedding_updated_at');
        })
        ->orderBy('verified', 'desc') // Prioritize verified academics
        ->orderBy('availability_as_supervisor', 'desc') // Prioritize available supervisors
        ->chunk($batchSize, function($academicians) use (&$processedCount, &$failedCount, $progressBar) {
            foreach ($academicians as $academician) {
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
        
        $this->info("Completed embedding generation: {$processedCount} successful, {$failedCount} failed");
    }
    
    /**
     * Process a single academician record
     */
    protected function processAcademician(Academician $academician): bool
    {
        try {
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
}
