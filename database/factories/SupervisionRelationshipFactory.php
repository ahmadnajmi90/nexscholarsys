<?php

namespace Database\Factories;

use App\Models\SupervisionRelationship;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupervisionRelationshipFactory extends Factory
{
    protected $model = SupervisionRelationship::class;

    public function definition(): array
    {
        return [
            'student_id' => 'PG-' . $this->faker->unique()->numerify('#####'),
            'academician_id' => 'AC-' . $this->faker->unique()->numerify('#####'),
            'role' => SupervisionRelationship::ROLE_MAIN,
            'status' => SupervisionRelationship::STATUS_ACTIVE,
            'start_date' => now()->toDateString(),
            'accepted_at' => now(),
        ];
    }
}

