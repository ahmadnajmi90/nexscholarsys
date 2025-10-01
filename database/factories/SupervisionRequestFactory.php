<?php

namespace Database\Factories;

use App\Models\SupervisionRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupervisionRequestFactory extends Factory
{
    protected $model = SupervisionRequest::class;

    public function definition(): array
    {
        return [
            'student_id' => 'PG-' . $this->faker->unique()->numerify('#####'),
            'academician_id' => 'AC-' . $this->faker->unique()->numerify('#####'),
            'proposal_title' => $this->faker->sentence(6),
            'motivation' => $this->faker->paragraph(),
            'status' => SupervisionRequest::STATUS_PENDING,
            'submitted_at' => now(),
        ];
    }
}

