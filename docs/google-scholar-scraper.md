# Google Scholar Scraper

This document provides instructions on how to use and maintain the Google Scholar scraper for academician profiles.

## Overview

The Google Scholar scraper is designed to:
- Extract publication data from academicians' Google Scholar profiles
- Store this data in the database for display on academician profiles
- Track citation counts, h-index, and i10-index
- Operate reliably with built-in anti-blocking mechanisms

## Components

The scraper consists of several components:

1. **GoogleScholarService**: Core service that handles the actual scraping logic
2. **ScrapeGoogleScholarJob**: Queue job for asynchronous processing of scraper tasks
3. **Commands**:
   - `scholar:sync-batch`: Process a batch of profiles prioritizing those that haven't been updated recently
   - `scholar:sync-scheduled`: Run on a schedule to update profiles based on last update time
   - `scholar:sync-full`: Synchronize all profiles (for initial setup or complete refresh)
   - `scholar:scrape-single`: Manually scrape a single academician's profile

## Database Structure

The scraper utilizes the following database tables:
- `scholar_profiles`: Stores profile metadata (citation counts, indexes, etc.)
- `publications`: Stores individual publications for each academician
- `scraping_logs`: Tracks the success/failure of scraping attempts

## Running the Scraper

### Scheduled Operation

The scheduler is configured in the `bootstrap/app.php` file and will automatically:
- Run the `scholar:sync-scheduled` command daily at midnight
- Run the `scholar:sync-batch` command weekly on Sundays at 3:00 AM

To activate the scheduler, add the following entry to your server's crontab:

```
* * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
```

### Manual Operations

#### To scrape all academician profiles:

```bash
php artisan scholar:sync-full
```

Optional parameters:
- `--chunk=25`: Number of academicians to process per batch
- `--delay=10`: Seconds to delay between batches

Example:
```bash
php artisan scholar:sync-full --chunk=50 --delay=20
```

#### To process a batch of profiles:

```bash
php artisan scholar:sync-batch
```

Optional parameters:
- `--limit=10`: Number of profiles to process
- `--force`: Force sync even if recently updated

Example:
```bash
php artisan scholar:sync-batch --limit=20 --force
```

#### To scrape a single academician's profile:

```bash
php artisan scholar:scrape-single {academician_id}
```

#### Using the console route:
```bash
php artisan scholar:scrape-single ACM001
```

## Rate Limiting and Anti-Blocking

The scraper includes several mechanisms to avoid being blocked by Google:
- Random user agent rotation
- Delays between requests
- Detection of CAPTCHA challenges
- Automatic throttling when potential blocking is detected

If the scraper encounters a CAPTCHA or detects unusual behavior from Google, it will automatically reduce its request rate and log the issue.

## Logging

All scraping operations are logged to:
- The Laravel log file (`storage/logs/laravel.log`)
- Specific log files for scheduled operations:
  - `storage/logs/scholar-sync.log`
  - `storage/logs/scholar-batch.log`
- The `scraping_logs` database table

## Troubleshooting

### Common Issues

1. **Rate Limiting**: If you see many "Rate limited" entries in the logs, you may be sending too many requests. Consider:
   - Increasing the delay between batches
   - Reducing the chunk size
   - Spacing out your manual operations

2. **CAPTCHA Detection**: If you encounter CAPTCHA warnings, the system has been temporarily flagged by Google. The system will:
   - Automatically pause for several hours
   - Reduce request frequency when it resumes

3. **Failed Scraping**: If individual scraping attempts fail but others succeed, check:
   - The specific academician's Google Scholar URL
   - The log messages for that specific failure

## Maintenance

To ensure the scraper continues to function properly:

1. **Regular Monitoring**: Check the scraping logs to detect patterns of failures
2. **Updating User Agents**: Periodically update the user agent strings in `GoogleScholarService.php`
3. **Adjusting Delays**: Tune the delay parameters based on your observed success rate

## Queue Processing

The scraper uses Laravel's queue system. Ensure you have a queue worker running:

```bash
php artisan queue:work --queue=scraping
```

For production, consider using a process manager like Supervisor to keep the queue worker running. 