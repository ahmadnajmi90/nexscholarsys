<?php

namespace Database\Factories\Messaging;

use App\Models\Messaging\ConversationParticipant;
use App\Models\Messaging\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Messaging\ConversationParticipant>
 */
class ConversationParticipantFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ConversationParticipant::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'conversation_id' => Conversation::factory(),
            'user_id' => User::factory(),
            'role' => 'member',
            'last_read_message_id' => null,
            'pinned' => $this->faker->boolean(20), // 20% chance of being pinned
            'muted_until' => $this->faker->boolean(10) ? $this->faker->dateTimeBetween('now', '+7 days') : null,
            'joined_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'left_at' => null,
        ];
    }

    /**
     * Create a conversation owner.
     */
    public function owner(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'owner',
        ]);
    }

    /**
     * Create a conversation admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }

    /**
     * Create a regular member.
     */
    public function member(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'member',
        ]);
    }

    /**
     * Create a participant who has left the conversation.
     */
    public function left(): static
    {
        return $this->state(fn (array $attributes) => [
            'left_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ]);
    }

    /**
     * Create a pinned conversation for this participant.
     */
    public function pinned(): static
    {
        return $this->state(fn (array $attributes) => [
            'pinned' => true,
        ]);
    }

    /**
     * Create a muted conversation for this participant.
     */
    public function muted(): static
    {
        return $this->state(fn (array $attributes) => [
            'muted_until' => $this->faker->dateTimeBetween('now', '+1 week'),
        ]);
    }
}