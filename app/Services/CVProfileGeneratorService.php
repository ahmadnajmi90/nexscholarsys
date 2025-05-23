<?php

namespace App\Services;

use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CVProfileGeneratorService
{
    protected $documentTextExtractor;
    protected $aiProfileService;
    protected $user;
    
    /**
     * Constructor
     *
     * @param DocumentTextExtractorService $documentTextExtractor
     * @param AIProfileService $aiProfileService
     */
    public function __construct(
        DocumentTextExtractorService $documentTextExtractor,
        AIProfileService $aiProfileService
    ) {
        $this->documentTextExtractor = $documentTextExtractor;
        $this->aiProfileService = $aiProfileService;
    }
    
    /**
     * Generate profile data from CV for a user
     *
     * @param User $user
     * @param string|null $cvPath Path to CV file (if not already stored in user's role model)
     * @return array|null Generated profile data or null if generation failed
     */
    public function generateProfileFromCV(User $user, ?string $cvPath = null): ?array
    {
        $this->user = $user;
        $userId = $user->id;
        
        // Log the start of profile generation
        Log::info("Starting CV profile generation for user", [
            'user_id' => $userId,
            'provided_cv_path' => $cvPath
        ]);
        
        // Validate that we have a CV path
        if (empty($cvPath)) {
            Log::error("No CV path provided for profile generation", [
                'user_id' => $userId
            ]);
            return null;
        }
        
        // Determine user role
        $roleModel = $this->getRoleModel($user);
        if (!$roleModel) {
            Log::error("Failed to determine user role for user", [
                'user_id' => $userId
            ]);
            return null;
        }
        
        // Verify the file exists in storage using multiple methods
        $fileFound = false;
        
        // Try using Storage facade first
        if (Storage::disk('public')->exists($cvPath)) {
            $fileFound = true;
            Log::info("CV file found in public storage", [
                'user_id' => $userId,
                'cv_path' => $cvPath,
                'full_path' => Storage::disk('public')->path($cvPath)
            ]);
        } 
        // Try direct file access as fallback
        else {
            $fullPath = public_path('storage/' . $cvPath);
            if (file_exists($fullPath)) {
                $fileFound = true;
                Log::info("CV file found via direct path check", [
                    'user_id' => $userId,
                    'cv_path' => $cvPath,
                    'full_path' => $fullPath
                ]);
            }
        }
        
        // Handle file not found error
        if (!$fileFound) {
            Log::error("CV file does not exist in storage", [
                'user_id' => $userId,
                'cv_path' => $cvPath,
                'storage_path' => Storage::disk('public')->path($cvPath),
                'public_path' => public_path('storage/' . $cvPath)
            ]);
            return null;
        }
        
        // Extract text from CV using the document text extractor service
        // The service will handle resolving the full path correctly
        $cvText = $this->documentTextExtractor->extractText($cvPath, $userId);
        if (!$cvText) {
            Log::error("Failed to extract text from CV file", [
                'user_id' => $userId,
                'cv_path' => $cvPath
            ]);
            return null;
        }
        
        // Log the CV extraction success
        Log::info("Successfully extracted text from CV file", [
            'user_id' => $userId,
            'cv_path' => $cvPath,
            'text_length' => strlen($cvText),
            'role_type' => get_class($roleModel)
        ]);
        
        // Generate profile based on user role
        $generatedProfile = $this->generateProfileBasedOnRole($roleModel, $cvText);
        
        return $generatedProfile;
    }
    
    /**
     * Get the appropriate role model for a user
     *
     * @param User $user
     * @return mixed Role model object or null if not found
     */
    protected function getRoleModel(User $user)
    {
        if ($user->isAn('academician') && $user->academician) {
            return $user->academician;
        } elseif ($user->isAn('postgraduate') && $user->postgraduate) {
            return $user->postgraduate;
        } elseif ($user->isAn('undergraduate') && $user->undergraduate) {
            return $user->undergraduate;
        }
        
        return null;
    }
    
    /**
     * Generate profile data based on user role and CV text
     *
     * @param mixed $roleModel
     * @param string $cvText
     * @return array|null
     */
    protected function generateProfileBasedOnRole($roleModel, string $cvText): ?array
    {
        // Get user's full name from the role model
        $fullName = $roleModel->full_name ?? 'Unknown';
        $email = $this->user->email ?? null;
        $university = isset($roleModel->university) && $roleModel->university ? 
            optional($roleModel->universityDetails)->full_name : null;
        $faculty = isset($roleModel->faculty) && $roleModel->faculty ? 
            optional($roleModel->faculty)->name : null;
            
        // Create role-specific prompts for the AI
        if ($roleModel instanceof Academician) {
            return $this->generateAcademicianProfile($roleModel, $cvText, $fullName, $email, $university, $faculty);
        } elseif ($roleModel instanceof Postgraduate) {
            return $this->generatePostgraduateProfile($roleModel, $cvText, $fullName, $email, $university, $faculty);
        } elseif ($roleModel instanceof Undergraduate) {
            return $this->generateUndergraduateProfile($roleModel, $cvText, $fullName, $email, $university, $faculty);
        }
        
        return null;
    }
    
    /**
     * Generate profile data for an academician
     *
     * @param Academician $academician
     * @param string $cvText
     * @param string $fullName
     * @param string|null $email
     * @param string|null $university
     * @param string|null $faculty
     * @return array|null
     */
    protected function generateAcademicianProfile(
        Academician $academician, 
        string $cvText, 
        string $fullName, 
        ?string $email = null,
        ?string $university = null,
        ?string $faculty = null
    ): ?array {
        $prompt = "Generate a detailed academic profile for an academician using their CV text.
        Return the output as valid JSON with exactly the following keys: full_name, email, phone_number, current_position, department, highest_degree, field_of_study, bio.
        Each field must be plausible and realistic, if not found then leave it as null:
        - 'full_name' and 'email' should match the provided details.
        - 'phone_number' must be in an international format (e.g. '+60 123-456-7890') and contain only digits, spaces, or dashes.
        - 'highest_degree' should be one of: Certificate, Diploma, Bachelor's Degree, Master's Degree, Ph.D., or Postdoctoral.
        - 'current_position' should be one of: Lecturer, Senior Lecturer, Associate Professor, Professor, Postdoctoral Researcher, or Researcher.
        Details: Name: {$fullName}, Email: {$email}, University: {$university}, Faculty: {$faculty}.
        CV Text: {$cvText}
        Provide plausible academic details based solely on these inputs, and output only valid JSON without any markdown formatting.";
        
        // Log the prompt being sent to AI
        Log::info("Sending academician profile generation prompt to AI for user {$this->user->id}", [
            'user_id' => $this->user->id,
            'role' => 'academician',
            'prompt_length' => strlen($prompt)
        ]);
        
        // Log the full prompt for debugging 
        Log::debug("Full AI prompt for academician profile generation (user: {$this->user->id}):", [
            'prompt' => $prompt
        ]);
        
        // Get AI response
        $response = $this->aiProfileService->generateProfile($prompt);
        
        // Log the AI response
        if ($response) {
            Log::info("Received successful AI response for academician profile (user: {$this->user->id})", [
                'user_id' => $this->user->id,
                'response_fields' => array_keys($response),
                'field_count' => count($response)
            ]);
            
            // Log the detailed response
            Log::debug("Full AI response for academician profile generation (user: {$this->user->id}):", [
                'response' => $response
            ]);
            
            Log::info("Generated profile data for user {$this->user->id} from CV", [
                'user_id' => $this->user->id,
                'data_keys' => array_keys($response)
            ]);
        } else {
            Log::error("Failed to get AI response for academician profile (user: {$this->user->id})");
        }
        
        return $response;
    }
    
    /**
     * Map raw skills extracted from CV to existing skills in the database
     *
     * @param array $rawSkills Array of skill strings extracted from the CV
     * @return array Array of skill IDs that match existing skills in the database
     */
    protected function mapSkillsToExistingOptions(array $rawSkills): array
    {
        // Get all skills from database
        $existingSkills = \App\Models\Skill::all();
        $mappedSkillIds = [];
        
        // Log the available skills in the database
        Log::info("Available skills in database:", $existingSkills->pluck('name', 'id')->toArray());
        
        // Keywords mapping to help match extracted skills to categories
        $skillKeywords = [
            'Programming Skills' => ['programming', 'coding', 'development', 'software', 'java', 'python', 'c++', 'javascript', 'php', 'ruby', 'c#', 'golang', 'swift', 'typescript', 'kotlin', 'scala', 'rust', 'assembly', 'sql', 'bash', 'powershell', 'node', 'git', 'github', 'backend'],
            
            'Data Analysis' => ['data analysis', 'statistics', 'r', 'spss', 'analytics', 'data mining', 'data visualization', 'power bi', 'tableau', 'data science', 'analytics', 'excel', 'statistical analysis', 'data processing', 'data cleaning', 'exploratory data analysis', 'eda', 'data interpretation', 'data collection', 'data management', 'database', 'sql', 'nosql', 'mysql', 'postgresql', 'mongodb', 'data warehouse', 'data engineering'],
            
            'Machine Learning' => ['machine learning', 'ml', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'supervised learning', 'unsupervised learning', 'reinforcement learning', 'neural networks', 'deep learning', 'nlp', 'natural language processing', 'computer vision', 'classification', 'regression', 'clustering', 'dimensionality reduction', 'ensemble methods', 'feature engineering', 'model training', 'model evaluation', 'hyperparameter tuning'],
            
            'Artificial Intelligence' => ['artificial intelligence', 'ai', 'nlp', 'computer vision', 'expert systems', 'knowledge representation', 'reasoning', 'cognitive computing', 'robotics', 'agent systems', 'autonomous systems', 'intelligent systems', 'speech recognition', 'image recognition', 'ai ethics', 'explainable ai', 'ai-driven', 'ai integration', 'ai solution'],
            
            'Web Development' => ['web development', 'web design', 'web app', 'web application', 'html', 'css', 'javascript', 'js', 'frontend', 'front-end', 'backend', 'back-end', 'full stack', 'fullstack', 'responsive design', 'spa', 'pwa', 'api', 'restful', 'graphql', 'web security', 'web performance', 'web accessibility', 'cms', 'wordpress', 'shopify', 'magento', 'web hosting', 'domain', 'ssl', 'http', 'https', 'react', 'vue', 'angular', 'laravel', 'django', 'flask', 'express', 'node.js', 'nodejs', 'php', 'asp.net', 'inertia', 'next.js', 'nuxt', 'svelte', 'tailwind', 'bootstrap', 'jquery', 'astro']
        ];
        
        // Pre-process all raw skills
        $processedSkills = [];
        foreach ($rawSkills as $skill) {
            if (empty(trim($skill))) continue;
            $processedSkills[] = strtolower(trim($skill));
        }
        
        Log::info("Processing extracted skills:", ['raw_skills' => $processedSkills]);
        
        // Map skills to categories using more detailed matching
        foreach ($skillKeywords as $categoryName => $keywords) {
            $matched = false;
            
            // First try exact category matching
            if (in_array(strtolower($categoryName), $processedSkills)) {
                $categorySkill = $existingSkills->firstWhere('name', $categoryName);
                if ($categorySkill && !in_array($categorySkill->id, $mappedSkillIds)) {
                    $mappedSkillIds[] = $categorySkill->id;
                    $matched = true;
                    Log::info("Matched exact category name: $categoryName");
                }
            }
            
            // Then try keyword matching for each skill
            foreach ($processedSkills as $skill) {
                if (empty($skill)) continue;
                
                // Check if this exact skill exists in the database
                $exactSkill = $existingSkills->first(function($item) use ($skill) {
                    return strtolower($item->name) === $skill;
                });
                
                if ($exactSkill) {
                    if (!in_array($exactSkill->id, $mappedSkillIds)) {
                        $mappedSkillIds[] = $exactSkill->id;
                        Log::info("Matched exact skill: $skill to ID: {$exactSkill->id}");
                    }
                    continue;
                }
                
                // Try keyword matching
                foreach ($keywords as $keyword) {
                    // Exact match on keyword
                    if ($skill === $keyword) {
                        $categorySkill = $existingSkills->firstWhere('name', $categoryName);
                        if ($categorySkill && !in_array($categorySkill->id, $mappedSkillIds)) {
                            $mappedSkillIds[] = $categorySkill->id;
                            Log::info("Matched keyword: $keyword to category: $categoryName");
                            break;
                        }
                    }
                    // Contains the keyword
                    elseif (strpos($skill, $keyword) !== false || strpos($keyword, $skill) !== false) {
                        $categorySkill = $existingSkills->firstWhere('name', $categoryName);
                        if ($categorySkill && !in_array($categorySkill->id, $mappedSkillIds)) {
                            $mappedSkillIds[] = $categorySkill->id;
                            Log::info("Matched partial keyword: $keyword in skill: $skill to category: $categoryName");
                            break;
                        }
                    }
                }
            }
        }
        
        // Handle special cases for common frameworks/languages
        $specialCaseMapping = [
            'react' => 'Web Development',
            'laravel' => 'Web Development',
            'vue' => 'Web Development',
            'inertia' => 'Web Development',
            'django' => 'Web Development',
            'express' => 'Web Development',
            'astro' => 'Web Development',
            'flask' => 'Web Development',
            'java' => 'Programming Skills',
            'python' => 'Programming Skills',
            'c++' => 'Programming Skills',
            'php' => 'Programming Skills',
            'javascript' => 'Programming Skills',
            'mysql' => 'Data Analysis',
            'ai' => 'Artificial Intelligence'
        ];
        
        foreach ($processedSkills as $skill) {
            foreach ($specialCaseMapping as $framework => $category) {
                if (strpos($skill, $framework) !== false) {
                    $categorySkill = $existingSkills->firstWhere('name', $category);
                    if ($categorySkill && !in_array($categorySkill->id, $mappedSkillIds)) {
                        $mappedSkillIds[] = $categorySkill->id;
                        Log::info("Special case matched: $framework in skill: $skill to category: $category");
                    }
                }
            }
        }
        
        // If no skills were matched but raw skills exist, try one more general matching
        if (empty($mappedSkillIds) && !empty($processedSkills)) {
            $generalKeywords = [
                'Programming Skills' => ['code', 'program', 'script', 'develop', 'algorithm'],
                'Web Development' => ['web', 'website', 'frontend', 'backend', 'design', 'ui', 'ux'],
                'Data Analysis' => ['data', 'analysis', 'analytics', 'statistics', 'database'],
                'Machine Learning' => ['machine', 'learning', 'model', 'predict', 'classify', 'algorithm'],
                'Artificial Intelligence' => ['intelligence', 'ai', 'smart', 'cognitive', 'neural']
            ];
            
            foreach ($processedSkills as $skill) {
                foreach ($generalKeywords as $category => $generalTerms) {
                    foreach ($generalTerms as $term) {
                        if (strpos($skill, $term) !== false) {
                            $categorySkill = $existingSkills->firstWhere('name', $category);
                            if ($categorySkill && !in_array($categorySkill->id, $mappedSkillIds)) {
                                $mappedSkillIds[] = $categorySkill->id;
                                Log::info("General term matched: $term in skill: $skill to category: $category");
                                break 2;
                            }
                        }
                    }
                }
            }
        }
        
        // Log the mapping results
        Log::info("Mapped extracted skills to IDs", [
            'raw_skills' => $rawSkills,
            'processed_skills' => $processedSkills,
            'mapped_skill_ids' => $mappedSkillIds,
            'mapped_skill_names' => $existingSkills->whereIn('id', $mappedSkillIds)->pluck('name')->toArray()
        ]);
        
        return array_unique($mappedSkillIds);
    }
    
    /**
     * Generate profile data for a postgraduate
     *
     * @param Postgraduate $postgraduate
     * @param string $cvText
     * @param string $fullName
     * @param string|null $email
     * @param string|null $university
     * @param string|null $faculty
     * @return array|null
     */
    protected function generatePostgraduateProfile(
        Postgraduate $postgraduate, 
        string $cvText, 
        string $fullName, 
        ?string $email = null,
        ?string $university = null,
        ?string $faculty = null
    ): ?array {
        $prompt = "Generate a detailed academic profile for a postgraduate student using their CV text.
        Return the output as valid JSON with exactly the following keys: full_name, email, phone_number, previous_degree, bachelor, CGPA_bachelor, master, master_type, nationality, english_proficiency_level, suggested_research_title, suggested_research_description, bio, funding_requirement, current_postgraduate_status.
        Each field must be plausible and realistic, if not found then leave it as null:
        - 'full_name' and 'email' should match the provided details.
        - 'phone_number' must be in an international format (e.g. '+60 123-456-7890') and contain only digits, spaces, or dashes.
        - 'previous_degree' should be the highest academic qualification.
        - 'bachelor' should be the bachelor's degree field or name.
        - 'CGPA_bachelor' should be a decimal GPA value (e.g., '3.8').
        - 'master' should be the master's degree field or name (if applicable).
        - 'master_type' should be 'Research' or 'Coursework' (if applicable).
        - 'english_proficiency_level' should be one of: 'Beginner', 'Intermediate', 'Advanced', 'Native'.
        - 'funding_requirement' should be 'Yes' or 'No'.
        - 'current_postgraduate_status' should be 'Not registered yet' or 'Registered'.
        Details: Name: {$fullName}, Email: {$email}, University: {$university}, Faculty: {$faculty}.
        CV Text: {$cvText}
        Provide plausible academic details based solely on these inputs, and output only valid JSON without any markdown formatting.";
        
        // Log the prompt being sent to AI
        Log::info("Sending postgraduate profile generation prompt to AI for user {$this->user->id}", [
            'user_id' => $this->user->id,
            'role' => 'postgraduate',
            'prompt_length' => strlen($prompt)
        ]);
        
        // Log the full prompt for debugging 
        Log::debug("Full AI prompt for postgraduate profile generation (user: {$this->user->id}):", [
            'prompt' => $prompt
        ]);
        
        // Get AI response
        $response = $this->aiProfileService->generateProfile($prompt);
        
        // Post-process the response
        if ($response) {
            // Process skills if available
            if (isset($response['skills']) && is_array($response['skills'])) {
                $response['skills'] = $this->mapSkillsToExistingOptions($response['skills']);
            }
            
            // Set previous_degree based on bachelor/master information
            if (isset($response['bachelor']) && !empty($response['bachelor'])) {
                if (!isset($response['previous_degree']) || empty($response['previous_degree'])) {
                    $response['previous_degree'] = ["Bachelor Degree"];
                } elseif (is_string($response['previous_degree'])) {
                    $response['previous_degree'] = ["Bachelor Degree"];
                } elseif (is_array($response['previous_degree']) && !in_array("Bachelor Degree", $response['previous_degree'])) {
                    $response['previous_degree'][] = "Bachelor Degree";
                }
            }
            
            if (isset($response['master']) && !empty($response['master'])) {
                if (!isset($response['previous_degree']) || empty($response['previous_degree'])) {
                    $response['previous_degree'] = ["Master"];
                } elseif (is_string($response['previous_degree'])) {
                    $response['previous_degree'] = ["Master"];
                } elseif (is_array($response['previous_degree']) && !in_array("Master", $response['previous_degree'])) {
                    $response['previous_degree'][] = "Master";
                }
            }
            
            Log::info("Received successful AI response for postgraduate profile (user: {$this->user->id})", [
                'user_id' => $this->user->id,
                'response_fields' => array_keys($response),
                'field_count' => count($response)
            ]);
            
            // Log the detailed response
            Log::debug("Full AI response for postgraduate profile generation (user: {$this->user->id}):", [
                'response' => $response
            ]);
        } else {
            Log::error("Failed to get AI response for postgraduate profile (user: {$this->user->id})");
        }
        
        return $response;
    }
    
    /**
     * Generate profile data for an undergraduate
     *
     * @param Undergraduate $undergraduate
     * @param string $cvText
     * @param string $fullName
     * @param string|null $email
     * @param string|null $university
     * @param string|null $faculty
     * @return array|null
     */
    protected function generateUndergraduateProfile(
        Undergraduate $undergraduate, 
        string $cvText, 
        string $fullName, 
        ?string $email = null,
        ?string $university = null,
        ?string $faculty = null
    ): ?array {
        $prompt = "Generate a detailed academic profile for an undergraduate student using their CV text.
        Return the output as valid JSON with exactly the following keys: full_name, email, phone_number, bio, bachelor, CGPA_bachelor, nationality, english_proficiency_level, current_undergraduate_status, matric_no, interested_do_research, expected_graduate.
        Each field must be plausible and realistic, if not found then leave it as null:
        - 'full_name' and 'email' should match the provided details.
        - 'phone_number' must be in an international format (e.g. '+60 123-456-7890') and contain only digits, spaces, or dashes.
        - 'bachelor' should be the undergraduate degree field or program.
        - 'CGPA_bachelor' should be a decimal GPA value (e.g., '3.8') or null if in progress.
        - 'english_proficiency_level' should be one of: 'Beginner', 'Intermediate', 'Advanced', 'Native'.
        - 'current_undergraduate_status' should be 'Not registered yet' or 'Registered'.
        - 'interested_do_research' should be true or false.
        - 'expected_graduate' should be a year (e.g., '2025').
        Details: Name: {$fullName}, Email: {$email}, University: {$university}, Faculty: {$faculty}.
        CV Text: {$cvText}
        Provide plausible academic details based solely on these inputs, and output only valid JSON without any markdown formatting.";
        
        // Log the prompt being sent to AI
        Log::info("Sending undergraduate profile generation prompt to AI for user {$this->user->id}", [
            'user_id' => $this->user->id,
            'role' => 'undergraduate',
            'prompt_length' => strlen($prompt)
        ]);
        
        // Log the full prompt for debugging 
        Log::debug("Full AI prompt for undergraduate profile generation (user: {$this->user->id}):", [
            'prompt' => $prompt
        ]);
        
        // Get AI response
        $response = $this->aiProfileService->generateProfile($prompt);
        
        // Post-process the response
        if ($response) {
            // Process skills if available
            if (isset($response['skills']) && is_array($response['skills'])) {
                $response['skills'] = $this->mapSkillsToExistingOptions($response['skills']);
            }
            
            // Set bachelor degree type properly
            if (isset($response['bachelor']) && !empty($response['bachelor'])) {
                $response['previous_degree'] = ["Bachelor Degree"];
            }
            
            Log::info("Received successful AI response for undergraduate profile (user: {$this->user->id})", [
                'user_id' => $this->user->id,
                'response_fields' => array_keys($response),
                'field_count' => count($response)
            ]);
            
            // Log the detailed response
            Log::debug("Full AI response for undergraduate profile generation (user: {$this->user->id}):", [
                'response' => $response
            ]);
        } else {
            Log::error("Failed to get AI response for undergraduate profile (user: {$this->user->id})");
        }
        
        return $response;
    }
} 