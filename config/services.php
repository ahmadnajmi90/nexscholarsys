<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */
    'poppler' => [
        'path' => env('PDFTOTEXT_PATH', 'C:\poppler\Library\bin\pdftotext.exe'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
        'calendar_redirect' => env('APP_URL') . '/auth/google/calendar/callback',
        'scopes' => [
            'https://www.googleapis.com/auth/calendar.events'
        ],
        
        'custom_search_api_key' => env('GOOGLE_API_KEY'),
        'custom_search_cx' => env('GOOGLE_CX'),
    ],

    'githubopenai' => [
        'token'    => env('GITHUB_TOKEN'),
        'endpoint' => env('GITHUB_OPENAI_ENDPOINT'), // base endpoint
    ],

    'openai' => [
        'key' => env('OPENAI_API_KEY', env('GITHUB_TOKEN')), // Prefer direct OpenAI key if available
        'endpoint' => env('OPENAI_API_ENDPOINT', 'https://api.openai.com/v1'), // Standard OpenAI API endpoint
        'embedding_model' => env('OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small'),
        'is_azure' => env('OPENAI_USE_AZURE', false), // Set to true for Azure OpenAI
        'azure_endpoint' => env('AZURE_OPENAI_ENDPOINT'), // Only used if is_azure is true
        'azure_api_version' => env('AZURE_OPENAI_API_VERSION', '2024-02-01'),
        'embedding_deployment' => env('AZURE_OPENAI_EMBEDDING_DEPLOYMENT', 'text-embedding-3-small'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Qdrant Vector Database Configuration
    |--------------------------------------------------------------------------
    |
    | This section provides configuration for the Qdrant vector database service
    | used for semantic search functionality. Qdrant is initially disabled by
    | default during the migration process.
    |
    */
   
    'qdrant' => [
        'url' => env('QDRANT_URL', 'your_qdrant_cloud_cluster_url'),
        'api_key' => env('QDRANT_API_KEY', 'your_qdrant_cloud_api_key'),
        'academicians_collection' => env('QDRANT_COLLECTION_ACADEMICIAN', 'nexscholar_academicians'),
        'students_collection' => env('QDRANT_COLLECTION_STUDENT', 'nexscholar_students'),
        'vector_size' => env('QDRANT_VECTOR_SIZE', 1536),
        'enabled' => env('QDRANT_ENABLED', false),
        'percentage' => env('QDRANT_ROLLOUT_PERCENTAGE', 0), // Percentage of traffic to route to Qdrant (0-100)
    ],
];
