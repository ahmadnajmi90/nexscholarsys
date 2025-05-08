<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Services\EmbeddingService;
use Illuminate\Console\Command;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Schedule the post views update command to run daily
Schedule::command('app:update-post-views-count')->daily();

// Schedule the academician views sync command to run daily at midnight
Schedule::command('app:sync-academician-views')->dailyAt('00:00');

// Google Scholar scraping is now handled by user-initiated actions
// The scheduled commands have been removed

// Google Scholar Scraping Commands - Keep only the single scraper
Artisan::command('scholar:scrape-single {academician_id}', function ($academicianId) {
    $academician = \App\Models\Academician::where('academician_id', $academicianId)->first();
    
    if (!$academician) {
        $this->error("Academician with ID {$academicianId} not found.");
        return 1;
    }
    
    if (empty($academician->google_scholar)) {
        $this->error("Academician does not have a Google Scholar URL.");
        return 1;
    }
    
    $this->info("Scraping Google Scholar profile for {$academician->full_name}...");
    
    $service = app(\App\Services\GoogleScholarService::class);
    $result = $service->scrapeProfile($academician);
    
    if ($result) {
        $this->info("Successfully scraped Google Scholar profile.");
    } else {
        $this->error("Failed to scrape Google Scholar profile. Check logs for details.");
        return 1;
    }
    
    return 0;
})->purpose('Scrape a single academician Google Scholar profile');

// Scheduled Google Scholar commands have been removed

// Register the TestEmbeddingsCommand for Laravel 11
Artisan::command('test:embeddings {text?}', function (EmbeddingService $embeddingService) {
    $text = $this->argument('text') ?? 'This is a test of the OpenAI embeddings API using the direct API key from Laravel';
    
    $this->info("Generating embedding for text: " . $text);
    
    $embedding = $embeddingService->generateEmbedding($text);
    
    if ($embedding) {
        $this->info("✓ Success! Embedding generated with " . count($embedding) . " dimensions.");
        $this->info("Sample of embedding vector: [" . 
            implode(', ', array_slice($embedding, 0, 5)) . 
            " ... ]");
    } else {
        $this->error("✗ Failed to generate embedding");
        $this->line("Check the Laravel log for more details.");
    }
})->purpose('Test the embeddings service with OpenAI API');

// Register command to clear the supervisor search cache
Artisan::command('supervisor:clear-cache', function () {
    $cleared = \Illuminate\Support\Facades\Cache::get('supervisor_match_semantic_*');
    \Illuminate\Support\Facades\Cache::flush();
    $this->info("Supervisor search cache cleared.");
})->purpose('Clear the supervisor search cache');

