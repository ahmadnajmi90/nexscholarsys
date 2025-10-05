<?php

namespace App\Services;

use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use App\Models\Skill;
use Illuminate\Support\Facades\Log;

class ProfileComparisonService
{
    /**
     * Calculate research overlap between two profiles
     * 
     * @param array $currentUserProfile Current user's profile data
     * @param array $matchProfile The matched profile data
     * @param string $currentUserType Type of current user (academician/postgraduate/undergraduate)
     * @param string $matchType Type of matched profile (academician/postgraduate/undergraduate)
     * @return array Research overlap data
     */
    public function calculateResearchOverlap(
        array $currentUserProfile,
        array $matchProfile,
        string $currentUserType,
        string $matchType
    ): array {
        // Extract research areas based on profile type
        $currentResearch = $this->extractResearchAreas($currentUserProfile, $currentUserType);
        $matchResearch = $this->extractResearchAreas($matchProfile, $matchType);
        
        // Find common research areas
        $commonAreas = array_intersect($currentResearch, $matchResearch);
        $uniqueToYou = array_diff($currentResearch, $matchResearch);
        $uniqueToThem = array_diff($matchResearch, $currentResearch);
        
        // Calculate overlap percentage
        $totalUnique = count(array_unique(array_merge($currentResearch, $matchResearch)));
        $overlapPercentage = $totalUnique > 0 
            ? round((count($commonAreas) / $totalUnique) * 100) 
            : 0;
        
        // Get top 5 research areas for visualization
        $topCommon = array_slice($commonAreas, 0, 5);
        $topYours = array_slice($uniqueToYou, 0, 3);
        $topTheirs = array_slice($uniqueToThem, 0, 3);
        
        return [
            'overlapPercentage' => $overlapPercentage,
            'commonAreas' => array_values($topCommon),
            'yourUniqueAreas' => array_values($topYours),
            'theirUniqueAreas' => array_values($topTheirs),
            'totalCommon' => count($commonAreas),
            'totalYours' => count($currentResearch),
            'totalTheirs' => count($matchResearch),
        ];
    }
    
    /**
     * Calculate skills/strengths match between two profiles
     * 
     * @param array $currentUserProfile Current user's profile data
     * @param array $matchProfile The matched profile data
     * @param string $currentUserType Type of current user (academician/postgraduate/undergraduate)
     * @param string $matchType Type of matched profile (academician/postgraduate/undergraduate)
     * @return array Skills match data
     */
    public function calculateSkillsMatch(
        array $currentUserProfile,
        array $matchProfile,
        string $currentUserType,
        string $matchType
    ): array {
        // Extract skills based on profile type
        $currentSkills = $this->extractSkills($currentUserProfile, $currentUserType);
        $matchSkills = $this->extractSkills($matchProfile, $matchType);
        
        // Calculate matching skills with scores
        $matchedSkills = [];
        $allSkills = Skill::with('subdomain.domain')->get()->keyBy('id');
        
        foreach ($currentSkills as $skillId => $yourLevel) {
            if (isset($matchSkills[$skillId])) {
                $theirLevel = $matchSkills[$skillId];
                $skill = $allSkills->get($skillId);
                
                if ($skill) {
                    // Calculate match score based on skill level alignment
                    $matchScore = $this->calculateSkillMatchScore($yourLevel, $theirLevel);
                    
                    $matchedSkills[] = [
                        'skill' => $skill->name,
                        'domain' => $skill->subdomain->domain->name ?? 'General',
                        'matchScore' => $matchScore,
                        'yourLevel' => $this->getLevelName($yourLevel),
                        'theirLevel' => $this->getLevelName($theirLevel),
                    ];
                }
            }
        }
        
        // Sort by match score
        usort($matchedSkills, function($a, $b) {
            return $b['matchScore'] <=> $a['matchScore'];
        });
        
        // Get top 7 matching skills
        $topMatches = array_slice($matchedSkills, 0, 7);
        
        // Calculate overall skill match percentage
        $overallSkillMatch = count($matchedSkills) > 0
            ? round(array_sum(array_column($matchedSkills, 'matchScore')) / count($matchedSkills))
            : 0;
        
        // Calculate category scores
        $categories = $this->calculateCategoryScores($matchedSkills);
        
        return [
            'overallSkillMatch' => $overallSkillMatch,
            'topMatches' => $topMatches,
            'categories' => $categories,
            'totalMatchedSkills' => count($matchedSkills),
        ];
    }
    
