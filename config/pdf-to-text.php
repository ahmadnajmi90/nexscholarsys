<?php

return [
    'pdf_to_text' => [
        /*
         * The path to the pdftotext binary.
         * If set to null, this will check the system's PATH environment variable.
         */
        'binary' => env('PDFTOTEXT_PATH', null),
        
        /*
         * Default timeout for pdftotext command in seconds.
         */
        'timeout' => 60,
    ],
]; 