<?php

namespace Database\Factories\Messaging;

use App\Models\Messaging\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Messaging\Conversation>
 */
class ConversationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Conversation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['direct', 'group']);
        
        return [
            'type' => $type,
            'title' => $type === 'group' ? $this->faker->words(3, true) . ' Discussion' : null,
            'icon_path' => null,
            'created_by' => User::factory(),
            'last_message_id' => null, // Will be set after messages are created
            'is_archived' => $this->faker->boolean(10), // 10% chance of being archived
        ];
    }

    /**
     * Create a direct conversation between two users.
     */
    public function direct(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'direct',
            'title' => null,
        ]);
    }

    /**
     * Create a group conversation.
     */
    public function group(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'group',
            'title' => $this->faker->words(3, true) . ' Group',
        ]);
    }

    /**
     * Create an archived conversation.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_archived' => true,
        ]);
    }
}