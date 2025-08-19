<?php

namespace App\Exceptions;

use Exception;

class CannotDeleteException extends Exception
{
    public function __construct($message = "Cannot delete this record due to existing relationships.", $code = 409)
    {
        parent::__construct($message, $code);
    }
} 