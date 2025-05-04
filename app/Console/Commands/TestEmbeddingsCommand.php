<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\EmbeddingService;

class TestEmbeddingsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:embeddings {text? : The text to generate an embedding for}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the embeddings service with OpenAI API';

    /**
     * Execute the console command.
     */
    public function handle(EmbeddingService $embeddingService): void
    {
        $text = $this->argument('text') ?? 'This is a test of the OpenAI embeddings API using the direct API key from Laravel';
        
        $this->info("Generating embedding for text: " . $text);
        
        $embedding = $embeddingService->generateEmbedding($text);
        
        if ($embedding) {
            $this->info("✓ Success! Embedding generated with " . count($embedding) . " dimensions.");
            $this->info("Sample of embedding vector: [" . 
                implode(', ', array_slice($embedding, 0, 5)) . 
                " ... ]");
        } else {
            $this->error("✗ Failed to generate embedding");
            $this->line("Check the Laravel log for more details.");
        }
    }
} 