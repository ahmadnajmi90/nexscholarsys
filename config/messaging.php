<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Message Edit/Delete Window
    |--------------------------------------------------------------------------
    |
    | Define how long users can edit or delete their messages after sending.
    | Values are in minutes.
    |
    */

    'edit_window_minutes' => env('CHAT_EDIT_WINDOW_MIN', 10),
    'delete_window_minutes' => env('CHAT_DELETE_WINDOW_MIN', 60),

    /*
    |--------------------------------------------------------------------------
    | File Upload Limits
    |--------------------------------------------------------------------------
    |
    | Configure file upload limits for message attachments.
    | Size limits are in MB.
    |
    */

    'max_upload_mb' => env('CHAT_MAX_UPLOAD_MB', 20),
    
    'allowed_mimes' => [
        'images' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        'documents' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
        'videos' => ['mp4', 'webm', 'mov'],
        'audio' => ['mp3', 'wav', 'ogg'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Storage Configuration
    |--------------------------------------------------------------------------
    |
    | Define storage paths and disk configuration for message attachments.
    |
    */

    'storage_disk' => env('CHAT_STORAGE_DISK', 'public'),
    'storage_path' => 'messaging/attachments',
    'thumbnail_path' => 'messaging/thumbnails',
];