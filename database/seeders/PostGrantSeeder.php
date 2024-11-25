<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PostGrantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $categories = [
            'Fundamental Research',
            'Applied Research',
            'Fundamental + Applied',
            'Knowledge Transfer Program (KTP)',
            'CSR (Corporate Social Responsibility)'
        ];

        for ($i = 1; $i <= 30; $i++) {
            DB::table('post_grants')->insert([
                'author_id' => 'admin',
                'title' => 'Grant Title ' . $i,
                'description' => 'This is a detailed description for Grant ' . $i,
                'image' => 'grant_images/KjX4OaHnkTRQdeCrbKG8uaor3fCPFAMgFzWfuNbd.png',
                'post_status' => 'published',
                'grant_status' => 'open',
                'category' => $categories[array_rand($categories)], // Random category
                'tags' => json_encode(['Tag1', 'Tag2', 'Tag3']), // Example tags
                'sponsored_by' => 'Sponsor ' . $i,
                'location' => 'Location ' . $i,
                'email' => 'example' . $i . '@mail.com',
                'contact_number' => '012345678' . $i,
                'purpose' => $i % 2 == 0 ? 'find_pgstudent' : 'find_collaboration', // Alternate between purposes
                'start_date' => now()->subDays(rand(1, 30)), // Random start date in the past month
                'end_date' => now()->addDays(rand(1, 60)), // Random end date in the next 2 months
                'budget' => rand(10000, 50000), // Random budget between 10,000 and 50,000
                'eligibility_criteria' => 'Eligibility criteria for Grant ' . $i,
                'is_featured' => $i % 5 == 0, // Every 5th grant is featured
                'application_url' => 'https://application-link' . $i . '.com',
                'attachment' => 'attachment_file_' . $i . '.pdf',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
