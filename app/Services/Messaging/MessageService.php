<?php

namespace App\Services\Messaging;

use App\Models\Messaging\Conversation;
use App\Models\Messaging\Message;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MessageService
{
    /**
     * @var AttachmentService
     */
    protected $attachmentService;

    /**
     * MessageService constructor.
     *
     * @param AttachmentService $attachmentService
     */
    public function __construct(AttachmentService $attachmentService)
    {
        $this->attachmentService = $attachmentService;
    }

    /**
     * Send a message to a conversation.
     *
     * @param Conversation $conversation
     * @param User $user
     * @param array $data
     * @param array $files
     * @return Message
     */
    public function send(Conversation $conversation, User $user, array $data, array $files = []): Message
    {
        return DB::transaction(function () use ($conversation, $user, $data, $files) {
            // Create the message
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'user_id' => $user->id,
                'type' => empty($files) ? 'text' : (count($files) === 1 && $this->isImage($files[0]) ? 'image' : 'file'),
                'body' => $data['body'] ?? null,
                'reply_to_id' => $data['reply_to_id'] ?? null,
                'delivered_at' => now(),
                'meta' => isset($data['client_id']) ? ['client_id' => $data['client_id']] : null,
            ]);
            
            // Process attachments if any
            if (!empty($files)) {
                foreach ($files as $file) {
                    $this->attachmentService->store($message, $file);
                }
            }
            
            // Update the conversation's last message
            $conversation->update(['last_message_id' => $message->id]);

            // Update the sender's last_read_message_id to mark as read
            $conversation->participants()
                ->where('user_id', $user->id)
                ->update(['last_read_message_id' => $message->id]);

            // Load relationships for the response
            $message->load(['sender', 'attachments']);

            return $message;
        });
    }
    
    /**
     * Update a message.
     *
     * @param Message $message
     * @param array $data
     * @return Message
     */
    public function update(Message $message, array $data): Message
    {
        return DB::transaction(function () use ($message, $data) {
            // Update the message
            $message->update([
                'body' => $data['body'],
                'edited_at' => now(),
            ]);
            
            return $message->fresh();
        });
    }
    
    /**
     * Delete a message.
     *
     * @param Message $message
     * @param string $scope 'me' or 'all'
     * @param User $user
     * @return bool
     */
    public function delete(Message $message, string $scope, User $user): bool
    {
        if ($scope === 'all') {
            // Delete for everyone
            $message->delete();
            
            // If this was the conversation's last message, update to previous message
            $conversation = $message->conversation;
            if ($conversation->last_message_id === $message->id) {
                $previousMessage = Message::where('conversation_id', $conversation->id)
                    ->where('id', '!=', $message->id)
                    ->orderBy('created_at', 'desc')
                    ->first();
                    
                $conversation->update(['last_message_id' => $previousMessage->id ?? null]);
            }
            
            return true;
        } else {
            // Delete for current user only (future implementation)
            // For now, just return true
            return true;
        }
    }
    
    /**
     * Get messages for a conversation with pagination.
     *
     * @param Conversation $conversation
     * @param array $filters
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getMessagesForConversation(Conversation $conversation, array $filters = [])
    {
        $query = Message::where('conversation_id', $conversation->id)
            ->with([
                // Load sender and role profiles (select only keys + fields needed)
                'sender:id,name,unique_id',
                'sender.academician:academician_id,full_name,profile_picture',
                'sender.postgraduate:postgraduate_id,full_name,profile_picture',
                'sender.undergraduate:undergraduate_id,full_name,profile_picture',

                // Existing relations
                'attachments',
                'replyTo:id,conversation_id,user_id,type,body,created_at,edited_at',
                'replyTo.sender:id,name,unique_id',
                'replyTo.sender.academician:academician_id,full_name,profile_picture',
                'replyTo.sender.postgraduate:postgraduate_id,full_name,profile_picture',
                'replyTo.sender.undergraduate:undergraduate_id,full_name,profile_picture',
            ]);
        
        // Apply cursor pagination if 'before' is provided
        if (!empty($filters['before'])) {
            $beforeMessage = Message::find($filters['before']);
            if ($beforeMessage) {
                $query->where(function ($q) use ($beforeMessage) {
                    $q->where('created_at', '<', $beforeMessage->created_at)
                        ->orWhere(function ($q2) use ($beforeMessage) {
                            $q2->where('created_at', '=', $beforeMessage->created_at)
                                ->where('id', '<', $beforeMessage->id);
                        });
                });
            }
        }
        
        // Order by newest first for cursor pagination
        $query->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc');
        
        // Apply limit
        $limit = $filters['limit'] ?? 50;
        $query->limit($limit);
        
        return $query->get();
    }
    
    /**
     * Check if a file is an image.
     *
     * @param UploadedFile $file
     * @return bool
     */
    protected function isImage(UploadedFile $file): bool
    {
        return str_starts_with($file->getMimeType(), 'image/');
    }
}
