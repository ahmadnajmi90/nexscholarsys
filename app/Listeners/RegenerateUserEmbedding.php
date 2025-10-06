<?php

namespace App\Listeners;

use App\Events\ProfileDataChanged;
use App\Services\EmbeddingService;
use App\Services\ProfileCompletenessService;
use App\Services\QdrantService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class RegenerateUserEmbedding implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = 10;

    /**
     * The maximum number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 120;

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
        Log::info('Starting async embedding generation for user', [
            'user_id' => $event->user->id,
            'user_email' => $event->user->email
        ]);

        try {
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
            
            Log::info('Successfully generated embeddings for user', [
                'user_id' => $event->user->id
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to generate embeddings for user', [
                'user_id' => $event->user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Re-throw to trigger retry mechanism
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     *
     * @param ProfileDataChanged $event
     * @param \Throwable $exception
     * @return void
     */
    public function failed(ProfileDataChanged $event, \Throwable $exception): void
    {
        Log::error('Embedding generation failed permanently for user', [
            'user_id' => $event->user->id,
            'error' => $exception->getMessage(),
            'attempts' => $this->attempts()
        ]);
        
        // Optional: Notify admin or send notification to user
        // You could send an email or create a notification here
    }
}