    /**
     * Calculate comprehensive comparison including both research and skills
     * 
     * @param array $currentUserProfile Current user's profile data
     * @param array $matchProfile The matched profile data
     * @param string $currentUserType Type of current user
     * @param string $matchType Type of matched profile
     * @return array Complete comparison data
     */
    public function calculateFullComparison(
        array $currentUserProfile,
        array $matchProfile,
        string $currentUserType,
        string $matchType
    ): array {
        return [
            'researchOverlap' => $this->calculateResearchOverlap(
                $currentUserProfile,
                $matchProfile,
                $currentUserType,
                $matchType
            ),
            'skillsMatch' => $this->calculateSkillsMatch(
                $currentUserProfile,
                $matchProfile,
                $currentUserType,
                $matchType
            ),
        ];
    }
    
    /**
     * Extract research areas from profile based on type
     */
    protected function extractResearchAreas(array $profile, string $type): array
    {
        $researchAreas = [];
        
        switch ($type) {
            case 'academician':
                $expertise = $profile['research_expertise'] ?? [];
                if (is_string($expertise)) {
                    $expertise = json_decode($expertise, true) ?? [];
                }
                $researchAreas = is_array($expertise) ? $expertise : [];
                break;
                
            case 'postgraduate':
                $fields = $profile['field_of_research'] ?? [];
                if (is_string($fields)) {
                    $fields = json_decode($fields, true) ?? [];
                }
                $researchAreas = is_array($fields) ? $fields : [];
                break;
                
            case 'undergraduate':
                $preferences = $profile['research_preference'] ?? [];
                if (is_string($preferences)) {
                    $preferences = json_decode($preferences, true) ?? [];
                }
                $researchAreas = is_array($preferences) ? $preferences : [];
                break;
        }
        
        // Extract just the domain names from the combined IDs (format: field-area-domain)
        $domainNames = [];
        foreach ($researchAreas as $area) {
            if (is_string($area) && strpos($area, '-') !== false) {
                // This is a combined ID, we'll keep it as is for now
                $domainNames[] = $area;
            } else {
                $domainNames[] = $area;
            }
        }
        
        return array_unique($domainNames);
    }
    
    /**
     * Extract skills from profile based on type
     */
    protected function extractSkills(array $profile, string $type): array
    {
        $skills = [];
        
        // Get skills array from profile
        $skillsData = $profile['skills'] ?? [];
        if (is_string($skillsData)) {
            $skillsData = json_decode($skillsData, true) ?? [];
        }
        
        // Convert to skill_id => proficiency_level array
        if (is_array($skillsData)) {
            foreach ($skillsData as $skill) {
                if (isset($skill['skill_id']) && isset($skill['proficiency_level'])) {
                    $skills[$skill['skill_id']] = $skill['proficiency_level'];
                }
            }
        }
        
        return $skills;
    }
    
    /**
     * Calculate match score between two skill levels
     */
    protected function calculateSkillMatchScore(int $level1, int $level2): int
    {
        // Both at expert level (5)
        if ($level1 >= 4 && $level2 >= 4) {
            return 95;
        }
        
        // Both at advanced level (4)
        if ($level1 >= 3 && $level2 >= 3) {
            return 85;
        }
        
        // Calculate based on difference
        $difference = abs($level1 - $level2);
        
        switch ($difference) {
            case 0:
                return 90; // Perfect match
            case 1:
                return 75; // Close match
            case 2:
                return 60; // Moderate match
            case 3:
                return 45; // Weak match
            default:
                return 30; // Minimal match
        }
    }
    
    /**
     * Get human-readable level name
     */
    protected function getLevelName(int $level): string
    {
        return match($level) {
            5 => 'Expert',
            4 => 'Advanced',
            3 => 'Intermediate',
            2 => 'Beginner',
            1 => 'Novice',
            default => 'Unknown',
        };
    }
    
    /**
     * Calculate category-wise scores for skills
     */
    protected function calculateCategoryScores(array $matchedSkills): array
    {
        $categories = [
            'technical' => [],
            'research' => [],
            'domain' => [],
            'tools' => [],
        ];
        
        // Group skills by their domain categories
        foreach ($matchedSkills as $skill) {
            $domain = strtolower($skill['domain']);
            
            // Simple categorization logic
            if (str_contains($domain, 'programming') || str_contains($domain, 'software')) {
                $categories['technical'][] = $skill['matchScore'];
            } elseif (str_contains($domain, 'research') || str_contains($domain, 'methodology')) {
                $categories['research'][] = $skill['matchScore'];
            } elseif (str_contains($domain, 'tool') || str_contains($domain, 'technology')) {
                $categories['tools'][] = $skill['matchScore'];
            } else {
                $categories['domain'][] = $skill['matchScore'];
            }
        }
        
        // Calculate average for each category
        $scores = [];
        foreach ($categories as $category => $scores_array) {
            $scores[$category] = count($scores_array) > 0 
                ? round(array_sum($scores_array) / count($scores_array))
                : 0;
        }
        
        return $scores;
    }
}
