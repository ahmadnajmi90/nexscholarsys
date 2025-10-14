<?php

namespace App\Services;

use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use Illuminate\Support\Facades\Log;

class ProfileCompletenessService
{
    /**
     * Check if a profile is complete enough to be embedded in Qdrant
     *
     * @param mixed $profile The profile model instance (Academician, Postgraduate, or Undergraduate)
     * @param string|null $profileType The type of profile (academician, postgraduate, undergraduate)
     * @return bool
     */
    public function isProfileComplete($profile, string $profileType = null): bool
    {
        if (!$profile) {
            return false;
        }

        // Auto-detect profile type if not provided
        if (!$profileType) {
            if ($profile instanceof Academician) {
                $profileType = 'academician';
            } elseif ($profile instanceof Postgraduate) {
                $profileType = 'postgraduate';
            } elseif ($profile instanceof Undergraduate) {
                $profileType = 'undergraduate';
            } else {
                Log::warning('Unknown profile type for completeness check', [
                    'profile_class' => get_class($profile)
                ]);
                return false;
            }
        }

        // Check completeness based on profile type
        switch ($profileType) {
            case 'academician':
                return $this->isAcademicianProfileComplete($profile);
            case 'postgraduate':
                return $this->isPostgraduateProfileComplete($profile);
            case 'undergraduate':
                return $this->isUndergraduateProfileComplete($profile);
            default:
                Log::warning('Invalid profile type for completeness check', [
                    'profile_type' => $profileType
                ]);
                return false;
        }
    }

    /**
     * Check if an academician profile is complete
     *
     * @param Academician $academician
     * @return bool
     */
    protected function isAcademicianProfileComplete(Academician $academician): bool
    {
        // Required fields for a complete academician profile
        $hasBasicInfo = !empty($academician->academician_id) &&
                       !empty($academician->full_name);

        // Must have research expertise (not empty, not null, not '[]')
        $hasResearchExpertise = !empty($academician->research_expertise) &&
                               $academician->research_expertise !== '[]' &&
                               $academician->research_expertise !== 'null';

        // Must have field of study
        $hasFieldOfStudy = !empty($academician->field_of_study);

        // Must have a profile picture (not default)
        $hasProfilePicture = !empty($academician->profile_picture) &&
                            $academician->profile_picture !== 'profile_pictures/default.jpg';

        $isComplete = $hasBasicInfo && $hasResearchExpertise && $hasFieldOfStudy && $hasProfilePicture;

        if (!$isComplete) {
            Log::info('Academician profile incomplete', [
                'academician_id' => $academician->id,
                'has_basic_info' => $hasBasicInfo,
                'has_research_expertise' => $hasResearchExpertise,
                'has_field_of_study' => $hasFieldOfStudy,
                'has_profile_picture' => $hasProfilePicture
            ]);
        }

        return $isComplete;
    }

    /**
     * Check if a postgraduate profile is complete
     *
     * @param Postgraduate $postgraduate
     * @return bool
     */
    protected function isPostgraduateProfileComplete(Postgraduate $postgraduate): bool
    {
        // Required fields for a complete postgraduate profile
        $hasBasicInfo = !empty($postgraduate->postgraduate_id) &&
                       !empty($postgraduate->full_name);

        // Must have field of research (not empty, not null, not '[]')
        $hasFieldOfResearch = !empty($postgraduate->field_of_research) &&
                             $postgraduate->field_of_research !== '[]' &&
                             $postgraduate->field_of_research !== 'null';

        // Must have a profile picture (not default)
        $hasProfilePicture = !empty($postgraduate->profile_picture) &&
                            $postgraduate->profile_picture !== 'profile_pictures/default.jpg';

        $isComplete = $hasBasicInfo && $hasFieldOfResearch && $hasProfilePicture;

        if (!$isComplete) {
            Log::info('Postgraduate profile incomplete', [
                'postgraduate_id' => $postgraduate->id,
                'has_basic_info' => $hasBasicInfo,
                'has_field_of_research' => $hasFieldOfResearch,
                'has_profile_picture' => $hasProfilePicture
            ]);
        }

        return $isComplete;
    }

    /**
     * Check if an undergraduate profile is complete
     *
     * @param Undergraduate $undergraduate
     * @return bool
     */
    protected function isUndergraduateProfileComplete(Undergraduate $undergraduate): bool
    {
        // Required fields for a complete undergraduate profile
        $hasBasicInfo = !empty($undergraduate->undergraduate_id) &&
                       !empty($undergraduate->full_name);

        // Must have research preference (not empty, not null, not '[]')
        $hasResearchPreference = !empty($undergraduate->research_preference) &&
                                $undergraduate->research_preference !== '[]' &&
                                $undergraduate->research_preference !== 'null';

        // Must have CGPA
        $hasCGPA = !empty($undergraduate->CGPA_bachelor) &&
                  $undergraduate->CGPA_bachelor > 0;

        // Must have a profile picture (not default)
        $hasProfilePicture = !empty($undergraduate->profile_picture) &&
                            $undergraduate->profile_picture !== 'profile_pictures/default.jpg';

        $isComplete = $hasBasicInfo && $hasResearchPreference && $hasCGPA && $hasProfilePicture;

        if (!$isComplete) {
            Log::info('Undergraduate profile incomplete', [
                'undergraduate_id' => $undergraduate->id,
                'has_basic_info' => $hasBasicInfo,
                'has_research_preference' => $hasResearchPreference,
                'has_cgpa' => $hasCGPA,
                'has_profile_picture' => $hasProfilePicture
            ]);
        }

        return $isComplete;
    }

    /**
     * Check if a profile has minimum required fields for embedding generation
     * (Less strict than isProfileComplete, used for embedding text generation)
     *
     * @param mixed $profile
     * @param string|null $profileType
     * @return bool
     */
    public function hasMinimumRequiredFields($profile, string $profileType = null): bool
    {
        if (!$profile) {
            return false;
        }

        // Auto-detect profile type if not provided
        if (!$profileType) {
            if ($profile instanceof Academician) {
                $profileType = 'academician';
            } elseif ($profile instanceof Postgraduate) {
                $profileType = 'postgraduate';
            } elseif ($profile instanceof Undergraduate) {
                $profileType = 'undergraduate';
            }
        }

        switch ($profileType) {
            case 'academician':
                // For embedding, we at least need some text about their research
                return (!empty($profile->research_expertise) && 
                       $profile->research_expertise !== '[]' && 
                       $profile->research_expertise !== 'null') || 
                       !empty($profile->research_interests) ||
                       !empty($profile->bio) ||
                       !empty($profile->field_of_study);

            case 'postgraduate':
                return (!empty($profile->field_of_research) && 
                       $profile->field_of_research !== '[]' && 
                       $profile->field_of_research !== 'null') || 
                       !empty($profile->research_interests) ||
                       !empty($profile->thesis_title);

            case 'undergraduate':
                return (!empty($profile->research_preference) && 
                       $profile->research_preference !== '[]' && 
                       $profile->research_preference !== 'null') || 
                       !empty($profile->career_goals);

            default:
                return false;
        }
    }
}
