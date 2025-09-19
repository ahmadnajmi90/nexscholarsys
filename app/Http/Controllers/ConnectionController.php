<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Connection;
use App\Models\ConnectionTag;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ConnectionController extends Controller
{
    /**
     * Display the user's network connections page or return JSON for API requests.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $perPage = 5;
        $tagId = $request->input('tag_id');
        
        // Get user's custom tags and appropriate default tags based on role
        $userTagsQuery = ConnectionTag::where(function($query) use ($user) {
            // Get user's custom tags
            $query->where('user_id', $user->id);
            
            // Get default tags
            $query->orWhere(function($subquery) use ($user) {
                $subquery->whereNull('user_id');
                
                // Hide "Student" tag for non-academicians
                if (!$user->academician) {
                    $subquery->where('name', '!=', 'Student');
                }
            });
        });
        
        // Also include tags that the user has assigned to connections
        $userTagsQuery->orWhereHas('connections', function($query) use ($user) {
            $query->where('connection_tag_user.user_id', $user->id);
        });
        
        $userTags = $userTagsQuery->distinct()
                                 ->orderBy('name')
                                 ->get();
        
        // Get accepted connections (friends) with optional tag filtering
        $acceptedConnectionsQuery = Connection::where(function($query) use ($user) {
                $query->where('requester_id', $user->id)
                    ->orWhere('recipient_id', $user->id);
            })
            ->where('status', 'accepted')
            ->with([
                'requester.academician', 'requester.postgraduate', 'requester.undergraduate',
                'recipient.academician', 'recipient.postgraduate', 'recipient.undergraduate'
            ]);
            
        // Apply tag filtering if a tag_id is provided
        if ($tagId) {
            $acceptedConnectionsQuery->whereHas('tags', function($query) use ($tagId, $user) {
                $query->where('connection_tags.id', $tagId)
                    ->where('connection_tag_user.user_id', $user->id);
            });
        }
        
        // Paginate the results and append query parameters to pagination links
        $acceptedConnections = $acceptedConnectionsQuery->paginate($perPage)->appends(request()->query());
        
        // Transform the paginated results
        $transformedAcceptedConnections = $this->transformConnectionsCollection($acceptedConnections, $user);
        
        // Get pending received requests
        $receivedRequests = Connection::where('recipient_id', $user->id)
            ->where('status', 'pending')
            ->with([
                'requester.academician', 'requester.postgraduate', 'requester.undergraduate'
            ])
            ->paginate($perPage)->appends(request()->query());
            
        $transformedReceivedRequests = $this->transformConnectionsCollection($receivedRequests, $user, 'requester');
        
        // Get pending sent requests
        $sentRequests = Connection::where('requester_id', $user->id)
            ->where('status', 'pending')
            ->with([
                'recipient.academician', 'recipient.postgraduate', 'recipient.undergraduate'
            ])
            ->paginate($perPage)->appends(request()->query());
            
        $transformedSentRequests = $this->transformConnectionsCollection($sentRequests, $user, 'recipient');
        
        // Log the structure to help debug pagination issues
        Log::debug('Pagination structure:', [
            'acceptedConnections' => $transformedAcceptedConnections['meta'] ?? 'No meta data',
            'receivedRequests' => $transformedReceivedRequests['meta'] ?? 'No meta data',
            'sentRequests' => $transformedSentRequests['meta'] ?? 'No meta data',
        ]);
        
        // Handle API requests differently - return JSON response
        if ($request->wantsJson() || $request->is('api/*')) {
            // Check if we need to filter by status
            $status = $request->input('status');
            
            if ($status === 'accepted') {
                return response()->json($transformedAcceptedConnections);
            } elseif ($status === 'received' || $status === 'pending') {
                return response()->json($transformedReceivedRequests);
            } elseif ($status === 'sent') {
                return response()->json($transformedSentRequests);
            }
            
            // Default: return all connections
            return response()->json([
                'accepted' => $transformedAcceptedConnections,
                'received' => $transformedReceivedRequests,
                'sent' => $transformedSentRequests
            ]);
        }
        
        // For web requests, return the Inertia view
        return Inertia::render('Networking/MyConnections', [
            'acceptedConnections' => $transformedAcceptedConnections,
            'receivedRequests' => $transformedReceivedRequests,
            'sentRequests' => $transformedSentRequests,
            'tags' => $userTags,
            'activeTagId' => $tagId ? (int) $tagId : null
        ]);
    }
    
    /**
     * Transform a paginated collection of connections for the frontend
     *
     * @param \Illuminate\Pagination\LengthAwarePaginator $connections
     * @param \App\Models\User $currentUser
     * @param string|null $userRelation
     * @return array
     */
    private function transformConnectionsCollection($connections, $currentUser, $userRelation = null)
    {
        // Get the data from the paginator
        $data = $connections->getCollection()->map(function($connection) use ($currentUser, $userRelation) {
            // Determine which user is the connection (not the current user)
            if ($userRelation) {
                $connectionUser = $connection->$userRelation;
            } else {
                $connectionUser = $connection->requester_id == $currentUser->id 
                    ? $connection->recipient 
                    : $connection->requester;
            }
            
            // Add profile_photo_url to the user object
            $connectionUser = $this->addProfilePhotoUrl($connectionUser);
            
            // Determine the role of the user
            $role = $this->determineUserRole($connectionUser);
            $connectionUser->role = $role;
            
                return [
                    'connection_id' => $connection->id,
                    'status' => $connection->status,
                    'created_at' => $connection->created_at,
                'user' => $connectionUser
                ];
            });
        
        // Return a structure that matches the expected pagination format
        return [
            'data' => $data,
            'links' => $connections->linkCollection()->toArray(),
            'meta' => [
                'current_page' => $connections->currentPage(),
                'from' => $connections->firstItem(),
                'last_page' => $connections->lastPage(),
                'links' => $connections->linkCollection()->toArray(),
                'path' => $connections->path(),
                'per_page' => $connections->perPage(),
                'to' => $connections->lastItem(),
                'total' => $connections->total(),
            ],
        ];
    }
    
    /**
     * Add profile_photo_url to a user object
     *
     * @param \App\Models\User $user
     * @return \App\Models\User
     */
    private function addProfilePhotoUrl($user)
    {
        if (!$user) {
            return $user;
        }
        
        // Check which role-specific profile the user has
        if ($user->academician && $user->academician->profile_picture) {
            $user->profile_photo_url = asset('storage/' . $user->academician->profile_picture);
        } elseif ($user->postgraduate && $user->postgraduate->profile_picture) {
            $user->profile_photo_url = asset('storage/' . $user->postgraduate->profile_picture);
        } elseif ($user->undergraduate && $user->undergraduate->profile_picture) {
            $user->profile_photo_url = asset('storage/' . $user->undergraduate->profile_picture);
        } else {
            $user->profile_photo_url = null;
        }
        
        return $user;
    }
    
    /**
     * Determine the user's role
     *
     * @param \App\Models\User $user
     * @return string|null
     */
    private function determineUserRole($user)
    {
        if ($user->academician) {
            return 'Academician';
        } elseif ($user->postgraduate) {
            return 'Postgraduate';
        } elseif ($user->undergraduate) {
            return 'Undergraduate';
        } elseif ($user->industry) {
            return 'Industry';
        }
        
        return null;
    }
}