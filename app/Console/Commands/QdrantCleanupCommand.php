<?php

namespace App\Console\Commands;

use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class QdrantCleanupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'qdrant:cleanup
                          {--force : Force execution without confirmation}
                          {--dry-run : Show what would be done without actually doing it}
                          {--data-only : Remove only embedding data, keep columns}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cleanup MySQL embedding data after Qdrant migration is complete';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $force = $this->option('force');
        $dryRun = $this->option('dry-run');
        $dataOnly = $this->option('data-only');
        
        // Verify prerequisites
        $enabled = config('services.qdrant.enabled', false);
        $percentage = config('services.qdrant.percentage', 0);
        
        if (!$enabled || $percentage < 100) {
            $this->error('Qdrant is not fully enabled (percentage: ' . $percentage . '%)');
            $this->error('This command should only be run after full migration to Qdrant is complete.');
            
            if (!$force) {
                $this->info('Use --force to override this check.');
                return Command::FAILURE;
            }
            
            $this->warn('Forcing execution despite Qdrant not being fully enabled...');
        }
        
        // Show warning and confirmation
        $this->warn('WARNING: This command will remove embedding data from MySQL tables.');
        $this->warn('This action is irreversible and should only be performed after');
        $this->warn('confirming that Qdrant search is working correctly for all users.');
        
        if ($dryRun) {
            $this->info('Dry run mode enabled - no changes will be made.');
        } else if (!$force) {
            if (!$this->confirm('Are you sure you want to proceed?')) {
                $this->info('Operation cancelled.');
                return Command::SUCCESS;
            }
        }
        
        // Show what will be done
        $this->info('The following changes will be made:');
        
        // For each table and column
        $tables = [
            'academicians' => ['embedding_vector', 'has_embedding', 'embedding_updated_at'],
            'postgraduates' => ['research_embedding', 'has_embedding', 'embedding_updated_at'],
            'undergraduates' => ['research_embedding', 'has_embedding', 'embedding_updated_at']
        ];
        
        foreach ($tables as $table => $columns) {
            if (!Schema::hasTable($table)) {
                $this->line(" - Table {$table}: <fg=red>Does not exist</>");
                continue;
            }
            
            $this->line(" - Table {$table}:");
            
            foreach ($columns as $column) {
                if (Schema::hasColumn($table, $column)) {
                    if ($dataOnly) {
                        $this->line("   - Clear data from column {$column}");
                    } else {
                        $this->line("   - Remove column {$column}");
                    }
                } else {
                    $this->line("   - Column {$column}: <fg=yellow>Already removed</>");
                }
            }
        }
        
        // Execute cleanup
        if (!$dryRun) {
            $this->info("\nExecuting cleanup...");
            
            foreach ($tables as $table => $columns) {
                if (!Schema::hasTable($table)) {
                    continue;
                }
                
                foreach ($columns as $column) {
                    if (Schema::hasColumn($table, $column)) {
                        if ($dataOnly) {
                            // Handle embedding data columns
                            if ($column === 'embedding_vector' || $column === 'research_embedding') {
                                // Update all records to set embedding vector to NULL
                                $count = DB::table($table)->whereNotNull($column)->update([$column => null]);
                                $this->info(" ✓ Cleared data from {$count} records in {$table}.{$column}");
                                Log::info("Cleared embedding data from {$count} records in {$table}.{$column}");
                            } 
                            // Handle has_embedding flag
                            else if ($column === 'has_embedding') {
                                // Set has_embedding to false for all records
                                $count = DB::table($table)->where($column, true)->update([$column => false]);
                                $this->info(" ✓ Set {$count} records' {$column} flag to false in {$table}");
                                Log::info("Set {$count} records' {$column} flag to false in {$table}");
                            }
                            // Handle embedding_updated_at timestamp
                            else if ($column === 'embedding_updated_at') {
                                // Set embedding_updated_at to NULL for all records
                                $count = DB::table($table)->whereNotNull($column)->update([$column => null]);
                                $this->info(" ✓ Cleared {$count} records' {$column} timestamps in {$table}");
                                Log::info("Cleared {$count} records' {$column} timestamps in {$table}");
                            }
                        } else {
                            // Drop the column
                            Schema::table($table, function ($table) use ($column) {
                                $table->dropColumn($column);
                            });
                            $this->info(" ✓ Removed column {$table}.{$column}");
                            Log::info("Removed column {$table}.{$column}");
                        }
                    }
                }
            }
            
            $this->info("\n✓ Cleanup completed successfully!");
            
            if ($dataOnly) {
                $this->info("Note: Embedding columns were kept but data was cleared.");
                $this->info("Run without --data-only to remove the columns completely when ready.");
            }
        } else {
            $this->info("\nDry run complete - no changes were made.");
        }
        
        return Command::SUCCESS;
    }
} 