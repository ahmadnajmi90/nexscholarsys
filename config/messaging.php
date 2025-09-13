<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Message Edit Window
    |--------------------------------------------------------------------------
    |
    | This value determines how many minutes a user has to edit their message
    | after sending it. After this window expires, the message can no longer
    | be edited.
    |
    */
    'edit_window_minutes' => env('MESSAGING_EDIT_WINDOW', 15),

    /*
    |--------------------------------------------------------------------------
    | Message Delete Window
    |--------------------------------------------------------------------------
    |
    | This value determines how many minutes a user has to delete their message
    | after sending it. After this window expires, the message can no longer
    | be deleted by the sender (though admins can still delete it).
    |
    */
    'delete_window_minutes' => env('MESSAGING_DELETE_WINDOW', 15),
];