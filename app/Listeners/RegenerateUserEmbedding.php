<?php

namespace App\Listeners;

use App\Events\ProfileDataChanged;
use App\Services\EmbeddingService;
use App\Services\ProfileCompletenessService;
use App\Services\QdrantService;
use Illuminate\Support\Facades\Log;

class RegenerateUserEmbedding
{
    protected EmbeddingService $embeddingService;
    protected ProfileCompletenessService $profileCompletenessService;
    protected QdrantService $qdrantService;

    public function __construct(
        EmbeddingService $embeddingService,
        ProfileCompletenessService $profileCompletenessService,
        QdrantService $qdrantService
    ) {
        $this->embeddingService = $embeddingService;
        $this->profileCompletenessService = $profileCompletenessService;
        $this->qdrantService = $qdrantService;
    }

    public function handle(ProfileDataChanged $event): void
    {
        $user = $event->user;
        
        // Determine the profile and profile type
        $profile = null;
        $profileType = null;
        $profileId = null;
        
        if ($user->academician) {
            $profile = $user->academician;
            $profileType = 'academician';
            $profileId = $profile->academician_id;
        } elseif ($user->postgraduate) {
            $profile = $user->postgraduate;
            $profileType = 'postgraduate';
            $profileId = $profile->postgraduate_id;
        } elseif ($user->undergraduate) {
            $profile = $user->undergraduate;
            $profileType = 'undergraduate';
            $profileId = $profile->undergraduate_id;
        }
        
        if (!$profile || !$profileId) {
            Log::warning('RegenerateUserEmbedding: No profile found for user', [
                'user_id' => $user->id
            ]);
            return;
        }
        
        // Check if the profile is complete
        $isComplete = $this->profileCompletenessService->isProfileComplete($profile, $profileType);
        
        if (!$isComplete) {
            Log::info('RegenerateUserEmbedding: Profile incomplete, skipping Qdrant update', [
                'user_id' => $user->id,
                'profile_type' => $profileType,
                'profile_id' => $profileId
            ]);
            
            // If profile was previously embedded but is now incomplete, remove from Qdrant
            if ($profile->qdrant_migrated) {
                Log::info('RegenerateUserEmbedding: Removing incomplete profile from Qdrant', [
                    'profile_type' => $profileType,
                    'profile_id' => $profileId
                ]);
                
                // Delete from Qdrant
                if ($profileType === 'academician') {
                    $this->qdrantService->deleteAcademicianEmbedding($profileId);
                } else {
                    $this->qdrantService->deleteStudentEmbedding($profileType, $profile->id);
                }
                
                // Update the migration status
                $profile->qdrant_migrated = false;
                $profile->qdrant_migrated_at = null;
                $profile->save();
            }
            
            return;
        }
        
        // Profile is complete, proceed with embedding generation
        Log::info('RegenerateUserEmbedding: Profile complete, updating Qdrant', [
            'user_id' => $user->id,
            'profile_type' => $profileType,
            'profile_id' => $profileId
        ]);
        
        $this->embeddingService->generateForUser($user);
    }
}

