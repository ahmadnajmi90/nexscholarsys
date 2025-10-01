<?php

namespace Database\Factories;

use App\Models\SupervisionMeeting;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupervisionMeetingFactory extends Factory
{
    protected $model = SupervisionMeeting::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(5),
            'scheduled_for' => now()->addDays(3),
            'location_link' => $this->faker->url(),
            'agenda' => $this->faker->paragraph(),
            'attachments' => [],
        ];
    }
}

