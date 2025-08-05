<?php

namespace App\Http\Controllers;

use App\Models\Connection;
use App\Models\ConnectionTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class ConnectionTagController extends Controller
{
    /**
     * Get all available connection tags.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();
        
        // Always return all default tags and user's custom tags
        // The frontend modal will handle visibility of the Student tag based on user role
        $tags = ConnectionTag::where(function($query) use ($user) {
            $query->whereNull('user_id')
                  ->orWhere('user_id', $user->id);
        })
        ->orderBy('name')
        ->get();
        
        return response()->json($tags);
    }
    
    /**
     * Store a newly created tag in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:50|unique:connection_tags,name',
        ]);
        
        $user = Auth::user();
        
        $tag = new ConnectionTag();
        $tag->name = $request->name;
        $tag->user_id = $user->id;
        $tag->save();
        
        return response()->json([
            'message' => 'Tag created successfully',
            'tag' => $tag
        ], 201);
    }

    /**
     * Get tags assigned to a specific connection by the authenticated user.
     *
     * @param  \App\Models\Connection  $connection
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTags(Connection $connection)
    {
        $user = Auth::user();

        // Ensure the current user is part of the connection before proceeding
        if ($user->id !== $connection->requester_id && $user->id !== $connection->recipient_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Use the relationship defined in the Connection model
        $tags = $connection->tags()
                          ->wherePivot('user_id', $user->id)
                          ->get();

        return response()->json($tags);
    }

    /**
     * Assign tags to one or more connections.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function assignTags(Request $request)
    {
        $request->validate([
            'connection_ids' => 'required|array',
            'connection_ids.*' => 'exists:connections,id',
            'tag_ids' => 'present|array',
            'tag_ids.*' => 'exists:connection_tags,id',
        ]);

        $user = Auth::user();
        $connectionIds = $request->input('connection_ids');
        $tagIds = $request->input('tag_ids');

        // Check if the Student tag is being assigned and if the user is authorized
        $studentTag = ConnectionTag::where('name', 'Student')->first();
        if ($studentTag && in_array($studentTag->id, $tagIds)) {
            if (!$user->academician) {
                throw new AuthorizationException('Only academicians can assign the Student tag.');
            }
        }

        // First, remove all existing tags for these connections by this user
        DB::table('connection_tag_user')
            ->where('user_id', $user->id)
            ->whereIn('connection_id', $connectionIds)
            ->delete();

        // Then, add the new tags
        $records = [];
        $now = now();

        foreach ($connectionIds as $connectionId) {
            foreach ($tagIds as $tagId) {
                $records[] = [
                    'connection_id' => $connectionId,
                    'user_id' => $user->id,
                    'connection_tag_id' => $tagId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('connection_tag_user')->insert($records);

        return response()->json([
            'message' => 'Tags assigned successfully',
        ]);
    }
}