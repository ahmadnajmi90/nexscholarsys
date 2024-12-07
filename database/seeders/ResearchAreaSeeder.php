<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResearchAreaSeeder extends Seeder
{
    public function run()
    {
        DB::table('research_area')->insert([
            // Agricultural Sciences
            ['name' => 'Crop Science', 'field_of_research_id' => 1],
            ['name' => 'Soil Science', 'field_of_research_id' => 1],
            ['name' => 'Agricultural Engineering', 'field_of_research_id' => 1],

            // Astronomy and Astrophysics
            ['name' => 'Exoplanet Studies', 'field_of_research_id' => 2],
            ['name' => 'Cosmology', 'field_of_research_id' => 2],
            ['name' => 'Stellar Astrophysics', 'field_of_research_id' => 2],

            // Biological Sciences
            ['name' => 'Genetics and Genomics', 'field_of_research_id' => 3],
            ['name' => 'Microbiology', 'field_of_research_id' => 3],
            ['name' => 'Ecology', 'field_of_research_id' => 3],

            // Business and Management
            ['name' => 'Organisational Behaviour', 'field_of_research_id' => 4],
            ['name' => 'Marketing Analytics', 'field_of_research_id' => 4],
            ['name' => 'Entrepreneurship Studies', 'field_of_research_id' => 4],

            // Chemical Sciences
            ['name' => 'Organic Chemistry', 'field_of_research_id' => 5],
            ['name' => 'Inorganic Chemistry', 'field_of_research_id' => 5],
            ['name' => 'Analytical Chemistry', 'field_of_research_id' => 5],

            // Civil Engineering
            ['name' => 'Structural Engineering', 'field_of_research_id' => 6],
            ['name' => 'Transportation Engineering', 'field_of_research_id' => 6],
            ['name' => 'Geotechnical Engineering', 'field_of_research_id' => 6],

            // Computer Science
            ['name' => 'Artificial Intelligence', 'field_of_research_id' => 7],
            ['name' => 'Cybersecurity', 'field_of_research_id' => 7],
            ['name' => 'Data Science', 'field_of_research_id' => 7],

            // Creative Arts and Writing
            ['name' => 'Visual Arts', 'field_of_research_id' => 8],
            ['name' => 'Creative Writing', 'field_of_research_id' => 8],
            ['name' => 'Performing Arts', 'field_of_research_id' => 8],

            // Earth Sciences
            ['name' => 'Geology', 'field_of_research_id' => 9],
            ['name' => 'Meteorology', 'field_of_research_id' => 9],
            ['name' => 'Oceanography', 'field_of_research_id' => 9],

            // Economics
            ['name' => 'Macroeconomics', 'field_of_research_id' => 10],
            ['name' => 'Microeconomics', 'field_of_research_id' => 10],
            ['name' => 'Behavioural Economics', 'field_of_research_id' => 10],

            // Education
            ['name' => 'Curriculum Development', 'field_of_research_id' => 11],
            ['name' => 'Educational Technology', 'field_of_research_id' => 11],
            ['name' => 'Inclusive Education', 'field_of_research_id' => 11],

            // Electrical and Electronic Engineering
            ['name' => 'Power Systems', 'field_of_research_id' => 12],
            ['name' => 'Signal Processing', 'field_of_research_id' => 12],
            ['name' => 'Embedded Systems', 'field_of_research_id' => 12],

            // Environmental Sciences
            ['name' => 'Environmental Chemistry', 'field_of_research_id' => 13],
            ['name' => 'Climate Change Science', 'field_of_research_id' => 13],
            ['name' => 'Pollution Control', 'field_of_research_id' => 13],

            // Health Sciences
            ['name' => 'Public Health', 'field_of_research_id' => 14],
            ['name' => 'Epidemiology', 'field_of_research_id' => 14],
            ['name' => 'Health Informatics', 'field_of_research_id' => 14],

            // History
            ['name' => 'Ancient History', 'field_of_research_id' => 15],
            ['name' => 'Modern History', 'field_of_research_id' => 15],
            ['name' => 'World History', 'field_of_research_id' => 15],

            // Humanities and Social Sciences
            ['name' => 'Cultural Studies', 'field_of_research_id' => 16],
            ['name' => 'Sociology', 'field_of_research_id' => 16],
            ['name' => 'Anthropology', 'field_of_research_id' => 16],

            // Law and Legal Studies
            ['name' => 'Human Rights Law', 'field_of_research_id' => 17],
            ['name' => 'Corporate Law', 'field_of_research_id' => 17],
            ['name' => 'International Law', 'field_of_research_id' => 17],

            // Library and Information Science
            ['name' => 'Knowledge Management', 'field_of_research_id' => 18],
            ['name' => 'Digital Libraries', 'field_of_research_id' => 18],
            ['name' => 'Information Retrieval', 'field_of_research_id' => 18],

            // Materials Engineering
            ['name' => 'Nanomaterials', 'field_of_research_id' => 19],
            ['name' => 'Composite Materials', 'field_of_research_id' => 19],
            ['name' => 'Metallurgy', 'field_of_research_id' => 19],

            // Mathematics
            ['name' => 'Algebra', 'field_of_research_id' => 20],
            ['name' => 'Statistics', 'field_of_research_id' => 20],
            ['name' => 'Applied Mathematics', 'field_of_research_id' => 20],

            // Mechanical Engineering
            ['name' => 'Thermodynamics', 'field_of_research_id' => 21],
            ['name' => 'Robotics', 'field_of_research_id' => 21],
            ['name' => 'Fluid Mechanics', 'field_of_research_id' => 21],

            // Medical and Health Sciences
            ['name' => 'Pharmacology', 'field_of_research_id' => 22],
            ['name' => 'Pathology', 'field_of_research_id' => 22],
            ['name' => 'Clinical Medicine', 'field_of_research_id' => 22],

            // Philosophy and Religious Studies
            ['name' => 'Ethics', 'field_of_research_id' => 23],
            ['name' => 'Comparative Religion', 'field_of_research_id' => 23],
            ['name' => 'Metaphysics', 'field_of_research_id' => 23],

            // Physical Sciences
            ['name' => 'Theoretical Physics', 'field_of_research_id' => 24],
            ['name' => 'Quantum Mechanics', 'field_of_research_id' => 24],
            ['name' => 'Thermodynamics', 'field_of_research_id' => 24],

            // Political Science
            ['name' => 'International Relations', 'field_of_research_id' => 25],
            ['name' => 'Political Theory', 'field_of_research_id' => 25],
            ['name' => 'Comparative Politics', 'field_of_research_id' => 25],

            // Psychology
            ['name' => 'Cognitive Psychology', 'field_of_research_id' => 26],
            ['name' => 'Social Psychology', 'field_of_research_id' => 26],
            ['name' => 'Clinical Psychology', 'field_of_research_id' => 26],

            // Sociology
            ['name' => 'Urban Sociology', 'field_of_research_id' => 27],
            ['name' => 'Sociology of Education', 'field_of_research_id' => 27],
            ['name' => 'Gender Studies', 'field_of_research_id' => 27],

            // Space Sciences
            ['name' => 'Astrobiology', 'field_of_research_id' => 28],
            ['name' => 'Planetary Science', 'field_of_research_id' => 28],
            ['name' => 'Space Exploration', 'field_of_research_id' => 28],

            // Statistics
            ['name' => 'Biostatistics', 'field_of_research_id' => 29],
            ['name' => 'Time Series Analysis', 'field_of_research_id' => 29],
            ['name' => 'Data Mining', 'field_of_research_id' => 29],

            // Veterinary Sciences
            ['name' => 'Veterinary Medicine', 'field_of_research_id' => 30],
            ['name' => 'Animal Nutrition', 'field_of_research_id' => 30],
            ['name' => 'Wildlife Health', 'field_of_research_id' => 30],
        ]);
    }
}
