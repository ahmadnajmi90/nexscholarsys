<?php

namespace App\Http\Controllers\Messaging;

use App\Http\Controllers\Controller;
use App\Http\Requests\Messaging\CreateConversationRequest;
use App\Http\Requests\Messaging\UpdateConversationRequest;
use App\Http\Resources\Messaging\ConversationResource;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ConversationController extends Controller
{
    /**
     * Create a new conversation (direct or group).
     *
     * @param  \App\Http\Requests\Messaging\CreateConversationRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(CreateConversationRequest $request)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            // Create the conversation
            $conversation = Conversation::create([
                'type' => $validated['type'],
                'title' => $validated['title'] ?? null,
                'created_by' => Auth::id(),
            ]);

            // Add the creator as owner
            ConversationParticipant::create([
                'conversation_id' => $conversation->id,
                'user_id' => Auth::id(),
                'role' => 'owner',
                'joined_at' => now(),
            ]);

            // Add other participants
            if (isset($validated['participants'])) {
                foreach ($validated['participants'] as $participantId) {
                    // Skip if it's the creator (already added)
                    if ($participantId == Auth::id()) {
                        continue;
                    }

                    ConversationParticipant::create([
                        'conversation_id' => $conversation->id,
                        'user_id' => $participantId,
                        'role' => 'member',
                        'joined_at' => now(),
                    ]);
                }
            }

            // Load relationships for the response
            $conversation->load(['participants.user', 'lastMessage']);

            return new ConversationResource($conversation);
        });
    }

    /**
     * Display a specific conversation.
     *
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Inertia\Response
     */
    public function show(Conversation $conversation)
    {
        // Authorize that the user can view this conversation
        $this->authorize('view', $conversation);

        // Load conversation with all necessary relationships
        $conversation->load([
            'participants.user',
            'messages' => function ($query) {
                $query->with('sender', 'attachments')
                      ->orderBy('created_at', 'desc')
                      ->limit(50); // Load last 50 messages
            },
            'messages.replies',
            'messages.replies.sender'
        ]);

        // Get participants for this conversation (excluding current user for display)
        $participants = $conversation->participants->map(function ($participant) {
            return [
                'id' => $participant->id,
                'user' => $participant->user,
                'role' => $participant->role,
                'joined_at' => $participant->joined_at,
                'last_read_message_id' => $participant->last_read_message_id,
            ];
        });

        return Inertia::render('Messaging/Show', [
            'conversation' => $conversation,
            'participants' => $participants,
        ]);
    }

    /**
     * Update a conversation (title, etc.).
     *
     * @param  \App\Http\Requests\Messaging\UpdateConversationRequest  $request
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateConversationRequest $request, Conversation $conversation)
    {
        $this->authorize('update', $conversation);

        $validated = $request->validated();

        $conversation->update($validated);

        return new ConversationResource($conversation->load(['participants.user', 'lastMessage']));
    }

    /**
     * Add participants to a group conversation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function addParticipants(Request $request, Conversation $conversation)
    {
        $this->authorize('addParticipant', $conversation);

        $request->validate([
            'participants' => 'required|array',
            'participants.*' => 'exists:users,id',
        ]);

        $participants = collect($request->participants)
            ->unique()
            ->filter(fn($userId) => $userId != Auth::id()) // Remove current user
            ->values();

        DB::transaction(function () use ($conversation, $participants) {
            foreach ($participants as $participantId) {
                // Check if participant already exists
                $existing = ConversationParticipant::where([
                    'conversation_id' => $conversation->id,
                    'user_id' => $participantId,
                ])->first();

                if ($existing) {
                    // If they left, reactivate them
                    if ($existing->left_at) {
                        $existing->update([
                            'left_at' => null,
                            'joined_at' => now(),
                        ]);
                    }
                    // If they're already active, do nothing
                } else {
                    // Add new participant
                    ConversationParticipant::create([
                        'conversation_id' => $conversation->id,
                        'user_id' => $participantId,
                        'role' => 'member',
                        'joined_at' => now(),
                    ]);
                }
            }
        });

        return new ConversationResource($conversation->load(['participants.user', 'lastMessage']));
    }

    /**
     * Remove a participant from a group conversation.
     *
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @param  int  $userId
     * @return \Illuminate\Http\JsonResponse
     */
    public function removeParticipant(Conversation $conversation, int $userId)
    {
        $this->authorize('removeParticipant', $conversation);

        // Cannot remove yourself if you're the owner (you should delete the conversation instead)
        if ($userId == Auth::id()) {
            $participant = $conversation->getParticipant(Auth::id());
            if ($participant && $participant->role === 'owner') {
                return response()->json([
                    'message' => 'Owners cannot remove themselves. Please delete the conversation instead.'
                ], 400);
            }
        }

        $participant = ConversationParticipant::where([
            'conversation_id' => $conversation->id,
            'user_id' => $userId,
        ])->first();

        if ($participant) {
            // If they're active, mark as left
            if ($participant->isActive()) {
                $participant->update(['left_at' => now()]);
            }
        }

        return new ConversationResource($conversation->load(['participants.user', 'lastMessage']));
    }

    /**
     * Leave a conversation.
     *
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function leave(Conversation $conversation)
    {
        $this->authorize('leave', $conversation);

        $participant = $conversation->getParticipant(Auth::id());

        if ($participant && $participant->isActive()) {
            $participant->update(['left_at' => now()]);
        }

        return response()->json(['message' => 'Successfully left the conversation.']);
    }

    /**
     * Archive a conversation.
     *
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function archive(Conversation $conversation)
    {
        $this->authorize('view', $conversation);

        $participant = $conversation->getParticipant(Auth::id());

        if ($participant) {
            $participant->update(['pinned' => false]); // Unpin when archiving
        }

        $conversation->update(['is_archived' => true]);

        return new ConversationResource($conversation->load(['participants.user', 'lastMessage']));
    }

    /**
     * Unarchive a conversation.
     *
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function unarchive(Conversation $conversation)
    {
        $this->authorize('view', $conversation);

        $conversation->update(['is_archived' => false]);

        return new ConversationResource($conversation->load(['participants.user', 'lastMessage']));
    }

    /**
     * Pin a conversation.
     *
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function pin(Conversation $conversation)
    {
        $this->authorize('view', $conversation);

        $participant = $conversation->getParticipant(Auth::id());

        if ($participant) {
            $participant->update(['pinned' => true]);
        }

        return new ConversationResource($conversation->load(['participants.user', 'lastMessage']));
    }

    /**
     * Unpin a conversation.
     *
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function unpin(Conversation $conversation)
    {
        $this->authorize('view', $conversation);

        $participant = $conversation->getParticipant(Auth::id());

        if ($participant) {
            $participant->update(['pinned' => false]);
        }

        return new ConversationResource($conversation->load(['participants.user', 'lastMessage']));
    }

    /**
     * Mute a conversation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function mute(Request $request, Conversation $conversation)
    {
        $this->authorize('view', $conversation);

        $request->validate([
            'duration' => 'nullable|integer|min:1|max:525600', // Max 1 year in minutes
        ]);

        $participant = $conversation->getParticipant(Auth::id());

        if ($participant) {
            $mutedUntil = $request->duration 
                ? now()->addMinutes($request->duration) 
                : now()->addYear(); // Default to 1 year

            $participant->update(['muted_until' => $mutedUntil]);
        }

        return new ConversationResource($conversation->load(['participants.user', 'lastMessage']));
    }

    /**
     * Unmute a conversation.
     *
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function unmute(Conversation $conversation)
    {
        $this->authorize('view', $conversation);

        $participant = $conversation->getParticipant(Auth::id());

        if ($participant) {
            $participant->update(['muted_until' => null]);
        }

        return new ConversationResource($conversation->load(['participants.user', 'lastMessage']));
    }
}