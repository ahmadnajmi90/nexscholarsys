<?php

namespace App\Http\Controllers\Api\V1\Messaging;

use App\Http\Controllers\Controller;
use App\Http\Requests\Messaging\TypingUpdateRequest;
use App\Models\Messaging\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TypingController extends Controller
{
    /**
     * Update the typing status for a user in a conversation.
     *
     * @param TypingUpdateRequest $request
     * @param Conversation $conversation
     * @return Response
     */
    public function update(TypingUpdateRequest $request, Conversation $conversation)
    {
        $isTyping = $request->boolean('is_typing');
        
        // Broadcast the typing status event
        event(new \App\Events\Messaging\TypingChanged(
            $conversation->id,
            $request->user()->id,
            $isTyping
        ));
        
        return response()->json([
            'success' => true,
            'is_typing' => $isTyping,
        ]);
    }
}
