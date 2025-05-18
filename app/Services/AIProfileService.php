<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class AIProfileService
{
    /**
     * Generate a profile using OpenAI API (gpt-4o) via Guzzle.
     *
     * @param string $prompt
     * @return array|null
     */
    public function generateProfile(string $prompt): ?array
    {
        // Sanitize the prompt to ensure valid UTF-8 encoding
        $prompt = $this->sanitizeInput($prompt);
        
        $token = config('services.openai.key');
        $endpoint = config('services.openai.endpoint') . '/chat/completions';
        $modelName = env('OPENAI_MODEL', 'gpt-4o');

        Log::info('OpenAI API request', [
            'endpoint' => $endpoint,
            'model'    => $modelName,
            'token_prefix' => substr($token, 0, 10) . '...',
        ]);

        $client = new \GuzzleHttp\Client();

        // Merge headers: Authorization and Content-Type
        $headers = [
            'Authorization' => 'Bearer ' . $token,
            'Content-Type'  => 'application/json',
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
                'timeout' => 30, // Increase timeout for longer generations
            ]);

            $body = (string) $response->getBody();
            Log::info('OpenAI response', [
                'status' => $response->getStatusCode(),
                'response_length' => strlen($body)
            ]);

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
            Log::error('Error in OpenAI API call: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Sanitize input text to ensure valid UTF-8 encoding for JSON
     *
     * @param string $text
     * @return string
     */
    protected function sanitizeInput(string $text): string
    {
        $originalLength = strlen($text);
        
        // Check if the text contains valid UTF-8
        if (!mb_check_encoding($text, 'UTF-8')) {
            Log::info("Input text required UTF-8 sanitization", [
                'original_length' => $originalLength
            ]);
            
            // Convert to UTF-8, replacing invalid sequences
            $text = mb_convert_encoding($text, 'UTF-8', 'UTF-8');
            
            // Additional cleaning if needed
            $text = iconv('UTF-8', 'UTF-8//IGNORE', $text);
            
            // Log the results of sanitization
            $newLength = strlen($text);
            $difference = $originalLength - $newLength;
            Log::debug("UTF-8 sanitization result", [
                'original_length' => $originalLength,
                'new_length' => $newLength,
                'difference' => $difference,
                'difference_percentage' => ($originalLength > 0) ? round(($difference / $originalLength) * 100, 2) . '%' : '0%'
            ]);
        }
        
        // Remove null bytes and other control characters that can cause JSON encoding issues
        $beforeClean = strlen($text);
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text);
        $afterClean = strlen($text);
        
        if ($beforeClean !== $afterClean) {
            Log::debug("Removed control characters from text", [
                'before_cleaning' => $beforeClean,
                'after_cleaning' => $afterClean,
                'characters_removed' => $beforeClean - $afterClean
            ]);
        }
        
        return $text;
    }
}
