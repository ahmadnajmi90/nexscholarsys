<?php

namespace App\Services;

use App\Models\PostgraduateProgram;
use App\Models\User;
use App\Models\FieldOfResearch;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SupervisorMatchingService
{
    public function __construct(
        protected EmbeddingService $embeddingService,
        protected QdrantService $qdrantService,
        protected AIMatchInsightService $aiMatchInsightService,
    ) {}

    /**
     * Rank supervisors for a given program and user.
     */
    public function rankSupervisorsForProgram(PostgraduateProgram $program, User $user, ?string $providedCvPath = null, ?string $providedResearchText = null): array
    {
        // Step 1: Build user query vector
        $queryVector = $this->buildUserVector($user, $providedCvPath, $providedResearchText);

        // Step 2: Build research options map for ID -> name resolution
        $researchOptions = $this->buildResearchOptionsLookup();

        // Step 3: Load supervisors with relations and counts
        $supervisors = $program->academicians()
            ->withCount(['publications', 'postProjects'])
            ->with(['user'])
            ->get();

        Log::info("Supervisors: " . $supervisors);

        $results = [];
        foreach ($supervisors as $sup) {
            try {
                Log::info("Processing supervisor ID: {$sup->academician_id} ({$sup->full_name})");

                // 3a. Fetch supervisor vector from Qdrant and compute score
                $matchScore = null;
                if (!empty($queryVector)) {
                    $point = null;
                    if (method_exists($this->qdrantService, 'getPointByPayload')) {
                        $collection = config('services.qdrant.academicians_collection', 'nexscholar_academicians');
                        $point = $this->qdrantService->getPointByPayload($collection, ['academician_id' => $sup->academician_id]);
                        if (empty($point)) {
                            Log::warning("Primary lookup by academician_id failed; trying original_id for supervisor {$sup->academician_id}");
                            $point = $this->qdrantService->getPointByPayload($collection, ['original_id' => $sup->academician_id]);
                        }
                        if (empty($point)) {
                            Log::warning("Secondary lookup by original_id failed; trying mysql_id={$sup->id}");
                            $point = $this->qdrantService->getPointByPayload($collection, ['mysql_id' => $sup->id]);
                        }
                    }
                    if (empty($point['vector'])) {
                        Log::warning("No vector found in Qdrant for supervisor ID: {$sup->academician_id}");
                    } else {
                        $supVector = $point['vector'];
                        Log::info("Vector found for supervisor ID: {$sup->academician_id}. Calculating similarity...");
                        if (method_exists($this->qdrantService, 'cosineSimilarity')) {
                            $matchScore = $this->qdrantService->cosineSimilarity($queryVector, $supVector);
                        } else {
                            $dot = 0; $na = 0; $nb = 0;
                            for ($i = 0, $n = min(count($queryVector), count($supVector)); $i < $n; $i++) {
                                $dot += ($queryVector[$i] ?? 0) * ($supVector[$i] ?? 0);
                                $na += ($queryVector[$i] ?? 0) ** 2;
                                $nb += ($supVector[$i] ?? 0) ** 2;
                            }
                            $matchScore = ($na && $nb) ? $dot / (sqrt($na) * sqrt($nb)) : 0;
                        }
                        Log::info("Calculated match score for supervisor ID {$sup->id}: {$matchScore}");
                    }
                } else {
                    Log::warning('User query vector is empty. Cannot calculate match score.');
                }

                // 3b. Generate AI justification
                Log::info("Requesting justification from AIMatchInsightService for supervisor ID: {$sup->id}");
                $insight = $this->aiMatchInsightService->generateSupervisorInsight($user, $sup, $program, $researchOptions, $providedCvPath, $providedResearchText);
                Log::info("Received justification for supervisor ID {$sup->id}: " . substr((string) $insight, 0, 100) . '...');

                // Persist supervisor insight for analytics and faster retrieval
                try {
                    \App\Models\SupervisorInsight::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'academician_id' => $sup->id,
                            'postgraduate_program_id' => $program->id,
                        ],
                        [
                            'match_score' => $matchScore,
                            'justification' => (string) $insight,
                        ]
                    );
                } catch (\Throwable $persistEx) {
                    Log::error('Failed to persist supervisor insight', [
                        'user_id' => $user->id,
                        'academician_id' => $sup->id,
                        'postgraduate_program_id' => $program->id,
                        'error' => $persistEx->getMessage(),
                    ]);
                }

                // 3c. Map research expertise IDs to names
                $expertiseIds = is_array($sup->research_expertise ?? null) ? $sup->research_expertise : [];
                $expertiseNames = [];
                foreach ($expertiseIds as $rid) {
                    if (isset($researchOptions[$rid])) {
                        $expertiseNames[] = $researchOptions[$rid];
                    }
                }

                // 3d. Assemble final payload per mapping requirements
                $results[] = [
                    'id' => $sup->id,
                    'name' => $sup->full_name ?? ($sup->user->name ?? 'Supervisor'),
                    'research_areas' => $expertiseNames,
                    'publications_count' => $sup->publications_count ?? null,
                    'post_projects_count' => $sup->post_projects_count ?? null,
                    'accepting_students' => (bool) ($sup->availability_as_supervisor ?? true),
                    'match_score' => $matchScore,
                    'justification' => $insight,
                    'department' => $sup->department ?? '',
                    'avatar_url' => $sup->profile_picture ?? '',
                    'email' => $sup->user->email ?? '',
                    'url' => $sup->url ?? '',
                    'user' => $sup->user ?? null,
                ];
            } catch (\Throwable $t) {
                Log::error('SupervisorMatchingService: error for supervisor ' . $sup->id . ' -> ' . $t->getMessage());
            }
        }

        // Sort by match_score desc
        usort($results, function ($a, $b) {
            return (float) ($b['match_score'] ?? 0) <=> (float) ($a['match_score'] ?? 0);
        });

        return $results;
    }

    protected function buildUserVector(User $user, ?string $providedCvPath = null, ?string $providedResearchText = null): array
    {
        try {
            // Check if user is an academician and we have provided data
            $isAcademician = $user->academician !== null;
            
            if ($isAcademician && ($providedCvPath || $providedResearchText)) {
                // For academicians with provided data, use that instead of their profile
                $cacheKey = 'postgraduate_rec_user_vec_' . $user->id . '_' . md5($providedCvPath . $providedResearchText);
            } else {
                // For students or academicians without provided data, use their profile
                $cacheKey = 'postgraduate_rec_user_vec_' . $user->id;
            }
            
            $cached = Cache::get($cacheKey);
            if ($cached) return $cached;

            $cvText = '';
            $researchText = '';

            if ($isAcademician && ($providedCvPath || $providedResearchText)) {
                // For academicians, use provided CV and research text
                if ($providedCvPath && Storage::disk('public')->exists($providedCvPath)) {
                    try {
                        $cvText = app('App\\Services\\CVParserService')::getText($providedCvPath) ?? '';
                    } catch (\Throwable $t) {
                        Log::warning('SupervisorMatchingService: CV parsing failed for academician: ' . $t->getMessage());
                    }
                }
                
                if ($providedResearchText) {
                    $researchText = $providedResearchText;
                }
            } else {
                // For students or academicians without provided data, use their profile
                $profile = $user->academician ?? $user->postgraduate ?? $user->undergraduate;
                $cvPath = $profile?->cv_file ?? $profile?->CV_file ?? null;
                
                if ($cvPath && Storage::disk('public')->exists($cvPath) && class_exists('App\\Services\\CVParserService')) {
                    $cvText = app('App\\Services\\CVParserService')::getText($cvPath) ?? '';
                }

                // Resolve research interest IDs to names for student types
                if ($user->postgraduate && !empty($user->postgraduate->field_of_research)) {
                    $lookup = $this->buildResearchOptionsLookup();
                    $ids = is_array($user->postgraduate->field_of_research) ? $user->postgraduate->field_of_research : [];
                    $names = [];
                    foreach ($ids as $id) { if (isset($lookup[$id])) $names[] = $lookup[$id]; }
                    $researchText = implode('; ', $names);
                } elseif ($user->undergraduate && !empty($user->undergraduate->research_preference)) {
                    $lookup = $this->buildResearchOptionsLookup();
                    $ids = is_array($user->undergraduate->research_preference) ? $user->undergraduate->research_preference : [];
                    $names = [];
                    foreach ($ids as $id) { if (isset($lookup[$id])) $names[] = $lookup[$id]; }
                    $researchText = implode('; ', $names);
                }
            }

            $document = trim($cvText . "\n\n" . $researchText);
            $vector = $this->embeddingService->generateEmbedding($document, true) ?? [];
            Cache::put($cacheKey, $vector, now()->addMinutes(60));
            return $vector;
        } catch (\Throwable $t) {
            Log::error('SupervisorMatchingService.buildUserVector error: ' . $t->getMessage());
            return [];
        }
    }

    protected function buildResearchOptionsLookup(): array
    {
        $researchOptions = [];
        try {
            $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
            foreach ($fieldOfResearches as $field) {
                foreach ($field->researchAreas as $area) {
                    foreach ($area->nicheDomains as $domain) {
                        $combined_id = $field->id . '-' . $area->id . '-' . $domain->id;
                        $researchOptions[$combined_id] = "{$field->name} - {$area->name} - {$domain->name}";
                    }
                }
            }
        } catch (\Throwable $t) {
            Log::error('SupervisorMatchingService.buildResearchOptionsLookup error: ' . $t->getMessage());
        }
        return $researchOptions;
    }
}

