<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AcademicianSeeder extends Seeder
{
    public function run()
    {
        // List of random names
        $randomNames = [
            "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Edward Norton",
            "Fiona Gallagher", "George Michael", "Hannah Montana", "Ian Curtis", "Julia Roberts",
            "Kevin Hart", "Luna Lovegood", "Mark Ruffalo", "Nina Simone", "Oscar Wilde",
            "Penny Lane", "Quentin Tarantino", "Rachel Green", "Steve Jobs", "Taylor Swift",
            "Uma Thurman", "Victor Hugo", "Will Smith", "Xander Cage", "Yara Shahidi",
            "Zoe Saldana", "Anna Kendrick", "Brian May", "Catherine Zeta-Jones", "David Beckham",
        ];

        // List of universities in Malaysia
        $universities = [
            "Universiti Malaya (UM)", "Universiti Teknologi Malaysia (UTM)", "Universiti Kebangsaan Malaysia (UKM)",
            "Universiti Sains Malaysia (USM)", "Universiti Putra Malaysia (UPM)", "Universiti Teknologi MARA (UiTM)",
            "Universiti Islam Antarabangsa Malaysia (UIAM)", "Universiti Malaysia Sabah (UMS)",
            "Universiti Malaysia Sarawak (UNIMAS)", "Universiti Pendidikan Sultan Idris (UPSI)",
        ];

        // List of research areas
        $researchAreas = [
            "Artificial Intelligence (Generative AI)", "Quantum Computing", "Clean Energy Technologies",
            "Synthetic Biology", "Climate Change Mitigation", "Advanced Robotics", 
            "Natural Language Processing", "Autonomous Vehicles", "Space Exploration Technologies",
            "Edge Computing",
        ];

        // Generate 30 dummy academician profiles
        $academicians = [];
        for ($i = 0; $i < 30; $i++) {
            $academicians[] = [
                'academician_id' => 'ACAD-' . Str::random(8), // Unique ID
                'full_name' => $randomNames[$i % count($randomNames)],
                'university' => $universities[$i % count($universities)],
                'current_position' => 'Lecturer', // Example static value
                'department' => 'Computer Science Department', // Example static value
                'highest_degree' => 'PhD',
                'field_of_study' => $researchAreas[$i % count($researchAreas)],
                'research_interests' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                'ongoing_research' => 'Example ongoing research project description.',
                'website' => 'https://example.com',
                'linkedin' => 'https://linkedin.com/in/example',
                'google_scholar' => 'https://scholar.google.com/example',
                'researchgate' => 'https://www.researchgate.net/profile/Example',
                'orcid' => 'https://orcid.org/0000-000' . $i,
                'bio' => 'This is a short bio for the academician.',
                'availability_for_collaboration' => rand(0, 1),
                'availability_as_supervisor' => rand(0, 1),
                'verified' => rand(0, 1) ? 'Yes' : 'No',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert data into the Academician table
        DB::table('academicians')->insert($academicians);
    }
}
