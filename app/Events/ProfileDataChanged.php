<?php

namespace App\Events;

use App\Models\User;

class ProfileDataChanged
{
    public User $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }
}

