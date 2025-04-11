<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Schedule the post views update command to run daily
Schedule::command('app:update-post-views-count')->daily();

// Schedule the academician views sync command to run daily at midnight
Schedule::command('app:sync-academician-views')->dailyAt('00:00');

// Google Scholar Scraping Commands
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

// Schedule the Google Scholar commands
Schedule::command('scholar:sync-scheduled')
    ->dailyAt('00:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/scholar-sync.log'));
    
Schedule::command('scholar:sync-batch --limit=100')
    ->weekly()
    ->sundays()
    ->at('03:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/scholar-batch.log'));
