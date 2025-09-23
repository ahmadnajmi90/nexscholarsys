<?php

namespace App\Http\Controllers\Api\V1\Messaging;

use App\Http\Controllers\Controller;
use App\Http\Requests\Messaging\MessageStoreRequest;
use App\Http\Requests\Messaging\MessageUpdateRequest;
use App\Http\Resources\Messaging\MessageResource;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\Message;
use App\Services\Messaging\MessageService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class MessageController extends Controller
{
    /**
     * @var MessageService
     */
    protected $messageService;

    /**
     * MessageController constructor.
     *
     * @param MessageService $messageService
     */
    public function __construct(MessageService $messageService)
    {
        $this->messageService = $messageService;
    }

    /**
     * Display a listing of messages in a conversation.
     *
     * @param Conversation $conversation
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Conversation $conversation, Request $request)
    {
        $this->authorize('view', $conversation);
        
        $filters = $request->only(['before', 'limit']);
        $messages = $this->messageService->getMessagesForConversation($conversation, $filters);
        
        // Get the ID of the oldest message for pagination
        $nextBefore = $messages->count() > 0 ? $messages->last()->id : null;
        
        return MessageResource::collection($messages)
            ->additional([
                'meta' => [
                    'next_before' => $nextBefore,
                    'has_more' => $messages->count() >= ($filters['limit'] ?? 50),
                ],
            ]);
    }

    /**
     * Store a newly created message in storage.
     *
     * @param MessageStoreRequest $request
     * @param Conversation $conversation
     * @return MessageResource
     */
    public function store(MessageStoreRequest $request, Conversation $conversation)
    {
        $message = $this->messageService->send(
            $conversation,
            $request->user(),
            $request->validated(),
            $request->file('files') ?? []
        );
        
        return new MessageResource($message);
    }

    /**
     * Update the specified message.
     *
     * @param MessageUpdateRequest $request
     * @param Message $message
     * @return MessageResource
     */
    public function update(MessageUpdateRequest $request, Message $message)
    {
        $message = $this->messageService->update($message, $request->validated());
        
        return new MessageResource($message);
    }

    /**
     * Remove the specified message.
     *
     * @param Message $message
     * @param Request $request
     * @return Response
     */
    public function destroy(Message $message, Request $request)
    {
        $scope = $request->query('scope', 'me');
        
        if ($scope === 'all') {
            $this->authorize('deleteForEveryone', $message);
        } else {
            $this->authorize('deleteForMe', $message);
        }
        
        $this->messageService->delete($message, $scope, $request->user());
        
        return response()->json([
            'success' => true,
            'scope' => $scope,
        ]);
    }
}
