<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\UniversityList;
use App\Models\FacultyList;

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

        // Fetch all universities
        $universities = UniversityList::all()->pluck('id')->toArray(); // Get university IDs

        // Group faculties by university_id
        $facultiesByUniversity = FacultyList::all()->groupBy('university_id'); // Group faculties by university_id

        // List of research areas
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

        // Generate 30 dummy academician profiles
        $academicians = [];
        for ($i = 0; $i < 30; $i++) {
            // Randomly select a university
            $universityId = $universities[array_rand($universities)];

            // Get faculties for the selected university
            $faculties = $facultiesByUniversity[$universityId] ?? collect();

            // Randomly select a faculty if available
            $facultyId = $faculties->isNotEmpty() ? $faculties->random()->id : null;

            $academicians[] = [
                'academician_id' => 'ACAD-' . Str::random(8), // Unique ID
                'full_name' => $randomNames[$i % count($randomNames)],
                'university' => $universityId, // Random university ID
                'faculty' => $facultyId, // Faculty based on the selected university
                'current_position' => 'Lecturer', // Example static value
                'department' => 'Computer Science Department', // Example static value
                'highest_degree' => 'PhD',
                'field_of_study' => $getRandomResearchAreas($researchAreas),
                'field_of_research' => $getRandomResearchAreas($researchAreas),
                'ongoing_research' => $getRandomResearchAreas($researchAreas),
                'website' => 'https://example.com',
                'linkedin' => 'https://linkedin.com/in/example',
                'google_scholar' => 'https://scholar.google.com/example',
                'researchgate' => 'https://www.researchgate.net/profile/Example',
                'orcid' => 'https://orcid.org/0000-000' . $i,
                'bio' => 'This is a short bio for the academician.',
                'availability_for_collaboration' => rand(0, 1),
                'availability_as_supervisor' => rand(0, 1),
                'verified' => rand(0, 1),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert data into the Academician table
        DB::table('academicians')->insert($academicians);
    }
}
