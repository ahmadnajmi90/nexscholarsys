<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
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
        // Create Computer Science domain
        $computerScience = SkillsDomain::create(['name' => 'Computer Science']);
        
        // Create subdomains for Computer Science
        $webDev = SkillsSubdomain::create([
            'skills_domain_id' => $computerScience->id,
            'name' => 'Web Development'
        ]);
        
        $machineLearning = SkillsSubdomain::create([
            'skills_domain_id' => $computerScience->id,
            'name' => 'Machine Learning'
        ]);
        
        $dataScience = SkillsSubdomain::create([
            'skills_domain_id' => $computerScience->id,
            'name' => 'Data Science'
        ]);
        
        // Create skills for Web Development
        Skill::create([
            'skills_subdomain_id' => $webDev->id,
            'name' => 'React.js',
            'description' => 'JavaScript library for building user interfaces'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $webDev->id,
            'name' => 'Laravel',
            'description' => 'PHP web application framework'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $webDev->id,
            'name' => 'Vue.js',
            'description' => 'Progressive JavaScript framework for building user interfaces'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $webDev->id,
            'name' => 'Node.js',
            'description' => 'JavaScript runtime for server-side development'
        ]);
        
        // Create skills for Machine Learning
        Skill::create([
            'skills_subdomain_id' => $machineLearning->id,
            'name' => 'TensorFlow',
            'description' => 'Machine learning framework'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $machineLearning->id,
            'name' => 'PyTorch',
            'description' => 'Deep learning framework for Python'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $machineLearning->id,
            'name' => 'Scikit-learn',
            'description' => 'Machine learning library for Python'
        ]);
        
        // Create skills for Data Science
        Skill::create([
            'skills_subdomain_id' => $dataScience->id,
            'name' => 'Python',
            'description' => 'Programming language commonly used in data science'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $dataScience->id,
            'name' => 'R Programming',
            'description' => 'Statistical computing and graphics language'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $dataScience->id,
            'name' => 'SQL',
            'description' => 'Structured Query Language for database management'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $dataScience->id,
            'name' => 'Tableau',
            'description' => 'Data visualization and business intelligence platform'
        ]);
        
        // Create Engineering domain
        $engineering = SkillsDomain::create(['name' => 'Engineering']);
        
        // Create subdomains for Engineering
        $mechanicalEng = SkillsSubdomain::create([
            'skills_domain_id' => $engineering->id,
            'name' => 'Mechanical Engineering'
        ]);
        
        $electricalEng = SkillsSubdomain::create([
            'skills_domain_id' => $engineering->id,
            'name' => 'Electrical Engineering'
        ]);
        
        $civilEng = SkillsSubdomain::create([
            'skills_domain_id' => $engineering->id,
            'name' => 'Civil Engineering'
        ]);
        
        // Create skills for Mechanical Engineering
        Skill::create([
            'skills_subdomain_id' => $mechanicalEng->id,
            'name' => 'CAD Design',
            'description' => 'Computer-Aided Design for mechanical systems'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $mechanicalEng->id,
            'name' => 'SolidWorks',
            'description' => '3D CAD design software'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $mechanicalEng->id,
            'name' => 'Finite Element Analysis',
            'description' => 'Numerical method for solving engineering problems'
        ]);
        
        // Create skills for Electrical Engineering
        Skill::create([
            'skills_subdomain_id' => $electricalEng->id,
            'name' => 'Circuit Design',
            'description' => 'Design and analysis of electrical circuits'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $electricalEng->id,
            'name' => 'MATLAB',
            'description' => 'Programming platform for engineering and scientific computing'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $electricalEng->id,
            'name' => 'Power Systems',
            'description' => 'Electrical power generation, transmission, and distribution'
        ]);
        
        // Create skills for Civil Engineering
        Skill::create([
            'skills_subdomain_id' => $civilEng->id,
            'name' => 'Structural Analysis',
            'description' => 'Analysis of structures for safety and performance'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $civilEng->id,
            'name' => 'AutoCAD',
            'description' => 'Computer-aided design software for architecture and engineering'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $civilEng->id,
            'name' => 'Project Management',
            'description' => 'Planning and managing construction projects'
        ]);
        
        // Create Business & Management domain
        $business = SkillsDomain::create(['name' => 'Business & Management']);
        
        // Create subdomains for Business & Management
        $marketing = SkillsSubdomain::create([
            'skills_domain_id' => $business->id,
            'name' => 'Digital Marketing'
        ]);
        
        $finance = SkillsSubdomain::create([
            'skills_domain_id' => $business->id,
            'name' => 'Finance & Accounting'
        ]);
        
        $hrManagement = SkillsSubdomain::create([
            'skills_domain_id' => $business->id,
            'name' => 'Human Resources'
        ]);
        
        // Create skills for Digital Marketing
        Skill::create([
            'skills_subdomain_id' => $marketing->id,
            'name' => 'SEO Optimization',
            'description' => 'Search Engine Optimization strategies and techniques'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $marketing->id,
            'name' => 'Google Analytics',
            'description' => 'Web analytics and digital marketing measurement'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $marketing->id,
            'name' => 'Social Media Marketing',
            'description' => 'Marketing through social media platforms'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $marketing->id,
            'name' => 'Content Creation',
            'description' => 'Creating engaging content for marketing purposes'
        ]);
        
        // Create skills for Finance & Accounting
        Skill::create([
            'skills_subdomain_id' => $finance->id,
            'name' => 'Financial Analysis',
            'description' => 'Analysis of financial data and performance metrics'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $finance->id,
            'name' => 'Excel Advanced',
            'description' => 'Advanced Microsoft Excel skills for financial modeling'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $finance->id,
            'name' => 'Risk Management',
            'description' => 'Identification and mitigation of financial risks'
        ]);
        
        // Create skills for Human Resources
        Skill::create([
            'skills_subdomain_id' => $hrManagement->id,
            'name' => 'Recruitment',
            'description' => 'Talent acquisition and hiring processes'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $hrManagement->id,
            'name' => 'Performance Management',
            'description' => 'Employee performance evaluation and improvement'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $hrManagement->id,
            'name' => 'Training & Development',
            'description' => 'Employee learning and development programs'
        ]);
        
        // Create Life Sciences domain
        $lifeSciences = SkillsDomain::create(['name' => 'Life Sciences']);
        
        // Create subdomains for Life Sciences
        $biology = SkillsSubdomain::create([
            'skills_domain_id' => $lifeSciences->id,
            'name' => 'Molecular Biology'
        ]);
        
        $bioinformatics = SkillsSubdomain::create([
            'skills_domain_id' => $lifeSciences->id,
            'name' => 'Bioinformatics'
        ]);
        
        $pharmaceuticals = SkillsSubdomain::create([
            'skills_domain_id' => $lifeSciences->id,
            'name' => 'Pharmaceutical Sciences'
        ]);
        
        // Create skills for Molecular Biology
        Skill::create([
            'skills_subdomain_id' => $biology->id,
            'name' => 'PCR Techniques',
            'description' => 'Polymerase Chain Reaction laboratory techniques'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $biology->id,
            'name' => 'Gene Cloning',
            'description' => 'Molecular cloning and genetic engineering techniques'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $biology->id,
            'name' => 'Western Blotting',
            'description' => 'Protein analysis and detection technique'
        ]);
        
        // Create skills for Bioinformatics
        Skill::create([
            'skills_subdomain_id' => $bioinformatics->id,
            'name' => 'Genomic Analysis',
            'description' => 'Computational analysis of genomic data'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $bioinformatics->id,
            'name' => 'BLAST',
            'description' => 'Basic Local Alignment Search Tool for sequence analysis'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $bioinformatics->id,
            'name' => 'Phylogenetic Analysis',
            'description' => 'Evolutionary relationship analysis between species'
        ]);
        
        // Create skills for Pharmaceutical Sciences
        Skill::create([
            'skills_subdomain_id' => $pharmaceuticals->id,
            'name' => 'Drug Discovery',
            'description' => 'Process of discovering new pharmaceutical compounds'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $pharmaceuticals->id,
            'name' => 'Clinical Trials',
            'description' => 'Design and management of clinical research studies'
        ]);
        
        Skill::create([
            'skills_subdomain_id' => $pharmaceuticals->id,
            'name' => 'Regulatory Affairs',
            'description' => 'Pharmaceutical regulatory compliance and submissions'
        ]);
    }
}
