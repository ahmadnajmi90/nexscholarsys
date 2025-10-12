<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Supervision Request Settings
    |--------------------------------------------------------------------------
    */

    'max_pending_requests' => env('SUPERVISION_MAX_PENDING_REQUESTS', 5),

    /*
    |--------------------------------------------------------------------------
    | Co-Supervisor Settings
    |--------------------------------------------------------------------------
    */

    'max_cosupervisors' => env('SUPERVISION_MAX_COSUPERVISORS', 2),

    /*
    |--------------------------------------------------------------------------
    | Unbind Request Settings
    |--------------------------------------------------------------------------
    */

    'unbind_cooldown_days' => env('SUPERVISION_UNBIND_COOLDOWN_DAYS', 7),
    'unbind_max_attempts' => env('SUPERVISION_UNBIND_MAX_ATTEMPTS', 3),

    /*
    |--------------------------------------------------------------------------
    | Offer Expiry Settings
    |--------------------------------------------------------------------------
    */

    'offer_expiry_days' => env('SUPERVISION_OFFER_EXPIRY_DAYS', 7),

    /*
    |--------------------------------------------------------------------------
    | Meeting Settings
    |--------------------------------------------------------------------------
    */

    'meeting_reminder_hours' => env('SUPERVISION_MEETING_REMINDER_HOURS', 24),
];

