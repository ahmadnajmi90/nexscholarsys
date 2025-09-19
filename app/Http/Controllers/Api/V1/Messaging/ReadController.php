<?php

namespace App\Http\Controllers\Api\V1\Messaging;

use App\Http\Controllers\Controller;
use App\Http\Requests\Messaging\ReadUpdateRequest;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReadController extends Controller
{
    /**
     * Update the read status for a conversation.
     *
     * @param ReadUpdateRequest $request
     * @param Conversation $conversation
     * @return Response
     */
    public function update(ReadUpdateRequest $request, Conversation $conversation)
    {
        $participant = ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $request->user()->id)
            ->first();
            
        if (!$participant) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a participant in this conversation.',
            ], 403);
        }
        
        $participant->update([
            'last_read_message_id' => $request->input('last_read_message_id'),
        ]);
        
        // Broadcast the read receipt event
        event(new \App\Events\Messaging\ReadAdvanced(
            $conversation->id,
            $request->user()->id,
            $request->input('last_read_message_id')
        ));
        
        return response()->json([
            'success' => true,
            'last_read_message_id' => $participant->last_read_message_id,
        ]);
    }
}
