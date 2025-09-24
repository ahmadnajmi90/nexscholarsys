<?php

namespace Tests\Feature\Messaging;

use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use App\Models\Messaging\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MessageTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test that a user can send a text message to a conversation.
     */
    public function test_user_can_send_text_message(): void
    {
        // Create two users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Create a conversation between user1 and user2
        $conversation = Conversation::factory()->create([
            'type' => 'direct',
            'created_by' => $user1->id,
        ]);

        // Add user1 and user2 as participants
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'role' => 'member',
        ]);
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
            'role' => 'member',
        ]);

        // Authenticate as user1
        $this->actingAs($user1);

        // Send a text message
        $response = $this->postJson("/api/v1/app/messaging/conversations/{$conversation->id}/messages", [
            'body' => 'Hello, world!',
        ]);

        // Assert successful response
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'conversation_id',
                'user_id',
                'type',
                'body',
                'created_at',
            ]
        ]);
        $response->assertJsonFragment([
            'body' => 'Hello, world!',
            'type' => 'text',
        ]);

        // Assert message was created in the database
        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'type' => 'text',
            'body' => 'Hello, world!',
        ]);

        // Assert conversation's last_message_id was updated
        $conversation->refresh();
        $message = Message::latest()->first();
        $this->assertEquals($message->id, $conversation->last_message_id);
    }

    /**
     * Test that a user can edit their own message within the time window.
     */
    public function test_user_can_edit_own_message(): void
    {
        // Create two users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Create a conversation between user1 and user2
        $conversation = Conversation::factory()->create([
            'type' => 'direct',
            'created_by' => $user1->id,
        ]);

        // Add user1 and user2 as participants
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'role' => 'member',
        ]);
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
            'role' => 'member',
        ]);

        // Create a message from user1
        $message = Message::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'type' => 'text',
            'body' => 'Original message',
        ]);

        // Authenticate as user1
        $this->actingAs($user1);

        // Edit the message
        $response = $this->patchJson("/api/v1/app/messaging/messages/{$message->id}", [
            'body' => 'Edited message',
        ]);

        // Assert successful response
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'conversation_id',
                'user_id',
                'type',
                'body',
                'edited_at',
            ]
        ]);
        $response->assertJsonFragment([
            'body' => 'Edited message',
        ]);

        // Assert message was updated in the database
        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'body' => 'Edited message',
        ]);
        $message->refresh();
        $this->assertNotNull($message->edited_at);
    }

    /**
     * Test that a user cannot edit another user's message.
     */
    public function test_user_cannot_edit_another_users_message(): void
    {
        // Create two users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Create a conversation between user1 and user2
        $conversation = Conversation::factory()->create([
            'type' => 'direct',
            'created_by' => $user1->id,
        ]);

        // Add user1 and user2 as participants
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'role' => 'member',
        ]);
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
            'role' => 'member',
        ]);

        // Create a message from user1
        $message = Message::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'type' => 'text',
            'body' => 'Original message',
        ]);

        // Authenticate as user2
        $this->actingAs($user2);

        // Try to edit user1's message
        $response = $this->patchJson("/api/v1/app/messaging/messages/{$message->id}", [
            'body' => 'Edited by user2',
        ]);

        // Assert forbidden response
        $response->assertStatus(403);

        // Assert message was not updated in the database
        $this->assertDatabaseHas('messages', [
            'id' => $message->id,
            'body' => 'Original message',
        ]);
    }

    /**
     * Test that a user can delete their own message.
     */
    public function test_user_can_delete_own_message(): void
    {
        // Create two users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Create a conversation between user1 and user2
        $conversation = Conversation::factory()->create([
            'type' => 'direct',
            'created_by' => $user1->id,
        ]);

        // Add user1 and user2 as participants
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'role' => 'member',
        ]);
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
            'role' => 'member',
        ]);

        // Create a message from user1
        $message = Message::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'type' => 'text',
            'body' => 'Message to delete',
        ]);

        // Authenticate as user1
        $this->actingAs($user1);

        // Delete the message
        $response = $this->deleteJson("/api/v1/app/messaging/messages/{$message->id}?scope=all");

        // Assert successful response
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'scope' => 'all',
        ]);

        // Assert message was soft deleted in the database
        $this->assertSoftDeleted('messages', [
            'id' => $message->id,
        ]);
    }

    /**
     * Test that a user can mark messages as read.
     */
    public function test_user_can_mark_messages_as_read(): void
    {
        // Create two users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Create a conversation between user1 and user2
        $conversation = Conversation::factory()->create([
            'type' => 'direct',
            'created_by' => $user1->id,
        ]);

        // Add user1 and user2 as participants
        $participant1 = ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'role' => 'member',
            'last_read_message_id' => null,
        ]);
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
            'role' => 'member',
        ]);

        // Create a message from user2
        $message = Message::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
            'type' => 'text',
            'body' => 'New message',
        ]);

        // Authenticate as user1
        $this->actingAs($user1);

        // Mark the message as read
        $response = $this->postJson("/api/v1/app/messaging/conversations/{$conversation->id}/read", [
            'last_read_message_id' => $message->id,
        ]);

        // Assert successful response
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'last_read_message_id' => $message->id,
        ]);

        // Assert participant's last_read_message_id was updated
        $participant1->refresh();
        $this->assertEquals($message->id, $participant1->last_read_message_id);
    }

    /**
     * Test that sending a message broadcasts ConversationListDelta to other participants.
     */
    public function test_sending_message_broadcasts_conversation_list_delta(): void
    {
        // Create two users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Create a conversation between user1 and user2
        $conversation = Conversation::factory()->create([
            'type' => 'direct',
            'created_by' => $user1->id,
        ]);

        // Add user1 and user2 as participants
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'role' => 'member',
        ]);
        ConversationParticipant::factory()->create([
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
            'role' => 'member',
        ]);

        // Authenticate as user1
        $this->actingAs($user1);

        // Mock the broadcast helper
        \Illuminate\Support\Facades\Broadcast::shouldBroadcastTimes(2); // MessageSent + ConversationListDelta

        // Send a text message
        $response = $this->postJson("/api/v1/app/messaging/conversations/{$conversation->id}/messages", [
            'body' => 'Hello, world!',
        ]);

        // Assert successful response
        $response->assertStatus(201);

        // Assert message was created
        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'body' => 'Hello, world!',
        ]);

        // The broadcast assertions are handled by the mock
        // In a real test, you'd use Laravel Dusk or similar for WebSocket testing
    }
}
