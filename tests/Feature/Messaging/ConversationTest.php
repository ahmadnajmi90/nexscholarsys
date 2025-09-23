<?php

namespace Tests\Feature\Messaging;

use App\Models\Messaging\Conversation;
use App\Models\Messaging\ConversationParticipant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ConversationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test that a user can create a direct conversation.
     */
    public function test_user_can_create_direct_conversation(): void
    {
        // Create two users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        // Authenticate as user1
        $this->actingAs($user1);

        // Create a direct conversation
        $response = $this->postJson('/api/v1/app/messaging/conversations', [
            'type' => 'direct',
            'user_id' => $user2->id,
        ]);

        // Assert successful response
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'type',
                'title',
                'created_by',
                'participants',
                'unread_count',
            ]
        ]);

        // Assert conversation was created in the database
        $this->assertDatabaseHas('conversations', [
            'type' => 'direct',
            'created_by' => $user1->id,
        ]);

        // Assert both users are participants
        $conversation = Conversation::latest()->first();
        $this->assertDatabaseHas('conversation_participants', [
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
        ]);
        $this->assertDatabaseHas('conversation_participants', [
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
        ]);
    }

    /**
     * Test that a user can create a group conversation.
     */
    public function test_user_can_create_group_conversation(): void
    {
        // Create three users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        // Authenticate as user1
        $this->actingAs($user1);

        // Create a group conversation
        $response = $this->postJson('/api/v1/app/messaging/conversations', [
            'type' => 'group',
            'title' => 'Test Group',
            'user_ids' => [$user2->id, $user3->id],
        ]);

        // Assert successful response
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'type',
                'title',
                'created_by',
                'participants',
                'unread_count',
            ]
        ]);

        // Assert conversation was created in the database
        $this->assertDatabaseHas('conversations', [
            'type' => 'group',
            'title' => 'Test Group',
            'created_by' => $user1->id,
        ]);

        // Assert all users are participants
        $conversation = Conversation::latest()->first();
        $this->assertDatabaseHas('conversation_participants', [
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
            'role' => 'owner',
        ]);
        $this->assertDatabaseHas('conversation_participants', [
            'conversation_id' => $conversation->id,
            'user_id' => $user2->id,
            'role' => 'member',
        ]);
        $this->assertDatabaseHas('conversation_participants', [
            'conversation_id' => $conversation->id,
            'user_id' => $user3->id,
            'role' => 'member',
        ]);
    }

    /**
     * Test that a user cannot access a conversation they are not a participant of.
     */
    public function test_user_cannot_access_conversation_they_are_not_participant_of(): void
    {
        // Create two users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create(); // Not a participant

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

        // Authenticate as user3 (not a participant)
        $this->actingAs($user3);

        // Try to access the conversation
        $response = $this->getJson("/api/v1/app/messaging/conversations/{$conversation->id}");

        // Assert forbidden response
        $response->assertStatus(403);
    }

    /**
     * Test that a user can toggle archive status of a conversation.
     */
    public function test_user_can_toggle_archive_status(): void
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

        // Archive the conversation
        $response = $this->postJson("/api/v1/app/messaging/conversations/{$conversation->id}/archive");

        // Assert successful response
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'archived' => true,
        ]);

        // Assert the conversation is archived for user1 only
        $this->assertDatabaseHas('conversation_participants', [
            'conversation_id' => $conversation->id,
            'user_id' => $user1->id,
        ]);
        $participant = ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $user1->id)
            ->first();
        $this->assertNotNull($participant->archived_at);

        // Assert the conversation is not archived for user2
        $participant2 = ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $user2->id)
            ->first();
        $this->assertNull($participant2->archived_at);

        // Unarchive the conversation
        $response = $this->postJson("/api/v1/app/messaging/conversations/{$conversation->id}/archive");

        // Assert successful response
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'archived' => false,
        ]);

        // Assert the conversation is no longer archived for user1
        $participant = ConversationParticipant::where('conversation_id', $conversation->id)
            ->where('user_id', $user1->id)
            ->first();
        $this->assertNull($participant->archived_at);
    }
}
