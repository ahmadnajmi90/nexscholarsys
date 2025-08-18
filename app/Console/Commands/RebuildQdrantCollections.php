<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\QdrantService;

class RebuildQdrantCollections extends Command
{
    protected $signature = 'qdrant:rebuild-collections {--force : Force rebuild without confirmation}';
    protected $description = 'Delete and rebuild Qdrant collections with new standardized schema';

    public function handle(QdrantService $qdrantService)
    {
        $this->info('🚀 Starting Qdrant collections rebuild with new standardized schema...');
        $this->newLine();

        // Check if force flag is set
        if (!$this->option('force')) {
            if (!$this->confirm('This will DELETE ALL existing Qdrant data and rebuild from scratch. Are you sure?')) {
                $this->info('Operation cancelled.');
                return 0;
            }
        }

        $collections = [
            config('services.qdrant.academicians_collection', 'nexscholar_academicians'),
            config('services.qdrant.students_collection', 'nexscholar_students'),
            config('services.qdrant.postgraduate_programs_collection', 'nexscholar_postgraduate_programs'),
        ];

        $this->info('🗑️  Step 1: Deleting existing collections...');
        foreach ($collections as $collection) {
            $this->line("Deleting collection: {$collection}");
            if ($qdrantService->deleteCollection($collection)) {
                $this->info("✅ Successfully deleted {$collection}");
            } else {
                $this->warn("⚠️  Failed to delete {$collection} (may not exist)");
            }
        }

        $this->newLine();
        $this->info('🔧 Step 2: Setting up new indexes...');
        $this->call('qdrant:setup-indexes');

        $this->newLine();
        $this->info('📊 Step 3: Generating embeddings...');
        
        $this->line('Generating academician embeddings...');
        $this->call('embeddings:generate-academician', ['--force' => true]);
        
        $this->line('Generating student embeddings...');
        $this->call('embeddings:generate-student', ['--force' => true]);
        
        $this->line('Generating program embeddings...');
        $this->call('embeddings:generate-postgraduate-programs');

        $this->newLine();
        $this->info('✅ Qdrant collections rebuild complete!');
        $this->info('The new standardized schema is now active with:');
        $this->line('  • unique_id (ACAD-XYZ, PG-XYZ, UG-XYZ strings)');
        $this->line('  • user_id (main users.id)');
        $this->line('  • mysql_id (table-specific IDs)');
        $this->line('  • record_type (academician, student, program)');

        return 0;
    }
} 