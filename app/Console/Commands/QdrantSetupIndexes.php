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
        $this->info('Setting up Qdrant payload indexes...');

        $academicianCollection = config('services.qdrant.academicians_collection');
        if ($qdrantService->createPayloadIndex($academicianCollection, 'academician_id', 'keyword')) {
            $this->info("Index 'academician_id' on '{$academicianCollection}' created successfully.");
        } else {
            $this->error("Failed to create index 'academician_id' on '{$academicianCollection}'.");
        }

        // Also index fallback keys used in lookups
        if ($qdrantService->createPayloadIndex($academicianCollection, 'original_id', 'keyword')) {
            $this->info("Index 'original_id' on '{$academicianCollection}' created successfully.");
        } else {
            $this->error("Failed to create index 'original_id' on '{$academicianCollection}'.");
        }

        if ($qdrantService->createPayloadIndex($academicianCollection, 'mysql_id', 'integer')) {
            $this->info("Index 'mysql_id' on '{$academicianCollection}' created successfully.");
        } else {
            $this->error("Failed to create index 'mysql_id' on '{$academicianCollection}'.");
        }

        // Postgraduate programs collection indexes
        $programsCollection = 'nexscholar_postgraduate_programs';
        if ($qdrantService->createPayloadIndex($programsCollection, 'program_type', 'keyword')) {
            $this->info("Index 'program_type' on '{$programsCollection}' created successfully.");
        } else {
            $this->error("Failed to create index 'program_type' on '{$programsCollection}'.");
        }

        if ($qdrantService->createPayloadIndex($programsCollection, 'postgraduate_program_id', 'integer')) {
            $this->info("Index 'postgraduate_program_id' on '{$programsCollection}' created successfully.");
        } else {
            $this->error("Failed to create index 'postgraduate_program_id' on '{$programsCollection}'.");
        }

        $this->info('Qdrant payload indexes setup complete.');
        return 0;
    }
}

