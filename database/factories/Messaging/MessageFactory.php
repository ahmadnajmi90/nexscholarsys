<?php

namespace Database\Factories\Messaging;

use App\Models\Messaging\Message;
use App\Models\Messaging\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Messaging\Message>
 */
class MessageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Message::class;

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
            'type' => 'text',
            'body' => $this->faker->realText($this->faker->numberBetween(20, 200)),
            'reply_to_id' => null,
            'delivered_at' => $this->faker->dateTimeBetween('-1 hour', 'now'),
            'read_at' => $this->faker->boolean(70) ? $this->faker->dateTimeBetween('-30 minutes', 'now') : null,
        ];
    }

    /**
     * Create a text message.
     */
    public function text(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'text',
            'body' => $this->faker->realText($this->faker->numberBetween(10, 300)),
        ]);
    }

    /**
     * Create an image message.
     */
    public function image(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'image',
            'body' => $this->faker->optional(0.3)->sentence(),
        ]);
    }

    /**
     * Create a file message.
     */
    public function file(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'file',
            'body' => $this->faker->optional(0.4)->sentence(),
        ]);
    }

    /**
     * Create a system message.
     */
    public function system(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'system',
            'body' => $this->faker->randomElement([
                'User joined the conversation',
                'User left the conversation',
                'Conversation title was changed',
                'User was added to the conversation',
                'User was removed from the conversation',
            ]),
        ]);
    }

    /**
     * Create a reply to another message.
     */
    public function reply(): static
    {
        return $this->state(fn (array $attributes) => [
            'reply_to_id' => Message::factory(),
            'body' => $this->faker->randomElement([
                'Thanks!',
                'Got it',
                'Sounds good',
                'I agree',
                'Let me check on that',
            ]) . ' ' . $this->faker->optional(0.6)->sentence(),
        ]);
    }

    /**
     * Create an unread message.
     */
    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'read_at' => null,
        ]);
    }

    /**
     * Create a recent message.
     */
    public function recent(): static
    {
        return $this->state(fn (array $attributes) => [
            'created_at' => $this->faker->dateTimeBetween('-2 hours', 'now'),
            'delivered_at' => $this->faker->dateTimeBetween('-2 hours', 'now'),
        ]);
    }
}