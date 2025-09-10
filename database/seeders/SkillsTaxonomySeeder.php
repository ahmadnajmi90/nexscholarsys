<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\SkillsDomain;
use App\Models\SkillsSubdomain;
use App\Models\Skill;

class SkillsTaxonomySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Load skills.json file
        $jsonPath = database_path('data/skills.json');

        if (!File::exists($jsonPath)) {
            $this->command->error("❌ skills.json not found at $jsonPath");
            return;
        }

        $skillsData = json_decode(File::get($jsonPath), true);

        foreach ($skillsData as $domainData) {
            // Insert or get Domain
            $domain = SkillsDomain::firstOrCreate(
                ['name' => $domainData['domain']]
            );

            foreach ($domainData['subdomains'] as $subdomainData) {
                // Insert or get Subdomain
                $subdomain = SkillsSubdomain::firstOrCreate(
                    [
                        'name' => $subdomainData['name'],
                        'skills_domain_id' => $domain->id
                    ]
                );

                foreach ($subdomainData['skills'] as $skillName) {
                    // Insert or get Skill
                    Skill::firstOrCreate(
                        [
                            'name' => $skillName,
                            'skills_subdomain_id' => $subdomain->id
                        ]
                    );
                }
            }
        }

        $this->command->info("✅ Skills taxonomy seeding completed successfully!");
    }
}
