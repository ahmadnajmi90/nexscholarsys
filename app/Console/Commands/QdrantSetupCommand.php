<?php

namespace App\Console\Commands;

use App\Services\QdrantService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class QdrantSetupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'qdrant:setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set up Qdrant collections for vector search';

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
        $this->info('Setting up Qdrant collections for Nexscholar...');
        
        // Check configuration
        $qdrantUrl = config('services.qdrant.url');
        $apiKey = config('services.qdrant.api_key');
        $vectorSize = config('services.qdrant.vector_size');
        $academiciansCollection = config('services.qdrant.academicians_collection');
        $studentsCollection = config('services.qdrant.students_collection');
        
        $this->info("Qdrant configuration:");
        $this->line("- URL: {$qdrantUrl}");
        $this->line("- API Key: " . (empty($apiKey) ? "Not set" : "Set (hidden)"));
        $this->line("- Vector size: {$vectorSize}");
        $this->line("- Academicians collection: {$academiciansCollection}");
        $this->line("- Students collection: {$studentsCollection}");
        $this->line("");
        
        // Test connection to Qdrant
        $this->info('Testing connection to Qdrant...');
        try {
            $connectionTest = $this->qdrantService->testConnection();
            if ($connectionTest) {
                $this->info("✓ Successfully connected to Qdrant");
            } else {
                $this->error("× Failed to connect to Qdrant");
                $this->line("Please check your configuration and ensure the Qdrant server is running.");
                return Command::FAILURE;
            }
        } catch (\Exception $e) {
            $this->error("× Exception when connecting to Qdrant: " . $e->getMessage());
            $this->line("Please check your configuration and ensure the Qdrant server is running.");
            return Command::FAILURE;
        }
        
        // Create academicians collection
        $this->info('Creating academicians collection...');
        $result = $this->qdrantService->createCollection($academiciansCollection);
        
        if ($result) {
            $this->info("✓ Successfully created or verified collection: {$academiciansCollection}");
        } else {
            $this->error("× Failed to create collection: {$academiciansCollection}");
            return Command::FAILURE;
        }
        
        // Create students collection
        $this->info('Creating students collection...');
        $result = $this->qdrantService->createCollection($studentsCollection);
        
        if ($result) {
            $this->info("✓ Successfully created or verified collection: {$studentsCollection}");
        } else {
            $this->error("× Failed to create collection: {$studentsCollection}");
            return Command::FAILURE;
        }
        
        $this->info('✓ Qdrant collections setup completed successfully!');
        
        // Remind about environment configuration
        $this->line('');
        $this->line('Make sure your .env file contains the following configuration:');
        $this->line('QDRANT_URL=your_qdrant_cloud_cluster_url');
        $this->line('QDRANT_API_KEY=your_qdrant_cloud_api_key');
        
        return Command::SUCCESS;
    }
} 