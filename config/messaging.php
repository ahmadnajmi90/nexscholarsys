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

    'edit_window_minutes' => env('MESSAGING_EDIT_WINDOW', 15),
    'delete_window_minutes' => env('MESSAGING_DELETE_WINDOW', 60),

    /*
    |--------------------------------------------------------------------------
    | File Upload Limits
    |--------------------------------------------------------------------------
    |
    | Configure file upload limits for message attachments.
    | Size limits are in KB.
    |
    */

    'max_file_size' => env('MESSAGING_MAX_FILE_SIZE', 10240), // 10MB
    'max_image_size' => env('MESSAGING_MAX_IMAGE_SIZE', 5120), // 5MB
    
    'allowed_mimes' => [
        'images' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        'documents' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
        'videos' => ['mp4', 'webm', 'mov'], // Optional for future
    ],

    /*
    |--------------------------------------------------------------------------
    | Storage Configuration
    |--------------------------------------------------------------------------
    |
    | Define storage paths and disk configuration for message attachments.
    |
    */

    'storage_disk' => env('MESSAGING_STORAGE_DISK', 'public'),
    'storage_path' => 'messaging',

];