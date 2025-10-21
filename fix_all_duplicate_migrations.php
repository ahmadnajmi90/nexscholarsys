<?php
require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Scanning for Duplicate/Renamed Migrations ===\n\n";

// Get all migration files
$migrationFiles = glob(__DIR__ . '/database/migrations/*.php');
$filesystemMigrations = [];

foreach ($migrationFiles as $file) {
    $filename = basename($file, '.php');
    $filesystemMigrations[] = $filename;
}

// Get all migrations from database
$databaseMigrations = DB::table('migrations')
    ->pluck('migration')
    ->toArray();

echo "Total migration files in filesystem: " . count($filesystemMigrations) . "\n";
echo "Total migrations recorded in database: " . count($databaseMigrations) . "\n\n";

// Find migrations that exist in filesystem but not in database
$missingInDatabase = array_diff($filesystemMigrations, $databaseMigrations);

if (empty($missingInDatabase)) {
    echo "✓ No missing migrations found. Everything is in sync!\n";
    exit(0);
}

echo "Found " . count($missingInDatabase) . " migrations that need to be added:\n\n";

// Group by table name to find potential duplicates
$tableGroups = [];
foreach ($missingInDatabase as $migration) {
    // Extract table name from migration filename
    if (preg_match('/_create_(.+)_table$/', $migration, $matches)) {
        $tableName = $matches[1];
        $tableGroups[$tableName][] = $migration;
    } else if (preg_match('/_add_(.+)_to_(.+)_table$/', $migration, $matches)) {
        $tableName = $matches[2];
        $tableGroups[$tableName][] = $migration;
    }
}

$latestBatch = DB::table('migrations')->max('batch') ?? 1;
$fixedCount = 0;

foreach ($missingInDatabase as $migration) {
    // Check if table already exists (for create_table migrations)
    $tableExists = false;
    $tableName = null;
    
    if (preg_match('/_create_(.+)_table$/', $migration, $matches)) {
        $tableName = $matches[1];
        $tableExists = DB::getSchemaBuilder()->hasTable($tableName);
    }
    
    echo "• {$migration}\n";
    
    if ($tableExists) {
        echo "  Table '{$tableName}' already exists - marking as migrated\n";
        
        // Find if there's an old migration for the same table
        $oldMigration = DB::table('migrations')
            ->where('migration', 'like', "%create_{$tableName}_table%")
            ->first();
        
        $batch = $oldMigration ? $oldMigration->batch : $latestBatch;
        
        DB::table('migrations')->insert([
            'migration' => $migration,
            'batch' => $batch,
        ]);
        
        $fixedCount++;
        echo "  ✓ Added to migrations table (batch {$batch})\n";
    } else {
        echo "  Table doesn't exist yet - will be created on next migrate\n";
    }
    
    echo "\n";
}

echo "\n=== Summary ===\n";
echo "Fixed: {$fixedCount} migrations\n";
echo "Remaining: " . (count($missingInDatabase) - $fixedCount) . " migrations (will run normally)\n";
echo "\n✓ You can now run 'php artisan migrate' successfully.\n";

