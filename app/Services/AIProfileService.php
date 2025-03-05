<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class AIProfileService
{
    /**
     * Generate a profile using GitHub OpenAI inference (gpt-4o) via Guzzle.
     *
     * @param string $prompt
     * @return array|null
     */
    public function generateProfile(string $prompt): ?array
    {
        $token = config('services.githubopenai.token');
        // Ensure your endpoint includes the full path (e.g., /openai/deployments/gpt-4o/chat/completions?api-version=2023-03-15-preview)
        $endpoint = config('services.githubopenai.endpoint');
        $modelName = 'gpt-4o';

        Log::info('GitHub OpenAI request via Guzzle', [
            'endpoint' => $endpoint,
            'model'    => $modelName,
            'token'    => $token,
        ]);

        $client = new \GuzzleHttp\Client();

        // Merge headers: Authorization, Content-Type, and User-Agent.
        // Here we mimic the Node.js client with 'openai-node/3.2.1'
        $headers = [
            'Authorization' => 'Bearer ' . $token,
            'Content-Type'  => 'application/json',
            'User-Agent'    => 'openai-node/3.2.1'
        ];

        try {
            $response = $client->post($endpoint, [
                'headers' => $headers,
                'json' => [
                    'model'    => $modelName,
                    'messages' => [
                        [
                            'role'    => 'system',
                            'content' => 'You are an AI that generates detailed academic profiles.'
                        ],
                        [
                            'role'    => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'temperature' => 0.1,
                    'top_p'       => 1.0,
                    'max_tokens'  => 1000,
                ],
            ]);

            $body = (string) $response->getBody();
            Log::info('GitHub OpenAI response via Guzzle: ' . $body);

            $jsonResponse = json_decode($body, true);

            if (isset($jsonResponse['choices'][0]['message']['content'])) {
                $generatedText = trim($jsonResponse['choices'][0]['message']['content']);

                // Remove markdown code fences if present
                if (strpos($generatedText, '```') === 0) {
                    $generatedText = preg_replace('/^```(?:json)?\n/', '', $generatedText);
                    $generatedText = preg_replace('/\n```$/', '', $generatedText);
                }

                return json_decode($generatedText, true, 512, JSON_THROW_ON_ERROR);
            }
        } catch (\Exception $e) {
            Log::error('Guzzle error in GitHub OpenAI API call: ' . $e->getMessage());
        }

        return null;
    }

}
