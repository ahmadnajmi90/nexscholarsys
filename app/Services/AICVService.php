<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class AICVService
{
    /**
     * Generate a refined academic CV text using AI.
     *
     * @param string $prompt
     * @return array|null
     */
    public function generateCV(string $prompt): ?array
    {
        $token = config('services.githubopenai.token');
        $endpoint = config('services.githubopenai.endpoint');
        $modelName = 'gpt-4o';
        
        Log::info('GitHub OpenAI CV request via Guzzle', [
            'endpoint' => $endpoint,
            'model'    => $modelName,
            'token'    => $token,
        ]);
        
        $client = new Client();
        $headers = [
            'Authorization' => 'Bearer ' . $token,
            'Content-Type'  => 'application/json',
            'User-Agent'    => 'openai-node/3.2.1'
        ];
        
        try {
            $response = $client->post($endpoint, [
                'headers' => $headers,
                'json'    => [
                    'model'    => $modelName,
                    'messages' => [
                        [
                            'role'    => 'system',
                            'content' => 'You are an AI that generates professional academic CVs.'
                        ],
                        [
                            'role'    => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'temperature' => 0.1,
                    'top_p'       => 1.0,
                    'max_tokens'  => 1500,
                ],
            ]);
            
            $body = (string) $response->getBody();
            Log::info('GitHub OpenAI CV response via Guzzle: ' . $body);
            $jsonResponse = json_decode($body, true);
            
            if (isset($jsonResponse['choices'][0]['message']['content'])) {
                $generatedText = trim($jsonResponse['choices'][0]['message']['content']);
                // Remove markdown code fences if present
                if (strpos($generatedText, '```') === 0) {
                    $generatedText = preg_replace('/^```(?:json)?\n/', '', $generatedText);
                    $generatedText = preg_replace('/\n```$/', '', $generatedText);
                }
                return ['cv_text' => $generatedText];
            }
        } catch (\Exception $e) {
            Log::error('Guzzle error in GitHub OpenAI CV API call: ' . $e->getMessage());
        }
        
        return null;
    }
}
