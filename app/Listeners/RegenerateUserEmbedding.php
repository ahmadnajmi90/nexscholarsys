<?php

namespace App\Listeners;

use App\Events\ProfileDataChanged;
use App\Services\EmbeddingService;

class RegenerateUserEmbedding
{
    protected EmbeddingService $embeddingService;

    public function __construct(EmbeddingService $embeddingService)
    {
        $this->embeddingService = $embeddingService;
    }

    public function handle(ProfileDataChanged $event): void
    {
        $this->embeddingService->generateForUser($event->user);
    }
}

