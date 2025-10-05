<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\QdrantService;

class QdrantSetupIndexes extends Command
{
    protected $signature = 'qdrant:setup-indexes';
    protected $description = 'Create the necessary payload indexes in Qdrant collections';

    public function handle(QdrantService $qdrantService)
    {
        $this->info('Setting up Qdrant payload indexes with new standardized schema...');
        $this->newLine();
        $this->warn('Note: Indexes can only be created after data exists in the collection.');
        $this->warn('If collections are empty, indexes will be created automatically when data is inserted.');
        $this->newLine();

        // For Academicians Collection
        $academicianCollection = config('services.qdrant.academicians_collection');
        $this->info("Setting up indexes for academicians collection: {$academicianCollection}");
        
        if ($qdrantService->createPayloadIndex($academicianCollection, 'unique_id', 'keyword')) {
            $this->info("✅ Index 'unique_id' on '{$academicianCollection}' created successfully.");
        } else {
            $this->warn("⚠️  Index 'unique_id' on '{$academicianCollection}' - will be created when data is inserted.");
        }

        if ($qdrantService->createPayloadIndex($academicianCollection, 'user_id', 'integer')) {
            $this->info("✅ Index 'user_id' on '{$academicianCollection}' created successfully.");
        } else {
            $this->warn("⚠️  Index 'user_id' on '{$academicianCollection}' - will be created when data is inserted.");
        }

        if ($qdrantService->createPayloadIndex($academicianCollection, 'mysql_id', 'integer')) {
            $this->info("✅ Index 'mysql_id' on '{$academicianCollection}' created successfully.");
        } else {
            $this->warn("⚠️  Index 'mysql_id' on '{$academicianCollection}' - will be created when data is inserted.");
        }

        $this->newLine();

        // For Students Collection
        $studentCollection = config('services.qdrant.students_collection');
        $this->info("Setting up indexes for students collection: {$studentCollection}");
        
        if ($qdrantService->createPayloadIndex($studentCollection, 'unique_id', 'keyword')) {
            $this->info("✅ Index 'unique_id' on '{$studentCollection}' created successfully.");
        } else {
            $this->warn("⚠️  Index 'unique_id' on '{$studentCollection}' - will be created when data is inserted.");
        }

        if ($qdrantService->createPayloadIndex($studentCollection, 'user_id', 'integer')) {
            $this->info("✅ Index 'user_id' on '{$studentCollection}' created successfully.");
        } else {
            $this->warn("⚠️  Index 'user_id' on '{$studentCollection}' - will be created when data is inserted.");
        }

        if ($qdrantService->createPayloadIndex($studentCollection, 'mysql_id', 'integer')) {
            $this->info("✅ Index 'mysql_id' on '{$studentCollection}' created successfully.");
        } else {
            $this->warn("⚠️  Index 'mysql_id' on '{$studentCollection}' - will be created when data is inserted.");
        }

        $this->newLine();

        // For Programs Collection
        $programCollection = config('services.qdrant.postgraduate_programs_collection', 'nexscholar_postgraduate_programs');
        $this->info("Setting up indexes for programs collection: {$programCollection}");
        
        if ($qdrantService->createPayloadIndex($programCollection, 'postgraduate_program_id', 'integer')) {
            $this->info("✅ Index 'postgraduate_program_id' on '{$programCollection}' created successfully.");
        } else {
            $this->warn("⚠️  Index 'postgraduate_program_id' on '{$programCollection}' - will be created when data is inserted.");
        }

        if ($qdrantService->createPayloadIndex($programCollection, 'program_type', 'keyword')) {
            $this->info("✅ Index 'program_type' on '{$programCollection}' created successfully.");
        } else {
            $this->warn("⚠️  Index 'program_type' on '{$programCollection}' - will be created when data is inserted.");
        }

        $this->info('Qdrant payload indexes setup complete with new standardized schema.');
        return 0;
    }
}

