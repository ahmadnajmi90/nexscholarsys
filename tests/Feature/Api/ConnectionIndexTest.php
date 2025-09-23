<?php

namespace Tests\Feature\Api;

use App\Models\Connection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConnectionIndexTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_list_their_accepted_connections()
    {
        // Create users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        // Create accepted connections
        Connection::create([
            'requester_id' => $user1->id,
            'recipient_id' => $user2->id,
            'status' => 'accepted'
        ]);

        Connection::create([
            'requester_id' => $user1->id,
            'recipient_id' => $user3->id,
            'status' => 'accepted'
        ]);

        // Create pending connection (should not be included)
        Connection::create([
            'requester_id' => $user1->id,
            'recipient_id' => User::factory()->create()->id,
            'status' => 'pending'
        ]);

        // Test the API endpoint
        $response = $this->actingAs($user1, 'web')
            ->getJson('/api/v1/app/connections');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'connection_id',
                        'status',
                        'created_at',
                        'user' => [
                            'id',
                            'full_name',
                            'avatar_url'
                        ]
                    ]
                ],
                'links',
                'meta'
            ]);

        // Should return 2 accepted connections
        $this->assertCount(2, $response->json('data'));

        // Verify the response contains the correct users
        $userIds = collect($response->json('data'))->pluck('user.id');
        $this->assertContains($user2->id, $userIds);
        $this->assertContains($user3->id, $userIds);
    }

    /** @test */
    public function user_can_search_their_connections()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create(['name' => 'John Doe']);
        $user3 = User::factory()->create(['name' => 'Jane Smith']);

        // Create accepted connections
        Connection::create([
            'requester_id' => $user1->id,
            'recipient_id' => $user2->id,
            'status' => 'accepted'
        ]);

        Connection::create([
            'requester_id' => $user1->id,
            'recipient_id' => $user3->id,
            'status' => 'accepted'
        ]);

        // Search for "John"
        $response = $this->actingAs($user1, 'web')
            ->getJson('/api/v1/app/connections?q=John');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));

        $foundUser = $response->json('data.0.user');
        $this->assertEquals($user2->id, $foundUser['id']);
        $this->assertStringContains('John', $foundUser['full_name']);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_connections()
    {
        $response = $this->getJson('/api/v1/app/connections');

        $response->assertStatus(401);
    }
}
