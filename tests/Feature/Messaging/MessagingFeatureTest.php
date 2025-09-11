<?php

namespace Tests\Feature\Messaging;

use App\Models\User;
use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use App\Models\Messaging\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class MessagingFeatureTest extends TestCase
{
    use RefreshDatabase;

    private $user1;
    private $user2;
    private $user3;
    private $directConversation;
    private $groupConversation;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->user1 = User::create([
            'name' => 'Test User 1',
            'email' => 'user1@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $this->user2 = User::create([
            'name' => 'Test User 2',
            'email' => 'user2@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $this->user3 = User::create([
            'name' => 'Test User 3',
            'email' => 'user3@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create direct conversation
        $this->directConversation = Conversation::create([
            'type' => 'direct',
            'created_by' => $this->user1->id,
        ]);

        ConversationParticipant::create([
            'conversation_id' => $this->directConversation->id,
            'user_id' => $this->user1->id,
            'role' => 'member',
            'joined_at' => now(),
        ]);

        ConversationParticipant::create([
            'conversation_id' => $this->directConversation->id,
            'user_id' => $this->user2->id,
            'role' => 'member',
            'joined_at' => now(),
        ]);

        // Create group conversation
        $this->groupConversation = Conversation::create([
            'type' => 'group',
            'title' => 'Test Group',
            'created_by' => $this->user1->id,
        ]);

        ConversationParticipant::create([
            'conversation_id' => $this->groupConversation->id,
            'user_id' => $this->user1->id,
            'role' => 'owner',
            'joined_at' => now(),
        ]);

        ConversationParticipant::create([
            'conversation_id' => $this->groupConversation->id,
            'user_id' => $this->user2->id,
            'role' => 'member',
            'joined_at' => now(),
        ]);

        ConversationParticipant::create([
            'conversation_id' => $this->groupConversation->id,
            'user_id' => $this->user3->id,
            'role' => 'member',
            'joined_at' => now(),
        ]);
    }

    /** @test */
    public function user_can_send_message_to_conversation()
    {
        $response = $this->actingAs($this->user1)
            ->postJson("/api/v1/app/messaging/messages/{$this->directConversation->id}", [
                'type' => 'text',
                'body' => 'Test message',
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'conversation_id',
                    'user_id',
                    'type',
                    'body',
                    'created_at',
                ]
            ]);

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $this->directConversation->id,
            'user_id' => $this->user1->id,
            'body' => 'Test message',
            'type' => 'text',
        ]);
    }

    /** @test */
    public function unauthorized_user_cannot_send_message_to_conversation()
    {
        $unauthorizedUser = User::create([
            'name' => 'Unauthorized User',
            'email' => 'unauthorized@example.com',
            'password' => Hash::make('password'),
        ]);

        $response = $this->actingAs($unauthorizedUser)
            ->postJson("/api/v1/app/messaging/messages/{$this->directConversation->id}", [
                'type' => 'text',
                'body' => 'Unauthorized message',
            ]);

        $response->assertStatus(403);

        $this->assertDatabaseMissing('messages', [
            'body' => 'Unauthorized message',
        ]);
    }

    /** @test */
    public function user_can_paginate_messages_with_before_id()
    {
        // Create 50 messages for pagination testing
        $messages = [];
        for ($i = 0; $i < 50; $i++) {
            $message = Message::create([
                'conversation_id' => $this->directConversation->id,
                'user_id' => $this->user1->id,
                'type' => 'text',
                'body' => "Message {$i}",
                'created_at' => now()->subMinutes(50 - $i), // Reverse chronological order
            ]);
            $messages[] = $message;
        }

        // Test pagination with before_id
        $beforeMessage = $messages[25]; // Get middle message

        $response = $this->actingAs($this->user1)
            ->getJson("/api/v1/app/messaging/messages/{$this->directConversation->id}?before_id={$beforeMessage->id}&limit=10");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'conversation_id',
                        'user_id',
                        'type',
                        'body',
                        'created_at',
                    ]
                ]
            ]);

        $responseData = $response->json('data');
        $this->assertCount(10, $responseData);

        // Verify messages are in correct order (newest first)
        $this->assertEquals('Message 24', $responseData[0]['body']);
        $this->assertEquals('Message 15', $responseData[9]['body']);
    }

    /** @test */
    public function user_can_mark_messages_as_read()
    {
        $message = Message::create([
            'conversation_id' => $this->directConversation->id,
            'user_id' => $this->user1->id,
            'type' => 'text',
            'body' => 'Test message',
        ]);

        $participant = $this->directConversation->getParticipant($this->user2->id);

        $response = $this->actingAs($this->user2)
            ->postJson("/api/v1/app/messaging/messages/{$this->directConversation->id}/read-all");

        $response->assertStatus(200);

        // Refresh participant from database
        $participant->refresh();
        $this->assertEquals($message->id, $participant->last_read_message_id);
    }

    /** @test */
    public function user_can_edit_message_within_time_window()
    {
        $message = Message::create([
            'conversation_id' => $this->directConversation->id,
            'user_id' => $this->user1->id,
            'type' => 'text',
            'body' => 'Original message',
            'created_at' => now(), // Just created
        ]);

        $response = $this->actingAs($this->user1)
            ->patchJson("/api/v1/app/messaging/messages/{$message->id}", [
                'body' => 'Edited message',
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'body',
                ]
            ]);

        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'body' => 'Edited message',
        ]);
    }

    /** @test */
    public function user_cannot_edit_message_after_time_window()
    {
        // Create message that's older than edit window
        $oldTime = now()->subMinutes(20); // Assuming 15-minute window

        $message = Message::create([
            'conversation_id' => $this->directConversation->id,
            'user_id' => $this->user1->id,
            'type' => 'text',
            'body' => 'Old message',
            'created_at' => $oldTime,
            'updated_at' => $oldTime,
        ]);

        $response = $this->actingAs($this->user1)
            ->patchJson("/api/v1/app/messaging/messages/{$message->id}", [
                'body' => 'Attempted edit',
            ]);

        $response->assertStatus(403);

        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'body' => 'Old message', // Should remain unchanged
        ]);
    }

    /** @test */
    public function user_can_delete_message_within_time_window()
    {
        $message = Message::create([
            'conversation_id' => $this->directConversation->id,
            'user_id' => $this->user1->id,
            'type' => 'text',
            'body' => 'Message to delete',
            'created_at' => now(), // Just created
        ]);

        $response = $this->actingAs($this->user1)
            ->deleteJson("/api/v1/app/messaging/messages/{$message->id}");

        $response->assertStatus(200);

        // Message should be soft deleted
        $this->assertSoftDeleted('messages', [
            'id' => $message->id,
        ]);
    }

    /** @test */
    public function user_cannot_delete_message_after_time_window()
    {
        // Create message that's older than delete window
        $oldTime = now()->subMinutes(70); // Assuming 60-minute window

        $message = Message::create([
            'conversation_id' => $this->directConversation->id,
            'user_id' => $this->user1->id,
            'type' => 'text',
            'body' => 'Old message to delete',
            'created_at' => $oldTime,
            'updated_at' => $oldTime,
        ]);

        $response = $this->actingAs($this->user1)
            ->deleteJson("/api/v1/app/messaging/messages/{$message->id}");

        $response->assertStatus(403);

        // Message should not be deleted
        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'deleted_at' => null,
        ]);
    }

    /** @test */
    public function admin_can_delete_any_message()
    {
        $message = Message::create([
            'conversation_id' => $this->groupConversation->id,
            'user_id' => $this->user2->id, // Not the admin
            'type' => 'text',
            'body' => 'Message to delete by admin',
            'created_at' => now()->subMinutes(70), // Older than window
        ]);

        $response = $this->actingAs($this->user1) // Admin/owner
            ->deleteJson("/api/v1/app/messaging/messages/{$message->id}");

        $response->assertStatus(200);

        // Message should be soft deleted even though it's old
        $this->assertSoftDeleted('messages', [
            'id' => $message->id,
        ]);
    }

    /** @test */
    public function user_cannot_access_non_participant_conversation()
    {
        $unauthorizedUser = User::create([
            'name' => 'Unauthorized User',
            'email' => 'unauthorized@example.com',
            'password' => Hash::make('password'),
        ]);

        // Try to view conversation
        $response = $this->actingAs($unauthorizedUser)
            ->getJson("/api/v1/app/messaging/messages/{$this->directConversation->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function user_can_create_direct_conversation()
    {
        $response = $this->actingAs($this->user1)
            ->postJson('/api/v1/app/messaging/conversations', [
                'type' => 'direct',
                'user_id' => $this->user3->id,
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'type',
                    'participants',
                ]
            ]);

        $conversation = Conversation::find($response->json('data.id'));
        $this->assertEquals('direct', $conversation->type);
        $this->assertCount(2, $conversation->participants);
    }

    /** @test */
    public function user_can_create_group_conversation()
    {
        $response = $this->actingAs($this->user1)
            ->postJson('/api/v1/app/messaging/conversations', [
                'type' => 'group',
                'title' => 'New Group',
                'members' => [$this->user2->id, $this->user3->id],
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'type',
                    'title',
                    'participants',
                ]
            ]);

        $conversation = Conversation::find($response->json('data.id'));
        $this->assertEquals('group', $conversation->type);
        $this->assertEquals('New Group', $conversation->title);
        $this->assertCount(3, $conversation->participants);
    }

    /** @test */
    public function pagination_handles_edge_cases()
    {
        // Test with no messages
        $response = $this->actingAs($this->user1)
            ->getJson("/api/v1/app/messaging/messages/{$this->directConversation->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [],
            ]);

        // Test with invalid before_id
        $response = $this->actingAs($this->user1)
            ->getJson("/api/v1/app/messaging/messages/{$this->directConversation->id}?before_id=999999");

        $response->assertStatus(200);
        // Should return empty or handle gracefully
    }

    /** @test */
    public function validation_fails_with_invalid_data()
    {
        // Test missing type
        $response = $this->actingAs($this->user1)
            ->postJson("/api/v1/app/messaging/messages/{$this->directConversation->id}", [
                'body' => 'Test message',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);

        // Test invalid message type
        $response = $this->actingAs($this->user1)
            ->postJson("/api/v1/app/messaging/messages/{$this->directConversation->id}", [
                'type' => 'invalid_type',
                'body' => 'Test message',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);

        // Test empty text message
        $response = $this->actingAs($this->user1)
            ->postJson("/api/v1/app/messaging/messages/{$this->directConversation->id}", [
                'type' => 'text',
                'body' => '',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['body']);
    }
}
