<?php

namespace App\Http\Controllers\Messaging;

use App\Http\Controllers\Controller;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MessagingController extends Controller
{
    /**
     * Display the messaging index page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get user's conversations with participants and latest message
        $conversations = Conversation::whereHas('participants', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->with([
                'participants.user',
                'lastMessage.sender'
            ])
            ->orderByRaw('
                CASE
                    WHEN last_message_id IS NULL THEN 1
                    ELSE 0
                END,
                updated_at DESC
            ')
            ->get();

        return Inertia::render('Messaging/Index', [
            'conversations' => $conversations,
        ]);
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
                      ->orderBy('created_at', 'asc');
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
}