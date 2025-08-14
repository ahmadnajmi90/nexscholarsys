<?php

namespace App\Jobs;

use App\Models\PhDProgram;
use App\Services\OpenAICompletionService;
use Illuminate\Bus\Queueable;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateProgramResearchAreas implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    public function __construct(public PhDProgram $program) {}

    public function handle(OpenAICompletionService $openaiService): void
    {
        Log::info("Starting research area generation for Program ID: {$this->program->id}");

        if (!is_null($this->program->research_areas)) {
            Log::info("Program ID: {$this->program->id} already has research areas. Skipping.");
            return;
        }

        $prompt = $this->buildPrompt((string) ($this->program->description ?? ''));
        $response = $openaiService->generateCompletion($prompt, 0.5, 100);

        if (empty($response)) {
            Log::warning("AI returned no research areas for Program ID: {$this->program->id}");
            return;
        }

        Log::info("AI response for Program ID {$this->program->id}: " . $response);

        // --- CLEAN AI RESPONSE (strip markdown code fences, extract JSON array) ---
        if (preg_match('/\[.*\]/s', $response, $matches)) {
            $jsonString = $matches[0];
        } else {
            $jsonString = $response;
        }

        // Now, decode the cleaned string
        $areas = json_decode($jsonString, true);

        if (is_array($areas)) {
            $this->program->update(['research_areas' => $areas]);
            Log::info("Successfully generated and saved research areas for Program ID: {$this->program->id}");
        } else {
            Log::error("Failed to decode cleaned JSON string for Program ID: {$this->program->id}");
        }
    }

    private function buildPrompt(string $description): string
    {
        return <<<PROMPT
        You are an academic expert. Based on the following PhD program description, identify 3 to 5 core research area keywords.
        The keywords should be concise (1-3 words each).
        Return your answer ONLY as a single, valid JSON array of strings.

        Example:
        Input: "This program focuses on developing novel machine learning algorithms for natural language processing and computer vision."
        Output: ["Machine Learning", "Natural Language Processing", "Computer Vision"]

        Program Description:
        "{$description}"

        JSON Array Output:
        PROMPT;
    }
}

