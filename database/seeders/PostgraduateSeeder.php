<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\UniversityList;

class PostgraduateSeeder extends Seeder
{
    public function run()
    {
        // List of random names (different from AcademicianSeeder)
        $randomNames = [
            "Evelyn Parker", "James Morgan", "Sophia Harris", "Liam Anderson", "Olivia Martinez",
            "Noah Hernandez", "Ava Walker", "Mason Perez", "Isabella Thompson", "Ethan White",
            "Mia Scott", "Logan Ramirez", "Charlotte Lee", "Lucas Young", "Amelia Hill",
            "Jackson Green", "Harper Adams", "Benjamin Nelson", "Abigail Baker", "Jacob Mitchell",
            "Emily Carter", "Michael Garcia", "Ella Rodriguez", "Alexander Lewis", "Avery Hall",
            "William Allen", "Scarlett Sanders", "Daniel Bryant", "Grace Foster", "Henry Ward",
        ];

        // Fetch all universities from the university_list table
        $universities = UniversityList::all()->pluck('id')->toArray(); // Get university IDs

        // List of research areas (same as AcademicianSeeder)
        $researchAreas = [
            "Artificial Intelligence (Generative AI)", "Quantum Computing", "Clean Energy Technologies",
            "Synthetic Biology", "Climate Change Mitigation", "Advanced Robotics", 
            "Natural Language Processing", "Autonomous Vehicles", "Space Exploration Technologies",
            "Edge Computing",
        ];

        $getRandomResearchAreas = function ($researchAreas) {
            $count = rand(1, 3); // Select 1 to 3 research areas randomly
            return json_encode(array_rand(array_flip($researchAreas), $count));
        };

        // Generate 30 dummy postgraduate profiles
        $postgraduates = [];
        for ($i = 0; $i < 30; $i++) {
            $postgraduates[] = [
                'postgraduate_id' => 'PG-' . Str::random(8), // Unique ID
                'full_name' => $randomNames[$i % count($randomNames)],
                'university' => $universities[array_rand($universities)], // Random university ID
                'faculty' => 'Faculty of Science', // Example static value
                'highest_degree' => 'MSc', // Example static value
                'field_of_study' => $getRandomResearchAreas($researchAreas),
                'research_interests' => 'Example research interests in the selected field.',
                'ongoing_research' => 'Example description of ongoing postgraduate research.',
                'website' => 'https://example.com',
                'linkedin' => 'https://linkedin.com/in/example',
                'google_scholar' => 'https://scholar.google.com/example',
                'researchgate' => 'https://www.researchgate.net/profile/Example',
                'orcid' => 'https://orcid.org/0000-000' . $i,
                'bio' => 'This is a short bio for the postgraduate student.',
                'supervisorAvailability' => rand(0, 1),
                'grantAvailability' => rand(0, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert data into the Postgraduates table
        DB::table('postgraduates')->insert($postgraduates);
    }
}
