<?php

namespace App\Observers;

use Illuminate\Notifications\DatabaseNotification;
use App\Events\NotificationSent;

class DatabaseNotificationObserver
{
    /**
     * Handle the DatabaseNotification "created" event.
     *
     * @param  \Illuminate\Notifications\DatabaseNotification  $notification
     * @return void
     */
    public function created(DatabaseNotification $notification)
    {
        // Broadcast the notification in real-time via Pusher
        event(new NotificationSent($notification));
    }
}
