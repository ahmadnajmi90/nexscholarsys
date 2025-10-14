<?php

namespace App\Console\Commands;

use App\Support\PhoneNumberNormalizer;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Throwable;

class NormalizePhoneNumbers extends Command
{
    protected $signature = 'phone:normalize
                            {table? : Specific table to normalize (academicians, postgraduates, undergraduates)}
                            {--dry-run : Only display what would change}
                            {--chunk=500 : Number of rows to process per batch}
                            {--log= : Optional path to log file for failures}';

    protected $description = 'Normalize stored Malaysian phone numbers to E.164 using libphonenumber.';

    protected PhoneNumberNormalizer $normalizer;

    protected array $tables = [
        'academicians' => ['key' => 'id', 'column' => 'phone_number'],
        'postgraduates' => ['key' => 'id', 'column' => 'phone_number'],
        'undergraduates' => ['key' => 'id', 'column' => 'phone_number'],
    ];

    public function __construct(PhoneNumberNormalizer $normalizer)
    {
        parent::__construct();

        $this->normalizer = $normalizer;
    }

    public function handle(): int
    {
        $table = $this->argument('table');
        $dryRun = (bool) $this->option('dry-run');
        $chunk = (int) $this->option('chunk');
        $logPath = $this->option('log');

        $targets = $this->determineTargets($table);
        if (empty($targets)) {
            $this->warn('No tables to process.');
            return self::SUCCESS;
        }

        $this->info($dryRun ? 'Dry-run mode: no changes will be persisted.' : 'Normalizing phone numbers...');

        $totals = [
            'processed' => 0,
            'updated' => 0,
            'skipped' => 0,
            'failed' => 0,
        ];

        $logStream = $logPath ? @fopen($logPath, 'a') : null;
        if ($logPath && !$logStream) {
            $this->error("Unable to open log file at {$logPath}. Proceeding without logging failures.");
        }

        foreach ($targets as $name => $config) {
            $this->line("\nProcessing table: {$name}");
            $metrics = $this->processTable($name, $config, $chunk, $dryRun, $logStream);

            $totals['processed'] += $metrics['processed'];
            $totals['updated'] += $metrics['updated'];
            $totals['skipped'] += $metrics['skipped'];
            $totals['failed'] += $metrics['failed'];
        }

        if ($logStream) {
            fclose($logStream);
        }

        $this->line("\nSummary: processed={$totals['processed']}, updated={$totals['updated']}, skipped={$totals['skipped']}, failed={$totals['failed']}");

        return self::SUCCESS;
    }

    protected function determineTargets(?string $table): array
    {
        if (empty($table)) {
            return $this->tables;
        }

        if (! isset($this->tables[$table])) {
            $this->error("Table '{$table}' is not supported.");
            return [];
        }

        return [$table => $this->tables[$table]];
    }

    protected function processTable(string $table, array $config, int $chunk, bool $dryRun, $logStream): array
    {
        $metrics = [
            'processed' => 0,
            'updated' => 0,
            'skipped' => 0,
            'failed' => 0,
        ];

        DB::table($table)
            ->select($config['key'], $config['column'])
            ->orderBy($config['key'])
            ->chunk($chunk, function (Collection $rows) use ($table, $config, $dryRun, &$metrics, $logStream) {
                foreach ($rows as $row) {
                    $metrics['processed']++;

                    $original = $row->{$config['column']};
                    if (empty($original)) {
                        $metrics['skipped']++;
                        continue;
                    }

                    $normalized = $this->normalizer->normalize($original);

                    if (trim((string) $normalized) === trim((string) $original)) {
                        $metrics['skipped']++;
                        continue;
                    }

                    if ($dryRun) {
                        $this->line("[DRY-RUN] {$table}#{$row->{$config['key']}}: {$original} -> {$normalized}");
                        $metrics['updated']++;
                        continue;
                    }

                    try {
                        DB::table($table)
                            ->where($config['key'], $row->{$config['key']})
                            ->update([$config['column'] => $normalized]);

                        $metrics['updated']++;
                    } catch (Throwable $exception) {
                        $metrics['failed']++;

                        if ($logStream) {
                            fwrite($logStream, sprintf(
                                "%s | %s.%s=%s | %s -> %s | %s\n",
                                now()->toDateTimeString(),
                                $table,
                                $config['key'],
                                $row->{$config['key']},
                                $original,
                                $normalized,
                                $exception->getMessage()
                            ));
                        }

                        $this->error("Failed to update {$table} ID {$row->{$config['key']}}: {$exception->getMessage()}");
                    }
                }
            });

        $this->line("Processed {$metrics['processed']} rows. Updated {$metrics['updated']}, skipped {$metrics['skipped']}, failed {$metrics['failed']}.");

        return $metrics;
    }
}
