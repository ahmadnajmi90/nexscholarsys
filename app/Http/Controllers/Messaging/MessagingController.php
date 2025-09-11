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
        return Inertia::render('Messaging/Index');
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

        return Inertia::render('Messaging/Show', [
            'conversation' => $conversation,
        ]);
    }
}