<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FieldOfResearchSeeder extends Seeder
{
    public function run()
    {
        DB::table('field_of_research')->insert([
            ['name' => 'Agricultural Sciences'],
            ['name' => 'Astronomy and Astrophysics'],
            ['name' => 'Biological Sciences'],
            ['name' => 'Business and Management'],
            ['name' => 'Chemical Sciences'],
            ['name' => 'Civil Engineering'],
            ['name' => 'Computer Science'],
            ['name' => 'Creative Arts and Writing'],
            ['name' => 'Earth Sciences'],
            ['name' => 'Economics'],
            ['name' => 'Education'],
            ['name' => 'Electrical and Electronic Engineering'],
            ['name' => 'Environmental Sciences'],
            ['name' => 'Health Sciences'],
            ['name' => 'History'],
            ['name' => 'Humanities and Social Sciences'],
            ['name' => 'Law and Legal Studies'],
            ['name' => 'Library and Information Science'],
            ['name' => 'Materials Engineering'],
            ['name' => 'Mathematics'],
            ['name' => 'Mechanical Engineering'],
            ['name' => 'Medical and Health Sciences'],
            ['name' => 'Philosophy and Religious Studies'],
            ['name' => 'Physical Sciences'],
            ['name' => 'Political Science'],
            ['name' => 'Psychology'],
            ['name' => 'Sociology'],
            ['name' => 'Space Sciences'],
            ['name' => 'Statistics'],
            ['name' => 'Veterinary Sciences'],
            // Add more as needed
        ]);
    }
}
