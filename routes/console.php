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
