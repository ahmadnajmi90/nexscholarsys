<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Google Scholar Scraping Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Google Scholar profile and publication scraping.
    | These settings control pagination, rate limiting, and timeout behavior.
    |
    */

    'google_scholar' => [
        
        // Number of publications to fetch per page (max: 100)
        'page_size' => env('SCHOLAR_PAGE_SIZE', 100),
        
        // Maximum number of pages to scrape (prevents infinite loops)
        // 10 pages × 100 results = 1000 publications max
        'max_pages' => env('SCHOLAR_MAX_PAGES', 10),
        
        // Minimum delay between requests (seconds)
        'request_delay_min' => env('SCHOLAR_DELAY_MIN', 5),
        
        // Maximum delay between requests (seconds)
        'request_delay_max' => env('SCHOLAR_DELAY_MAX', 10),
        
        // HTTP request timeout (seconds)
        'timeout' => env('SCHOLAR_TIMEOUT', 30),
        
        // Retry attempts for failed requests
        'retry_attempts' => env('SCHOLAR_RETRY_ATTEMPTS', 3),
        
        // Delay between retry attempts (seconds)
        'retry_delay' => env('SCHOLAR_RETRY_DELAY', 10),
    ],

];

