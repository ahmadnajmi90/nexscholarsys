<?php

namespace App\Listeners;

use App\Events\ConnectionStatusChanged;
use App\Notifications\ConnectionRequestReceived;
use App\Notifications\ConnectionRequestAccepted;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendConnectionNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ConnectionStatusChanged $event): void
    {
        // Get the connection and status type from the event
        $connection = $event->connection;
        $statusType = $event->statusType;

        // Handle different status types
        switch ($statusType) {
            case 'requested':
                $this->handleConnectionRequest($connection);
                break;
            case 'accepted':
                $this->handleConnectionAccepted($connection);
                break;
            case 'rejected':
                // Currently not sending notifications for rejected requests
                break;
            default:
                // Unknown status type, do nothing
                break;
        }
    }

    /**
     * Handle sending notification for a connection request
     */
    private function handleConnectionRequest($connection): void
    {
        // Determine connection ID based on whether it's a model or object
        $recipientId = $connection->recipient_id;
        $requesterId = $connection->requester_id;
        
        // Find the recipient of the request
        $recipient = User::find($recipientId);
        
        // Find the requester
        $requester = User::find($requesterId);
        
        if ($recipient && $requester) {
            // Notify the recipient about the connection request
            $recipient->notify(new ConnectionRequestReceived($connection, $requester));
            
            // Remove legacy duplicate InvitationReceived notification
        }
    }

    /**
     * Handle sending notification for an accepted connection
     */
    private function handleConnectionAccepted($connection): void
    {
        // Determine connection ID based on whether it's a model or object
        $recipientId = $connection->recipient_id;
        $requesterId = $connection->requester_id;
        
        // Find the original requester (who will receive the notification)
        $requester = User::find($requesterId);
        
        // Find the recipient (who accepted the request)
        $recipient = User::find($recipientId);
        
        if ($requester && $recipient) {
            // Notify the original requester that their request was accepted
            $requester->notify(new ConnectionRequestAccepted($connection, $recipient));
        }
    }
}
