<?php

namespace App\Console\Commands;

use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use App\Services\QdrantService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class MigrateEmbeddingsToQdrantCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'embeddings:migrate-to-qdrant 
                          {--type=all : The type of embeddings to migrate (all, academicians, postgraduates, undergraduates)}
                          {--batch-size=50 : Number of embeddings to process per batch}
                          {--retry-failed : Retry previously failed migrations}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Migrate existing embeddings from MySQL to Qdrant';

    /**
     * Create a new command instance.
     */
    public function __construct(protected QdrantService $qdrantService)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->option('type');
        $batchSize = (int)$this->option('batch-size');
        $retryFailed = $this->option('retry-failed');

        $this->info('Starting migration of embeddings from MySQL to Qdrant...');
        
        // Process academicians
        if ($type === 'all' || $type === 'academicians') {
            $this->migrateAcademicians($batchSize, $retryFailed);
        }
        
        // Process postgraduates
        if ($type === 'all' || $type === 'postgraduates') {
            $this->migratePostgraduates($batchSize, $retryFailed);
        }
        
        // Process undergraduates
        if ($type === 'all' || $type === 'undergraduates') {
            $this->migrateUndergraduates($batchSize, $retryFailed);
        }
        
        $this->info('Migration process completed!');
        
        return Command::SUCCESS;
    }
    
    /**
     * Migrate academician embeddings to Qdrant
     */
    protected function migrateAcademicians(int $batchSize, bool $retryFailed)
    {
        $this->info('Migrating academician embeddings...');
        
        // Get academicians with embeddings
        $query = Academician::where('has_embedding', true);
        
        // Skip already migrated unless retrying failed
        if (!$retryFailed) {
            $query->where(function($q) {
                $q->whereNull('qdrant_migrated')
                  ->orWhere('qdrant_migrated', false);
            });
        }
        
        $total = $query->count();
        $this->info("Found {$total} academician embeddings to migrate");
        
        if ($total === 0) {
            $this->info('No academician embeddings to migrate. Skipping...');
            return;
        }
        
        $bar = $this->output->createProgressBar($total);
        $bar->start();
        
        $processed = 0;
        $successful = 0;
        $failed = 0;
        
        $query->chunk($batchSize, function($academicians) use (&$processed, &$successful, &$failed, $bar) {
            foreach ($academicians as $academician) {
                $processed++;
                
                // Ensure embedding_vector is an array
                $embeddingVector = $academician->embedding_vector;
                if (is_string($embeddingVector)) {
                    $embeddingVector = json_decode($embeddingVector, true);
                }
                
                if (empty($embeddingVector) || !is_array($embeddingVector)) {
                    Log::warning("Invalid embedding vector for academician ID {$academician->id}");
                    $failed++;
                    $bar->advance();
                    continue;
                }
                
                // Prepare additional payload data
                $payload = [
                    'full_name' => $academician->full_name,
                    'university_id' => $academician->university,
                    'has_embedding' => true
                ];
                
                // Upsert to Qdrant
                $result = $this->qdrantService->upsertAcademicianEmbedding(
                    $academician->academician_id,
                    $academician->id,
                    $embeddingVector,
                    $payload
                );
                
                if ($result) {
                    // Mark as migrated in MySQL
                    $academician->qdrant_migrated = true;
                    $academician->qdrant_migrated_at = now();
                    $academician->save();
                    
                    $successful++;
                } else {
                    $failed++;
                    Log::error("Failed to migrate academician ID {$academician->id} to Qdrant");
                }
                
                $bar->advance();
            }
        });
        
        $bar->finish();
        $this->newLine();
        $this->info("Processed {$processed} academician embeddings: {$successful} successful, {$failed} failed");
    }
    
    /**
     * Migrate postgraduate embeddings to Qdrant
     */
    protected function migratePostgraduates(int $batchSize, bool $retryFailed)
    {
        $this->info('Migrating postgraduate embeddings...');
        
        // Get postgraduates with embeddings
        $query = Postgraduate::where('has_embedding', true);
        
        // Skip already migrated unless retrying failed
        if (!$retryFailed) {
            $query->where(function($q) {
                $q->whereNull('qdrant_migrated')
                  ->orWhere('qdrant_migrated', false);
            });
        }
        
        $total = $query->count();
        $this->info("Found {$total} postgraduate embeddings to migrate");
        
        if ($total === 0) {
            $this->info('No postgraduate embeddings to migrate. Skipping...');
            return;
        }
        
        $bar = $this->output->createProgressBar($total);
        $bar->start();
        
        $processed = 0;
        $successful = 0;
        $failed = 0;
        
        $query->chunk($batchSize, function($postgraduates) use (&$processed, &$successful, &$failed, $bar) {
            foreach ($postgraduates as $postgraduate) {
                $processed++;
                
                // Get embedding from research_embedding field instead of embedding_vector
                $embeddingVector = $postgraduate->research_embedding;
                if (is_string($embeddingVector)) {
                    $embeddingVector = json_decode($embeddingVector, true);
                }
                
                if (empty($embeddingVector) || !is_array($embeddingVector)) {
                    Log::warning("Invalid embedding vector for postgraduate ID {$postgraduate->id}");
                    $failed++;
                    $bar->advance();
                    continue;
                }
                
                // Prepare additional payload data
                $payload = [
                    'user_id' => $postgraduate->user_id ?? $postgraduate->postgraduate_id,
                    'university_id' => $postgraduate->university_id ?? $postgraduate->university,
                    'has_embedding' => true,
                    'full_name' => $postgraduate->full_name
                ];
                
                // Upsert to Qdrant
                $result = $this->qdrantService->upsertStudentEmbedding(
                    'postgraduate',
                    $postgraduate->id,
                    $postgraduate->id,
                    $embeddingVector,
                    $payload
                );
                
                if ($result) {
                    // Mark as migrated in MySQL
                    $postgraduate->qdrant_migrated = true;
                    $postgraduate->qdrant_migrated_at = now();
                    $postgraduate->save();
                    
                    $successful++;
                } else {
                    $failed++;
                    Log::error("Failed to migrate postgraduate ID {$postgraduate->id} to Qdrant");
                }
                
                $bar->advance();
            }
        });
        
        $bar->finish();
        $this->newLine();
        $this->info("Processed {$processed} postgraduate embeddings: {$successful} successful, {$failed} failed");
    }
    
    /**
     * Migrate undergraduate embeddings to Qdrant
     */
    protected function migrateUndergraduates(int $batchSize, bool $retryFailed)
    {
        $this->info('Migrating undergraduate embeddings...');
        
        // Get undergraduates with embeddings
        $query = Undergraduate::where('has_embedding', true);
        
        // Skip already migrated unless retrying failed
        if (!$retryFailed) {
            $query->where(function($q) {
                $q->whereNull('qdrant_migrated')
                  ->orWhere('qdrant_migrated', false);
            });
        }
        
        $total = $query->count();
        $this->info("Found {$total} undergraduate embeddings to migrate");
        
        if ($total === 0) {
            $this->info('No undergraduate embeddings to migrate. Skipping...');
            return;
        }
        
        $bar = $this->output->createProgressBar($total);
        $bar->start();
        
        $processed = 0;
        $successful = 0;
        $failed = 0;
        
        $query->chunk($batchSize, function($undergraduates) use (&$processed, &$successful, &$failed, $bar) {
            foreach ($undergraduates as $undergraduate) {
                $processed++;
                
                // Get embedding from research_embedding field instead of embedding_vector
                $embeddingVector = $undergraduate->research_embedding;
                if (is_string($embeddingVector)) {
                    $embeddingVector = json_decode($embeddingVector, true);
                }
                
                if (empty($embeddingVector) || !is_array($embeddingVector)) {
                    Log::warning("Invalid embedding vector for undergraduate ID {$undergraduate->id}");
                    $failed++;
                    $bar->advance();
                    continue;
                }
                
                // Prepare additional payload data
                $payload = [
                    'user_id' => $undergraduate->user_id ?? $undergraduate->undergraduate_id,
                    'university_id' => $undergraduate->university_id ?? $undergraduate->university,
                    'has_embedding' => true,
                    'full_name' => $undergraduate->full_name
                ];
                
                // Upsert to Qdrant
                $result = $this->qdrantService->upsertStudentEmbedding(
                    'undergraduate',
                    $undergraduate->id,
                    $undergraduate->id,
                    $embeddingVector,
                    $payload
                );
                
                if ($result) {
                    // Mark as migrated in MySQL
                    $undergraduate->qdrant_migrated = true;
                    $undergraduate->qdrant_migrated_at = now();
                    $undergraduate->save();
                    
                    $successful++;
                } else {
                    $failed++;
                    Log::error("Failed to migrate undergraduate ID {$undergraduate->id} to Qdrant");
                }
                
                $bar->advance();
            }
        });
        
        $bar->finish();
        $this->newLine();
        $this->info("Processed {$processed} undergraduate embeddings: {$successful} successful, {$failed} failed");
    }
} 