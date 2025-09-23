<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ConnectionResource;
use App\Models\Connection;
use App\Models\User;
use App\Events\ConnectionStatusChanged;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ConnectionController extends Controller
{
    /**
     * Display a listing of the user's accepted connections.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Authorize the user to view their connections
        $this->authorize('viewAny', Connection::class);

        $user = Auth::user();
        $perPage = $request->integer('per_page', 15);

        // Query for accepted connections where the user is either requester or recipient
        $query = Connection::where(function ($query) use ($user) {
                $query->where('requester_id', $user->id)
                      ->orWhere('recipient_id', $user->id);
            })
            ->where('status', 'accepted')
            ->with([
                'requester',
                'recipient',
                'requester.academician:academician_id,full_name,profile_picture',
                'requester.postgraduate:postgraduate_id,full_name,profile_picture',
                'requester.undergraduate:undergraduate_id,full_name,profile_picture',
                'recipient.academician:academician_id,full_name,profile_picture',
                'recipient.postgraduate:postgraduate_id,full_name,profile_picture',
                'recipient.undergraduate:undergraduate_id,full_name,profile_picture'
            ]);

        // Search functionality
        if ($q = trim($request->string('q')->toString())) {
            $query->where(function ($subquery) use ($q, $user) {
                // Search in the counterpart user's name/email
                $subquery->where(function ($query) use ($q, $user) {
                    $query->where('requester_id', $user->id)
                          ->whereHas('recipient', function ($query) use ($q) {
                              $query->where('full_name', 'like', '%' . $q . '%')
                                    ->orWhere('name', 'like', '%' . $q . '%')
                                    ->orWhere('email', 'like', '%' . $q . '%');
                          });
                })->orWhere(function ($query) use ($q, $user) {
                    $query->where('recipient_id', $user->id)
                          ->whereHas('requester', function ($query) use ($q) {
                              $query->where('full_name', 'like', '%' . $q . '%')
                                    ->orWhere('name', 'like', '%' . $q . '%')
                                    ->orWhere('email', 'like', '%' . $q . '%');
                          });
                });
            });
        }

        $connections = $query->paginate($perPage);

        return ConnectionResource::collection($connections);
    }

    /**
     * Send a connection request to a user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, User $user)
    {
        $currentUser = Auth::user();

        // Prevent a user from connecting with themselves
        if ($currentUser->id === $user->id) {
            $message = 'You cannot send a connection request to yourself.';
            
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => $message
                ], Response::HTTP_BAD_REQUEST);
            }
            
            return back()->with('error', $message);
        }

        // Check if a pending or accepted connection already exists
        $existingConnection = Connection::where(function ($query) use ($currentUser, $user) {
                $query->where('requester_id', $currentUser->id)
                      ->where('recipient_id', $user->id);
            })
            ->orWhere(function ($query) use ($currentUser, $user) {
                $query->where('requester_id', $user->id)
                      ->where('recipient_id', $currentUser->id);
            })
            ->first();

        if ($existingConnection) {
            if ($existingConnection->status === 'pending') {
                $message = $existingConnection->requester_id === $currentUser->id
                    ? 'You have already sent a connection request to this user.'
                    : 'This user has already sent you a connection request.';
            } else {
                $message = 'You are already connected with this user.';
            }

            if ($request->wantsJson()) {
                return response()->json(['message' => $message], Response::HTTP_BAD_REQUEST);
            }
            
            return back()->with('error', $message);
        }

        // Create a new connection request
        $connection = Connection::create([
            'requester_id' => $currentUser->id,
            'recipient_id' => $user->id,
            'status' => 'pending'
        ]);

        // Dispatch the connection request event
        event(new ConnectionStatusChanged($connection, 'requested'));

        $message = 'Connection request sent successfully.';
        
        if ($request->wantsJson()) {
            return response()->json([
                'message' => $message,
                'connection' => $connection
            ], Response::HTTP_CREATED);
        }
        
        return back()->with('success', $message);
    }

    /**
     * Accept a connection request.
     *
     * @param  \App\Models\Connection  $connection
     * @return \Illuminate\Http\Response
     */
    public function accept(Request $request, Connection $connection)
    {
        $this->authorize('accept', $connection);

        $connection->update(['status' => 'accepted']);

        // Dispatch the connection accepted event
        event(new ConnectionStatusChanged($connection, 'accepted'));

        $message = 'Connection request accepted successfully.';
        
        if ($request->wantsJson()) {
            return response()->json([
                'message' => $message,
                'connection' => $connection
            ]);
        }
        
        return back()->with('success', $message);
    }

    /**
     * Reject a connection request.
     *
     * @param  \App\Models\Connection  $connection
     * @return \Illuminate\Http\Response
     */
    public function reject(Request $request, Connection $connection)
    {
        $this->authorize('reject', $connection);

        // Store the connection information before deleting
        $connectionData = $connection->toArray();
        
        $connection->delete();

        // Dispatch the connection rejected event
        event(new ConnectionStatusChanged(
            (object)$connectionData, 
            'rejected'
        ));

        $message = 'Connection request rejected successfully.';
        
        if ($request->wantsJson()) {
            return response()->json([
                'message' => $message
            ]);
        }
        
        return back()->with('success', $message);
    }

    /**
     * Remove a connection or withdraw a request.
     *
     * @param  \App\Models\Connection  $connection
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Connection $connection)
    {
        $this->authorize('delete', $connection);

        $connection->delete();

        $message = 'Connection removed successfully.';
        
        if ($request->wantsJson()) {
            return response()->json([
                'message' => $message
            ]);
        }
        
        return back()->with('success', $message);
    }
}
