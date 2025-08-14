<?php

namespace App\Services;

use App\Models\PhDProgram;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProgramMatchingService
{
    public function __construct(
        protected EmbeddingService $embeddingService,
        protected QdrantService $qdrantService,
        protected OpenAICompletionService $openaiService,
    ) {
    }

    /**
     * Find programs for the given user and generate AI justifications.
     *
     * @return array<int, array<string, mixed>> Saved recommendation rows
     */
    public function findAndAnalyzePrograms(User $user, string $jobKey, string $profileHash): array
    {
        // --- ADD THIS BLOCK: CHECK FOR EXISTING RESULTS FIRST ---
        $existingResult = DB::table('program_recommendation_results')
            ->where('user_id', $user->id)
            ->where('profile_hash', $profileHash)
            ->exists();

        if ($existingResult) {
            Log::info("ProgramMatchingService: Found existing results for user {$user->id} with profile_hash {$profileHash}. Skipping analysis.");
            // We can return an empty array because the controller/job will fetch existing results.
            return [];
        }

        $results = [];

        try {
            // Build student profile text from CV and stored interests
            [$cvText, $studentInterests] = $this->buildStudentProfileText($user);
            $studentProfileSummary = trim(substr($cvText, 0, 1200));

            $queryDocument = trim($cvText . "\n\n" . $studentInterests);
            if ($queryDocument === '') {
                Log::warning("ProgramMatchingService: Empty query document for user {$user->id}");
                return $results;
            }

            // Generate embedding for student profile
            $queryVector = $this->embeddingService->generateEmbedding($queryDocument, true);
            if (empty($queryVector)) {
                Log::error("ProgramMatchingService: Empty embedding for user {$user->id}");
                return $results;
            }

            // Qdrant similarity search
            $qdrantResults = $this->qdrantService->searchVectors('nexscholar_phd_programs', $queryVector, 10, 0.2);
            Log::info("ProgramMatchingService: Qdrant returned " . count($qdrantResults) . " results for user {$user->id}");

            // Use provided identifiers from the job
            $batchId = $jobKey;

            foreach ($qdrantResults as $i => $result) {
                $payload = $result['payload'] ?? [];
                $mysqlId = $payload['phd_program_id'] ?? ($payload['mysql_id'] ?? null);
                $score = (float) ($result['score'] ?? 0);
                if (!$mysqlId) {
                    Log::warning("ProgramMatchingService: Skipping result #{$i} due to missing program ID in payload.");
                    continue;
                }

                $program = PhDProgram::with(['university', 'faculty'])->find($mysqlId);
                if (!$program) {
                    Log::warning("ProgramMatchingService: Program not found in DB for id={$mysqlId}.");
                    continue;
                }

                // Build AI data payload
                $data = [
                    'match_type' => 'student_to_program',
                    'student_profile_summary' => $studentProfileSummary,
                    'student_research_interests' => $studentInterests,
                    'program_name' => $program->name ?? 'PhD Program',
                    'program_university' => $program->university->full_name ?? $program->university->name ?? 'University',
                    'program_description' => (string) ($program->description ?? ''),
                    'program_funding' => (string) ($program->funding_info ?? ''),
                ];

                // Generate AI justification
                $insight = $this->openaiService->generateMatchInsight($data);
                $insight = trim($insight);

                // Save recommendation row
                DB::table('program_recommendation_results')->insert([
                    'user_id' => $user->id,
                    'phd_program_id' => $program->id,
                    'batch_id' => $batchId,
                    'profile_hash' => $profileHash,
                    'match_score' => $score,
                    'justification' => $insight ?: 'Match based on overlap between your research interests and program description.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $results[] = [
                    'phd_program_id' => $program->id,
                    'match_score' => $score,
                    'justification' => $insight,
                ];
            }

            return $results;
        } catch (\Throwable $e) {
            Log::error('ProgramMatchingService error: ' . $e->getMessage());
            return $results;
        }
    }

    /**
     * Compose student's profile text from CV and stored interests.
     *
     * @return array{0:string,1:string} [cvText, interestsText]
     */
    protected function buildStudentProfileText(User $user): array
    {
        $cvText = '';
        $interestsText = '';

        $profile = $user->academician ?? $user->postgraduate ?? $user->undergraduate;
        if ($profile) {
            // CV text
            try {
                $cvPath = $profile->cv_file ?? $profile->CV_file ?? null;
                if ($cvPath && Storage::disk('public')->exists($cvPath)) {
                    /** @var \App\Services\CVParserService $cvParser */
                    $cvParser = resolve(\App\Services\CVParserService::class);
                    $cvText = (string) $cvParser::getText($cvPath);
                }
            } catch (\Throwable $t) {
                Log::warning('ProgramMatchingService: CV parsing failed: ' . $t->getMessage());
            }

            // Interests from profile
            $fields = [];
            foreach (['field_of_research', 'research_preference', 'bio', 'about', 'suggested_research_title', 'suggested_research_description'] as $key) {
                $val = $profile->{$key} ?? null;
                if (is_string($val) && trim($val) !== '') {
                    $fields[] = $val;
                } elseif (is_array($val) && !empty($val)) {
                    $fields[] = implode(', ', array_filter(array_map('strval', $val)));
                }
            }
            $interestsText = implode("\n", $fields);
        }

        return [$cvText, $interestsText];
    }
}

