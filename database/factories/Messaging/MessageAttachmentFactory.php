<?php

namespace Database\Factories\Messaging;

use App\Models\Messaging\MessageAttachment;
use App\Models\Messaging\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Messaging\MessageAttachment>
 */
class MessageAttachmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = MessageAttachment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isImage = $this->faker->boolean(60); // 60% chance of being an image
        
        if ($isImage) {
            $width = $this->faker->numberBetween(400, 2000);
            $height = $this->faker->numberBetween(300, 1500);
            $extension = $this->faker->randomElement(['jpg', 'png', 'gif']);
            $mime = "image/$extension";
            $filename = $this->faker->uuid() . ".$extension";
        } else {
            $width = null;
            $height = null;
            $extension = $this->faker->randomElement(['pdf', 'docx', 'xlsx', 'txt']);
            $mime = match($extension) {
                'pdf' => 'application/pdf',
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'txt' => 'text/plain',
                default => 'application/octet-stream',
            };
            $filename = $this->faker->words(2, true) . ".$extension";
        }

        return [
            'message_id' => Message::factory(),
            'disk' => 'public',
            'path' => "messaging/attachments/$filename",
            'mime' => $mime,
            'bytes' => $this->faker->numberBetween(1024, 5242880), // 1KB to 5MB
            'width' => $width,
            'height' => $height,
            'meta' => $isImage ? [
                'thumbnail_path' => "messaging/thumbnails/thumb_$filename",
            ] : null,
        ];
    }

    /**
     * Create an image attachment.
     */
    public function image(): static
    {
        return $this->state(function (array $attributes) {
            $extension = $this->faker->randomElement(['jpg', 'png', 'gif', 'webp']);
            $filename = $this->faker->uuid() . ".$extension";
            
            return [
                'path' => "messaging/images/$filename",
                'mime' => "image/$extension",
                'bytes' => $this->faker->numberBetween(50000, 2097152), // 50KB to 2MB
                'width' => $this->faker->numberBetween(400, 2000),
                'height' => $this->faker->numberBetween(300, 1500),
                'meta' => [
                    'thumbnail_path' => "messaging/thumbnails/thumb_$filename",
                ],
            ];
        });
    }

    /**
     * Create a document attachment.
     */
    public function document(): static
    {
        return $this->state(function (array $attributes) {
            $extension = $this->faker->randomElement(['pdf', 'docx', 'xlsx', 'pptx']);
            $filename = $this->faker->words(2, true) . ".$extension";
            
            return [
                'path' => "messaging/documents/$filename",
                'mime' => match($extension) {
                    'pdf' => 'application/pdf',
                    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    default => 'application/octet-stream',
                },
                'bytes' => $this->faker->numberBetween(10240, 10485760), // 10KB to 10MB
                'width' => null,
                'height' => null,
                'meta' => null,
            ];
        });
    }

    /**
     * Create a small file attachment.
     */
    public function small(): static
    {
        return $this->state(fn (array $attributes) => [
            'bytes' => $this->faker->numberBetween(1024, 102400), // 1KB to 100KB
        ]);
    }

    /**
     * Create a large file attachment.
     */
    public function large(): static
    {
        return $this->state(fn (array $attributes) => [
            'bytes' => $this->faker->numberBetween(1048576, 10485760), // 1MB to 10MB
        ]);
    }
}