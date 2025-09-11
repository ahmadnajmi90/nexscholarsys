<?php

namespace App\Http\Controllers\Messaging;

use App\Http\Controllers\Controller;
use App\Http\Requests\Messaging\SendMessageRequest;
use App\Http\Resources\Messaging\MessageResource;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\Message;
use App\Models\Messaging\ConversationParticipant;
use App\Services\Messaging\AttachmentService;
use App\Events\MessageSent;
use App\Events\MessageUpdated;
use App\Events\ConversationRead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    protected AttachmentService $attachmentService;

    public function __construct(AttachmentService $attachmentService)
    {
        $this->attachmentService = $attachmentService;
    }
    /**
     * Send a new message to a conversation.
     *
     * @param  \App\Http\Requests\Messaging\SendMessageRequest  $request
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(SendMessageRequest $request, Conversation $conversation)
    {
        // Authorize that the user can create messages in this conversation
        $this->authorize('create', [Message::class, $conversation]);

        $validated = $request->validated();

        $message = DB::transaction(function () use ($conversation, $validated) {
            // Create the message
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'user_id' => Auth::id(),
                'type' => $validated['type'] ?? 'text',
                'body' => $validated['body'] ?? null,
                'reply_to_id' => $validated['reply_to_id'] ?? null,
            ]);

            // Process attachments if any
            if (isset($validated['attachments']) && is_array($validated['attachments'])) {
                $this->attachmentService->processMultipleAttachments(
                    $validated['attachments'],
                    $message->id,
                    $conversation->id
                );

                // Update message type if it has attachments
                if ($message->type === 'text' && !empty($validated['attachments'])) {
                    $firstAttachment = $validated['attachments'][0];
                    if ($firstAttachment->getMimeType() && str_starts_with($firstAttachment->getMimeType(), 'image/')) {
                        $message->update(['type' => 'image']);
                    } else {
                        $message->update(['type' => 'file']);
                    }
                }
            }

            // Update the conversation's last message
            $conversation->update(['last_message_id' => $message->id]);

            // Mark as read by the sender
            $participant = $conversation->getParticipant(Auth::id());
            if ($participant) {
                $participant->markAsRead($message->id);
                // Broadcast read event
                broadcast(new ConversationRead($participant))->toOthers();
            }

            return $message;
        });

        // Load relationships for the response
        $message->load(['sender', 'attachments', 'replyTo.sender']);

        // Broadcast the message
        broadcast(new MessageSent($message))->toOthers();

        // Return JSON response with the created message
        return response()->json([
            'data' => new MessageResource($message->load(['sender', 'attachments', 'replyTo.sender']))
        ]);
    }

    /**
     * Get messages for a conversation with keyset pagination.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, Conversation $conversation)
    {
        // Authorize that the user can view messages in this conversation
        $this->authorize('view', $conversation);

        $request->validate([
            'before_id' => 'nullable|integer|exists:messages,id',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $limit = $request->limit ?? 20;
        $beforeId = $request->before_id;

        // Get the before message if provided
        $beforeMessage = $beforeId ? Message::find($beforeId) : null;

        $query = Message::forConversation($conversation->id)
            ->with(['sender', 'attachments', 'replyTo.sender'])
            ->latestFirst();

        // Apply keyset pagination if before message is provided
        if ($beforeMessage) {
            $query->before($beforeMessage->created_at, $beforeMessage->id);
        }

        $messages = $query->paginate($limit);

        // Mark conversation as read
        $participant = $conversation->getParticipant(Auth::id());
        if ($participant && $messages->isNotEmpty()) {
            $lastMessage = $messages->first();
            if ($participant->last_read_message_id === null || 
                $lastMessage->id > $participant->last_read_message_id) {
                $participant->markAsRead($lastMessage->id);
                // Broadcast read event
                broadcast(new ConversationRead($participant))->toOthers();
            }
        }

        return MessageResource::collection($messages);
    }

    /**
     * Update a message (edit).
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Messaging\Message  $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Message $message)
    {
        // Authorize that the user can update this message
        $this->authorize('update', $message);

        $request->validate([
            'body' => 'required|string|max:10000',
        ]);

        // Check if message can still be edited
        if (!$message->canBeEditedBy(Auth::id())) {
            return response()->json([
                'message' => 'Message cannot be edited anymore.'
            ], 403);
        }

        $message->update([
            'body' => $request->body,
        ]);

        // Broadcast the update
        broadcast(new MessageUpdated($message, 'edited'))->toOthers();

        return new MessageResource($message->load(['sender', 'attachments', 'replyTo.sender']));
    }

    /**
     * Delete a message.
     *
     * @param  \App\Models\Messaging\Message  $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Message $message)
    {
        // Authorize that the user can delete this message
        $this->authorize('delete', $message);

        // Check if message can still be deleted
        if (!$message->canBeDeletedBy(Auth::id())) {
            return response()->json([
                'message' => 'Message cannot be deleted anymore.'
            ], 403);
        }

        // Soft delete the message
        $message->delete();

        // Broadcast the deletion
        broadcast(new MessageUpdated($message, 'deleted'))->toOthers();

        return response()->json(['message' => 'Message deleted successfully.']);
    }

    /**
     * Mark a message as read.
     *
     * @param  \App\Models\Messaging\Message  $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead(Message $message)
    {
        $conversation = $message->conversation;

        // Authorize that the user can view this conversation
        $this->authorize('view', $conversation);

        $participant = $conversation->getParticipant(Auth::id());

        if ($participant) {
            $participant->markAsRead($message->id);
            // Broadcast read event
            broadcast(new ConversationRead($participant))->toOthers();
        }

        return response()->json(['message' => 'Message marked as read.']);
    }

    /**
     * Mark all messages in a conversation as read.
     *
     * @param  \App\Models\Messaging\Conversation  $conversation
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAllAsRead(Conversation $conversation)
    {
        // Authorize that the user can view this conversation
        $this->authorize('view', $conversation);

        $participant = $conversation->getParticipant(Auth::id());

        if ($participant && $conversation->lastMessage) {
            $participant->markAsRead($conversation->lastMessage->id);
            // Broadcast read event
            broadcast(new ConversationRead($participant))->toOthers();
        }

        return response()->json(['message' => 'All messages marked as read.']);
    }

    /**
     * React to a message.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Messaging\Message  $message
     * @return \Illuminate\Http\JsonResponse
     */
    public function react(Request $request, Message $message)
    {
        // Authorize that the user can react to this message
        $this->authorize('react', $message);

        $request->validate([
            'reaction' => 'required|string|max:20',
        ]);

        // For now, we'll just return a success response
        // In a full implementation, you would store reactions in a separate table
        return response()->json(['message' => 'Reaction added.']);
    }
}