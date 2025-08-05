<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ConnectionTag;

class ConnectionTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default essential tags that cannot be deleted by users
        ConnectionTag::create([
            'name' => 'Collaborator',
            'is_default' => true,
        ]);

        ConnectionTag::create([
            'name' => 'Student',
            'is_default' => true,
        ]);
    }
}