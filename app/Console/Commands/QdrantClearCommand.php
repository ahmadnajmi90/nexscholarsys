<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\QdrantService;
use Illuminate\Support\Facades\Log;

class QdrantClearCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'qdrant:clear 
                          {collection? : Specific collection to clear (academicians, students, programs, or all)} 
                          {--force : Force execution without confirmation}
                          {--dry-run : Show what would be done without actually doing it}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear/empty Qdrant collections (delete all vectors but keep collection structure)';

    protected QdrantService $qdrantService;

    /**
     * Create a new command instance.
     */
    public function __construct(QdrantService $qdrantService)
    {
        parent::__construct();
        $this->qdrantService = $qdrantService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $collectionArg = $this->argument('collection') ?? 'all';
        $force = $this->option('force');
        $dryRun = $this->option('dry-run');

        // Get collection names from config
        $availableCollections = [
            'academicians' => config('services.qdrant.academicians_collection', 'nexscholar_academicians'),
            'students' => config('services.qdrant.students_collection', 'nexscholar_students'),
            'programs' => config('services.qdrant.postgraduate_programs_collection', 'nexscholar_postgraduate_programs'),
        ];

        // Determine which collections to clear
        $collectionsToClear = [];
        
        if ($collectionArg === 'all') {
            $collectionsToClear = $availableCollections;
        } elseif (isset($availableCollections[$collectionArg])) {
            $collectionsToClear[$collectionArg] = $availableCollections[$collectionArg];
        } else {
            $this->error("Invalid collection: {$collectionArg}");
            $this->info("Available collections: academicians, students, programs, all");
            return Command::FAILURE;
        }

        // Show warning
        $this->warn('⚠️  WARNING: This will DELETE ALL VECTORS from the following Qdrant collections:');
        foreach ($collectionsToClear as $key => $collectionName) {
            $this->line("  • {$key}: {$collectionName}");
        }
        $this->newLine();
        $this->warn('The collection structure will be preserved, but all data will be removed.');
        $this->warn('You will need to regenerate embeddings after this operation.');
        $this->newLine();

        if ($dryRun) {
            $this->info('🔍 DRY RUN MODE - No changes will be made');
            $this->newLine();
        }

        // Confirmation
        if (!$force && !$dryRun) {
            if (!$this->confirm('Are you absolutely sure you want to proceed?')) {
                $this->info('Operation cancelled.');
                return Command::SUCCESS;
            }
        }

        // Execute clearing
        $this->info('🗑️  Starting Qdrant collection clearing...');
        $this->newLine();

        $successCount = 0;
        $failCount = 0;

        foreach ($collectionsToClear as $key => $collectionName) {
            $this->line("Processing collection: {$key} ({$collectionName})");

            if ($dryRun) {
                $this->info("  [DRY RUN] Would delete collection: {$collectionName}");
                $this->info("  [DRY RUN] Would recreate collection: {$collectionName}");
                $successCount++;
                continue;
            }

            try {
                // Delete the collection
                $this->line("  ⏳ Deleting collection...");
                $deleteResult = $this->qdrantService->deleteCollection($collectionName);
                
                if ($deleteResult) {
                    $this->info("  ✅ Collection deleted successfully");
                } else {
                    $this->warn("  ⚠️  Collection may not exist or already deleted");
                }

                // Recreate the collection (empty)
                $this->line("  ⏳ Recreating empty collection...");
                $createResult = $this->qdrantService->createCollection($collectionName);
                
                if ($createResult) {
                    $this->info("  ✅ Empty collection created successfully");
                    $successCount++;
                    
                    Log::info("Qdrant collection cleared", [
                        'collection_key' => $key,
                        'collection_name' => $collectionName,
                        'command' => 'qdrant:clear'
                    ]);
                } else {
                    $this->error("  ❌ Failed to recreate collection");
                    $failCount++;
                    
                    Log::error("Failed to recreate Qdrant collection", [
                        'collection_key' => $key,
                        'collection_name' => $collectionName
                    ]);
                }
            } catch (\Exception $e) {
                $this->error("  ❌ Error: " . $e->getMessage());
                $failCount++;
                
                Log::error("Error clearing Qdrant collection", [
                    'collection_key' => $key,
                    'collection_name' => $collectionName,
                    'error' => $e->getMessage()
                ]);
            }

            $this->newLine();
        }

        // Summary
        if ($dryRun) {
            $this->info("🔍 Dry run complete - no changes were made");
            $this->info("Run without --dry-run to actually clear the collections");
        } else {
            $this->newLine();
            $this->info("📊 Summary:");
            $this->line("  • Successfully cleared: {$successCount}");
            if ($failCount > 0) {
                $this->line("  • Failed: {$failCount}");
            }
            
            if ($successCount > 0) {
                $this->newLine();
                $this->info("✅ Collection(s) cleared successfully!");
                $this->newLine();
                $this->warn("⚠️  IMPORTANT: You need to regenerate embeddings now:");
                $this->line("  • For academicians: php artisan embeddings:generate-academician --complete-only");
                $this->line("  • For students: php artisan embeddings:generate-student --complete-only");
                $this->line("  • For programs: php artisan embeddings:generate-postgraduate-programs");
                $this->newLine();
                $this->line("Or use: php artisan qdrant:rebuild-collections --force");
            }
        }

        return $successCount > 0 ? Command::SUCCESS : Command::FAILURE;
    }
}
