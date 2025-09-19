<?php

namespace Tests\Feature\Messaging;

use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use App\Models\Messaging\Message;
use App\Models\Messaging\MessageAttachment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AttachmentAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    /** @test */
    public function authorized_user_can_view_attachment()
    {
        // Create users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        // Create conversation with both users as participants
        $conversation = Conversation::factory()->create(['type' => 'direct']);
        
        ConversationParticipant::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
        ]);
        
        ConversationParticipant::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
        ]);
        
        // Create a message from user1
        $message = Message::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'type' => 'text',
            'body' => 'Test message with attachment'
        ]);
        
        // Create a fake file
        $file = UploadedFile::fake()->image('test.jpg', 100, 100);
        $path = $file->store("messaging/attachments/{$conversation->id}", 'public');
        
        // Create attachment record
        $attachment = MessageAttachment::create([
            'message_id' => $message->id,
            'disk' => 'public',
            'path' => $path,
            'mime' => 'image/jpeg',
            'bytes' => $file->getSize(),
        ]);
        
        // Test authorized access (user2 is a participant)
        $response = $this->actingAs($user2)
            ->get(route('messaging.attachments.show', ['attachment' => $attachment->id]));
        
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'image/jpeg');
    }
    
    /** @test */
    public function unauthorized_user_cannot_view_attachment()
    {
        // Create users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create(); // Not a participant
        
        // Create conversation with only user1 and user2 as participants
        $conversation = Conversation::factory()->create(['type' => 'direct']);
        
        ConversationParticipant::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
        ]);
        
        ConversationParticipant::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
        ]);
        
        // Create a message from user1
        $message = Message::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'type' => 'text',
            'body' => 'Test message with attachment'
        ]);
        
        // Create a fake file
        $file = UploadedFile::fake()->image('test.jpg', 100, 100);
        $path = $file->store("messaging/attachments/{$conversation->id}", 'public');
        
        // Create attachment record
        $attachment = MessageAttachment::create([
            'message_id' => $message->id,
            'disk' => 'public',
            'path' => $path,
            'mime' => 'image/jpeg',
            'bytes' => $file->getSize(),
        ]);
        
        // Test unauthorized access (user3 is not a participant)
        $response = $this->actingAs($user3)
            ->get(route('messaging.attachments.show', ['attachment' => $attachment->id]));
        
        $response->assertStatus(403);
    }
}

