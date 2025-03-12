<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillsTableSeeder extends Seeder
{
    public function run()
    {
        $skills = [
            'Programming Skills',
            'Data Analysis',
            'Machine Learning',
            'Artificial Intelligence',
            'Web Development',
            // add more skills as needed...
        ];

        foreach ($skills as $skillName) {
            Skill::create(['name' => $skillName]);
        }
    }
}

