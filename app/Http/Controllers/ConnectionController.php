<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ConnectionController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the user's connections.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Get accepted connections (friends)
        $friends = Connection::where('type', 'friendship')
            ->where('status', 'accepted')
            ->where(function ($query) use ($user) {
                $query->where('user_one_id', $user->id)
                      ->orWhere('user_two_id', $user->id);
            })
            ->with(['userOne', 'userTwo'])
            ->get()
            ->map(function ($connection) use ($user) {
                $friend = $connection->user_one_id === $user->id 
                    ? $connection->userTwo 
                    : $connection->userOne;
                
                // Get the related profile based on the user's roles
                $profile = $this->getUserProfile($friend);
                
                return [
                    'connection_id' => $connection->id,
                    'user_id' => $friend->id,
                    'name' => $friend->name,
                    'email' => $friend->email,
                    'profile' => $profile,
                    'created_at' => $connection->created_at,
                ];
            });
        
        // Get pending incoming friend requests
        $pendingRequests = Connection::where('type', 'friendship')
            ->where('status', 'pending')
            ->where('user_two_id', $user->id)
            ->with('userOne')
            ->get()
            ->map(function ($connection) {
                $requester = $connection->userOne;
                $profile = $this->getUserProfile($requester);
                
                return [
                    'connection_id' => $connection->id,
                    'user_id' => $requester->id,
                    'name' => $requester->name,
                    'email' => $requester->email,
                    'profile' => $profile,
                    'created_at' => $connection->created_at,
                ];
            });
        
        return Inertia::render('Connections/Index', [
            'friends' => $friends,
            'pendingRequests' => $pendingRequests,
            'bookmarks' => [], // Add empty bookmarks array for backward compatibility
        ]);
    }

    /**
     * Send a friend request to another user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendFriendRequest(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();
        $targetUser = User::findOrFail($request->user_id);
        
        // Prevent sending request to self
        if ($user->id === $targetUser->id) {
            return response()->json([
                'message' => 'Cannot send a friend request to yourself',
            ], 422);
        }
        
        // Check if a connection already exists
        $existingConnection = Connection::where('type', 'friendship')
            ->where(function ($query) use ($user, $targetUser) {
                $query->where(function ($q) use ($user, $targetUser) {
                    $q->where('user_one_id', $user->id)
                      ->where('user_two_id', $targetUser->id);
                })->orWhere(function ($q) use ($user, $targetUser) {
                    $q->where('user_one_id', $targetUser->id)
                      ->where('user_two_id', $user->id);
                });
            })
            ->first();
        
        if ($existingConnection) {
            $status = $existingConnection->status;
            
            if ($status === 'accepted') {
                return response()->json([
                    'message' => 'You are already connected with this user',
                    'status' => 'accepted',
                ]);
            } elseif ($status === 'pending') {
                // If the request was from the target user to the current user
                if ($existingConnection->user_one_id === $targetUser->id) {
                    // Accept the request automatically
                    $existingConnection->status = 'accepted';
                    $existingConnection->save();
                    
                    return response()->json([
                        'message' => 'Friend request accepted',
                        'status' => 'accepted',
                    ]);
                } else {
                    return response()->json([
                        'message' => 'Friend request already sent',
                        'status' => 'pending',
                    ]);
                }
            } elseif ($status === 'rejected' || $status === 'blocked') {
                // Allow re-sending if previously rejected
                if ($existingConnection->user_one_id === $user->id) {
                    $existingConnection->status = 'pending';
                    $existingConnection->save();
                    
                    return response()->json([
                        'message' => 'Friend request sent',
                        'status' => 'pending',
                    ]);
                } else {
                    return response()->json([
                        'message' => 'Cannot send request to this user',
                        'status' => 'blocked',
                    ], 403);
                }
            }
        }
        
        // Create a new connection request
        $connection = new Connection();
        $connection->user_one_id = $user->id;
        $connection->user_two_id = $targetUser->id;
        $connection->type = 'friendship';
        $connection->status = 'pending';
        $connection->save();
        
        return response()->json([
            'message' => 'Friend request sent successfully',
            'status' => 'pending',
            'connection' => $connection,
        ]);
    }

    /**
     * Accept a friend request.
     *
     * @param  \App\Models\Connection  $connection
     * @return \Illuminate\Http\JsonResponse
     */
    public function acceptFriendRequest(Connection $connection)
    {
        $user = Auth::user();
        
        // Ensure the authenticated user is the recipient of this request
        if ($connection->user_two_id !== $user->id || $connection->type !== 'friendship' || $connection->status !== 'pending') {
            return response()->json([
                'message' => 'Invalid request',
            ], 403);
        }
        
        $connection->status = 'accepted';
        $connection->save();
        
        return response()->json([
            'message' => 'Friend request accepted',
            'connection' => $connection,
        ]);
    }

    /**
     * Reject a friend request.
     *
     * @param  \App\Models\Connection  $connection
     * @return \Illuminate\Http\JsonResponse
     */
    public function rejectFriendRequest(Connection $connection)
    {
        $user = Auth::user();
        
        // Ensure the authenticated user is the recipient of this request
        if ($connection->user_two_id !== $user->id || $connection->type !== 'friendship' || $connection->status !== 'pending') {
            return response()->json([
                'message' => 'Invalid request',
            ], 403);
        }
        
        $connection->delete();
        
        return response()->json([
            'message' => 'Friend request rejected',
        ]);
    }

    /**
     * Remove a friendship connection.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeConnection(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();
        $targetUser = User::findOrFail($request->user_id);
        
        // Find the friendship connection
        $connection = Connection::where('type', 'friendship')
            ->where('status', 'accepted')
            ->where(function ($query) use ($user, $targetUser) {
                $query->where(function ($q) use ($user, $targetUser) {
                    $q->where('user_one_id', $user->id)
                      ->where('user_two_id', $targetUser->id);
                })->orWhere(function ($q) use ($user, $targetUser) {
                    $q->where('user_one_id', $targetUser->id)
                      ->where('user_two_id', $user->id);
                });
            })
            ->first();
        
        if (!$connection) {
            return response()->json([
                'message' => 'Connection not found',
            ], 404);
        }
        
        $connection->delete();
        
        return response()->json([
            'message' => 'Connection removed successfully',
        ]);
    }

    /**
     * Get connections based on type and status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getConnections(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:friendship,bookmark,supervision',
            'status' => 'nullable|string|in:pending,accepted,rejected,blocked',
        ]);

        $user = Auth::user();
        $type = $request->type;
        $status = $request->status ?? 'accepted';
        
        $query = Connection::where('type', $type)
            ->where('status', $status);
        
        if ($type === 'bookmark') {
            // For bookmarks, only show those initiated by the user
            $query->where('user_one_id', $user->id);
        } else {
            // For other types, show connections where user is either initiator or recipient
            $query->where(function ($q) use ($user) {
                $q->where('user_one_id', $user->id)
                  ->orWhere('user_two_id', $user->id);
            });
        }
        
        $connections = $query->with(['userOne', 'userTwo'])
            ->get()
            ->map(function ($connection) use ($user, $type) {
                // For bookmarks, we always want user_two
                // For other types, we want the other user in the connection
                $otherUser = $type === 'bookmark' 
                    ? $connection->userTwo 
                    : ($connection->user_one_id === $user->id ? $connection->userTwo : $connection->userOne);
                
                $profile = $this->getUserProfile($otherUser);
                
                return [
                    'connection_id' => $connection->id,
                    'user_id' => $otherUser->id,
                    'name' => $otherUser->name,
                    'email' => $otherUser->email,
                    'profile' => $profile,
                    'initiator' => $connection->user_one_id === $user->id,
                    'created_at' => $connection->created_at,
                ];
            });
        
        return response()->json([
            'connections' => $connections,
        ]);
    }

    /**
     * Check the connection status between the authenticated user and another user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkConnectionStatus(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();
        $targetUser = User::findOrFail($request->user_id);
        
        // Default status
        $status = [
            'connection_exists' => false,
            'is_friend' => false,
            'is_bookmarked' => false,
            'request_sent' => false,
            'request_received' => false,
        ];
        
        // Check for bookmark
        $bookmarkExists = Connection::where([
            'user_one_id' => $user->id,
            'user_two_id' => $targetUser->id,
            'type' => 'bookmark',
            'status' => 'accepted',
        ])->exists();
        
        if ($bookmarkExists) {
            $status['is_bookmarked'] = true;
            $status['connection_exists'] = true;
        }
        
        // Check for friendship
        $friendship = Connection::where('type', 'friendship')
            ->where(function ($query) use ($user, $targetUser) {
                $query->where(function ($q) use ($user, $targetUser) {
                    $q->where('user_one_id', $user->id)
                      ->where('user_two_id', $targetUser->id);
                })->orWhere(function ($q) use ($user, $targetUser) {
                    $q->where('user_one_id', $targetUser->id)
                      ->where('user_two_id', $user->id);
                });
            })
            ->first();
        
        if ($friendship) {
            $status['connection_exists'] = true;
            
            if ($friendship->status === 'accepted') {
                $status['is_friend'] = true;
            } elseif ($friendship->status === 'pending') {
                if ($friendship->user_one_id === $user->id) {
                    $status['request_sent'] = true;
                } else {
                    $status['request_received'] = true;
                }
            }
        }
        
        return response()->json($status);
    }

    /**
     * Helper method to get a user's profile data.
     *
     * @param  \App\Models\User  $user
     * @return array|null
     */
    private function getUserProfile(User $user)
    {
        if ($user->academician) {
            return [
                'id' => $user->academician->id,
                'type' => 'academician',
                'full_name' => $user->academician->full_name,
                'profile_picture' => $user->academician->profile_picture,
                'current_position' => $user->academician->current_position,
                'url' => $user->academician->url,
            ];
        } elseif ($user->postgraduate) {
            return [
                'id' => $user->postgraduate->id,
                'type' => 'postgraduate',
                'full_name' => $user->postgraduate->full_name,
                'profile_picture' => $user->postgraduate->profile_picture,
                'research_title' => $user->postgraduate->research_title,
                'url' => $user->postgraduate->url,
            ];
        } elseif ($user->undergraduate) {
            return [
                'id' => $user->undergraduate->id,
                'type' => 'undergraduate',
                'full_name' => $user->undergraduate->full_name,
                'profile_picture' => $user->undergraduate->profile_picture,
                'university' => $user->undergraduate->university,
                'url' => $user->undergraduate->url,
            ];
        } elseif ($user->industry) {
            return [
                'id' => $user->industry->id,
                'type' => 'industry',
                'full_name' => $user->industry->full_name,
                'profile_picture' => $user->industry->profile_picture,
                'company' => $user->industry->company,
                'url' => $user->industry->url,
            ];
        }
        
        return null;
    }
} 