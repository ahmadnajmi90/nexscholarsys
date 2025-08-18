<?php

namespace App\Console\Commands;

use App\Services\QdrantService;
use Illuminate\Console\Command;

class QdrantTestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'qdrant:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Qdrant vector operations with UUID format';

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
        $this->info('Testing Qdrant vector operations with UUID format...');
        
        // Create a test vector (normalized random values)
        $vector = $this->generateRandomVector((int)config('services.qdrant.vector_size', 1536));
        
        // Test string ID that previously failed
        $testId = 'ACAD-test123';
        $collection = config('services.qdrant.academicians_collection', 'nexscholar_academicians');
        
        // Payload data
        $payload = [
            'mysql_id' => 1,
            'name' => 'Test Academician',
            'test' => true
        ];
        
        $this->info("Attempting to upsert vector with ID: {$testId}");
        
        // Attempt upsert
        $result = $this->qdrantService->upsertVector($collection, $testId, $vector, $payload);
        
        if ($result) {
            $this->info('✓ Successfully upserted vector with UUID conversion');
        } else {
            $this->error('× Failed to upsert vector');
            return Command::FAILURE;
        }
        
        $this->info("Testing search functionality...");
        
        // Search using the same vector (should find the exact match with high score)
        $searchResults = $this->qdrantService->searchVectors($collection, $vector, 5, 0.1);
        
        if (empty($searchResults)) {
            $this->error('× No search results found');
            return Command::FAILURE;
        }
        
        $this->info("✓ Found " . count($searchResults) . " search results");
        
        // Print first result details
        $this->info("Top match details:");
        foreach ($searchResults as $index => $result) {
            $uniqueId = $result['payload']['unique_id'] ?? $result['payload']['original_id'] ?? 'unknown';
            $score = $result['score'] ?? 0;
            $this->info("Result #{$index}: ID={$uniqueId}, Score={$score}");
            
            if ($index >= 2) break; // Show only top 3 results
        }
        
        $this->info('✓ Qdrant UUID conversion test completed successfully!');
        return Command::SUCCESS;
    }
    
    /**
     * Generate a random normalized vector of the specified size
     *
     * @param int $size The size of the vector
     * @return array The random vector
     */
    protected function generateRandomVector(int $size): array
    {
        // Generate random values
        $vector = [];
        for ($i = 0; $i < $size; $i++) {
            $vector[] = mt_rand(-100, 100) / 100;
        }
        
        // Normalize the vector (convert to unit vector)
        $magnitude = sqrt(array_sum(array_map(function($x) { return $x * $x; }, $vector)));
        
        if ($magnitude > 0) {
            foreach ($vector as &$value) {
                $value = $value / $magnitude;
            }
        }
        
        return $vector;
    }
} 