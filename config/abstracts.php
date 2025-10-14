<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Abstract Length Limits
    |--------------------------------------------------------------------------
    |
    | Configure the minimum and maximum length for supervision request abstracts.
    | These limits apply to both manually entered and automatically extracted abstracts.
    |
    */

    'min_length' => env('ABSTRACT_MIN_LENGTH', 50),
    'max_length' => env('ABSTRACT_MAX_LENGTH', 5000),
];

