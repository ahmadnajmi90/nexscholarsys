<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Connection;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ConnectionController extends Controller
{
    /**
     * Display the user's network connections page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get accepted connections (friends)
        $acceptedConnections = Connection::where(function($query) use ($user) {
                $query->where('requester_id', $user->id)
                    ->orWhere('recipient_id', $user->id);
            })
            ->where('status', 'accepted')
            ->with([
                'requester.academician', 'requester.postgraduate', 'requester.undergraduate',
                'recipient.academician', 'recipient.postgraduate', 'recipient.undergraduate'
            ])
            ->get()
            ->map(function($connection) use ($user) {
                // Determine which user is the connection (not the current user)
                $connectionUser = $connection->requester_id == $user->id 
                    ? $connection->recipient 
                    : $connection->requester;
                
                return [
                    'connection_id' => $connection->id,
                    'status' => $connection->status,
                    'created_at' => $connection->created_at,
                    'user' => $connectionUser
                ];
            });
        
        // Get pending received requests
        $receivedRequests = Connection::where('recipient_id', $user->id)
            ->where('status', 'pending')
            ->with([
                'requester.academician', 'requester.postgraduate', 'requester.undergraduate'
            ])
            ->get()
            ->map(function($connection) {
                return [
                    'connection_id' => $connection->id,
                    'status' => $connection->status,
                    'created_at' => $connection->created_at,
                    'user' => $connection->requester
                ];
            });
        
        // Get pending sent requests
        $sentRequests = Connection::where('requester_id', $user->id)
            ->where('status', 'pending')
            ->with([
                'recipient.academician', 'recipient.postgraduate', 'recipient.undergraduate'
            ])
            ->get()
            ->map(function($connection) {
                return [
                    'connection_id' => $connection->id,
                    'status' => $connection->status,
                    'created_at' => $connection->created_at,
                    'user' => $connection->recipient
                ];
            });
        
        return Inertia::render('Networking/MyConnections', [
            'acceptedConnections' => $acceptedConnections,
            'receivedRequests' => $receivedRequests,
            'sentRequests' => $sentRequests
        ]);
    }
}
