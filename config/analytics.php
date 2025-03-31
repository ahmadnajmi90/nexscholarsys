<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Google Analytics Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the configuration for Google Analytics API.
    |
    */

    // GA4 Property ID (without the 'G-' prefix)
    'property_id' => env('GOOGLE_ANALYTICS_PROPERTY_ID', '483738680'),

    // Full Measurement ID (with 'G-' prefix)
    'measurement_id' => env('GOOGLE_ANALYTICS_MEASUREMENT_ID', 'G-483738680'),

    // Google Service Account Credentials JSON file path
    'service_account_credentials_json' => env('GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON', base_path('storage/app/google/nexcholar-943eca95a1fe.json')),

    // Default date range for reports (in days)
    'default_date_range' => 30,

    // Cache analytics data (in minutes)
    'cache_lifetime' => 60,
    
    // Whether to use mock data when the GA API is not available
    'use_mock_data' => true,
]; 