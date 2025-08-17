<?php

namespace App\Console\Commands;

use App\Models\PostgraduateProgram;
use App\Services\EmbeddingService;
use App\Services\QdrantService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class GeneratePostgraduateProgramEmbeddings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'embeddings:generate-postgraduate-programs
                            {--batch-size=100 : Number of programs to process per chunk}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate and store embeddings for all Postgraduate programs';

    private EmbeddingService $embeddingService;
    private QdrantService $qdrantService;

    public function __construct(EmbeddingService $embeddingService, QdrantService $qdrantService)
    {
        parent::__construct();
        $this->embeddingService = $embeddingService;
        $this->qdrantService = $qdrantService;
    }

    public function handle()
    {
        $batchSize = (int) $this->option('batch-size');

        // Ensure collection exists
        $collection = 'nexscholar_postgraduate_programs';
        $this->qdrantService->createCollection($collection);

        $total = PostgraduateProgram::count();
        if ($total === 0) {
            $this->info('No Postgraduate programs found.');
            return Command::SUCCESS;
        }

        $this->info("Generating embeddings for {$total} Postgraduate programs (batch size: {$batchSize})");
        $progressBar = $this->output->createProgressBar($total);
        $progressBar->start();

        $processed = 0;
        $failed = 0;

        PostgraduateProgram::with(['university', 'faculty'])
            ->orderBy('id')
            ->chunk($batchSize, function ($programs) use (&$processed, &$failed, $progressBar, $collection) {
                foreach ($programs as $program) {
                    try {
                        $text = $this->constructProgramText($program);
                        $embedding = $this->embeddingService->generateEmbedding($text);
                        if (!$embedding) {
                            $failed++;
                            $progressBar->advance();
                            continue;
                        }

                        $payload = [
                            'postgraduate_program_id' => $program->id,
                            'record_type' => 'postgraduate_program',
                            'name' => $program->name,
                            'program_type' => $program->program_type ?? 'Master',
                            'university_id' => $program->university_id,
                            'faculty_id' => $program->faculty_id,
                            'country' => $program->country,
                        ];

                        $upserted = $this->qdrantService->upsertVector(
                            $collection,
                            (string) $program->id,
                            $embedding,
                            $payload
                        );

                        if ($upserted) {
                            $processed++;
                        } else {
                            $failed++;
                        }
                    } catch (\Exception $e) {
                        $failed++;
                        Log::error('Error embedding Postgraduate program ID ' . $program->id . ': ' . $e->getMessage());
                    } finally {
                        $progressBar->advance();
                    }
                }
            });

        $progressBar->finish();
        $this->newLine();
        $this->info("Completed: {$processed} embedded, {$failed} failed");

        return Command::SUCCESS;
    }

    private function constructProgramText(PostgraduateProgram $program): string
    {
        $parts = [];
        if (!empty($program->name)) {
            $parts[] = 'Program: ' . $program->name;
        }
        if (!empty($program->program_type)) {
            $parts[] = 'Type: ' . $program->program_type;
        }
        if (!empty($program->description)) {
            $parts[] = 'Description: ' . $program->description;
        }
        if ($program->relationLoaded('university') && $program->university) {
            // UniversityList has full_name and short_name
            $universityName = $program->university->full_name ?? $program->university->short_name ?? '';
            if (!empty($universityName)) {
                $parts[] = 'University: ' . $universityName;
            }
        }
        if ($program->relationLoaded('faculty') && $program->faculty) {
            $parts[] = 'Faculty: ' . ($program->faculty->name ?? '');
        }
        if (!empty($program->country)) {
            $parts[] = 'Country: ' . $program->country;
        }
        if (!empty($program->duration_years)) {
            $parts[] = 'Duration: ' . $program->duration_years;
        }
        if (!empty($program->funding_info)) {
            $parts[] = 'Funding: ' . $program->funding_info;
        }

        return implode("\n", array_filter($parts));
    }
}

