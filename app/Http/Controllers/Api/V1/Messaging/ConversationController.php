<?php

namespace App\Http\Controllers\Api\V1\Messaging;

use App\Http\Controllers\Controller;
use App\Http\Requests\Messaging\ConversationStoreRequest;
use App\Http\Resources\Messaging\ConversationResource;
use App\Models\Messaging\Conversation;
use App\Services\Messaging\ConversationService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ConversationController extends Controller
{
    /**
     * @var ConversationService
     */
    protected $conversationService;

    /**
     * ConversationController constructor.
     *
     * @param ConversationService $conversationService
     */
    public function __construct(ConversationService $conversationService)
    {
        $this->conversationService = $conversationService;
    }

    /**
     * Display a listing of the conversations.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $filters = $request->only(['q', 'archived', 'per_page']);
        $conversations = $this->conversationService->getConversationsForUser($request->user(), $filters);
        
        return ConversationResource::collection($conversations);
    }

    /**
     * Store a newly created conversation.
     *
     * @param ConversationStoreRequest $request
     * @return ConversationResource
     */
    public function store(ConversationStoreRequest $request)
    {
        $conversation = $this->conversationService->create(
            $request->validated(),
            $request->user()
        );
        
        $conversation->load(['participants.user', 'lastMessage']);
        
        return new ConversationResource($conversation);
    }

    /**
     * Display the specified conversation.
     *
     * @param Conversation $conversation
     * @return ConversationResource
     */
    public function show(Conversation $conversation)
    {
        $this->authorize('view', $conversation);
        
        $conversation->load([
            'participants.user', 
            'participants.user.academician:academician_id,full_name,profile_picture',
            'participants.user.postgraduate:postgraduate_id,full_name,profile_picture',
            'participants.user.undergraduate:undergraduate_id,full_name,profile_picture',
            'lastMessage',
            'lastMessage.sender',
            'lastMessage.sender.academician:academician_id,full_name,profile_picture',
            'lastMessage.sender.postgraduate:postgraduate_id,full_name,profile_picture',
            'lastMessage.sender.undergraduate:undergraduate_id,full_name,profile_picture',
        ]);
        
        return new ConversationResource($conversation);
    }

    /**
     * Toggle archive status for a conversation.
     *
     * @param Conversation $conversation
     * @param Request $request
     * @return Response
     */
    public function archive(Conversation $conversation, Request $request)
    {
        $this->authorize('archive', $conversation);
        
        $participant = $this->conversationService->toggleArchive($conversation, $request->user());
        
        return response()->json([
            'success' => true,
            'archived' => $participant->archived_at !== null,
            'archived_at' => $participant->archived_at,
        ]);
    }
}
