<?php

namespace Database\Factories;

use App\Models\Postgraduate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Postgraduate>
 */
class PostgraduateFactory extends Factory
{
    protected $model = Postgraduate::class;

    public function definition(): array
    {
        return [
            'postgraduate_id' => function () {
                $user = User::factory()->create();

                $user->unique_id = $user->unique_id ?? $user->id;
                $user->save();

                return $user->unique_id;
            },
            'full_name' => $this->faker->name(),
            'previous_degree' => $this->faker->randomElement(['BSc', 'BA', 'BEng']),
            'bachelor' => $this->faker->sentence(3),
            'CGPA_bachelor' => $this->faker->randomFloat(2, 2.50, 4.00),
            'profile_picture' => null,
            'nationality' => $this->faker->country(),
            'english_proficiency_level' => 'IELTS',
            'matric_no' => Str::upper($this->faker->bothify('??#####')),
            'suggested_research_title' => $this->faker->sentence(6),
            'suggested_research_description' => $this->faker->paragraph(),
            'field_of_research' => [$this->faker->word(), $this->faker->word()],
            'bio' => $this->faker->paragraph(),
        ];
    }
}

