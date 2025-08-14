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

        $this->info('Qdrant payload indexes setup complete.');
        return 0;
    }
}

