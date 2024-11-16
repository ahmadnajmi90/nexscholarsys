<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PostGrantForStudent;

class PostGrantForStudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PostGrantForStudent::create([
            'academician_id' => '1',
            'title' => 'Post Grant for Student 1',
            'description' => 'Description for Post Grant for Student 1',
        ]);
    }
}
