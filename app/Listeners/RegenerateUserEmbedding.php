<?php

namespace App\Listeners;

use App\Events\ProfileDataChanged;
use App\Services\EmbeddingService;
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

    public function __construct(EmbeddingService $embeddingService)
    {
        $this->embeddingService = $embeddingService;
    }

    public function handle(ProfileDataChanged $event): void
    {
        Log::info('Starting async embedding generation for user', [
            'user_id' => $event->user->id,
            'user_email' => $event->user->email
        ]);

        try {
            $this->embeddingService->generateForUser($event->user);
            
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

