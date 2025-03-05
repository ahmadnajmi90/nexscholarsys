<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class GoogleSearchService
{
    protected $client;
    protected $apiKey;
    protected $cx;

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = config('services.google.custom_search_api_key');
        $this->cx = config('services.google.custom_search_cx');
    }

    /**
     * Fetch search results for a given query.
     *
     * @param string $query
     * @return array|null
     */
    public function fetchResults(string $query): ?array
    {
        $url = 'https://www.googleapis.com/customsearch/v1';

        try {
            $response = $this->client->get($url, [
                'query' => [
                    'key' => $this->apiKey,
                    'cx'  => $this->cx,
                    'q'   => $query,
                ],
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            Log::info("Google Search Results:", $data);
            return $data;
        } catch (\Exception $e) {
            Log::error("Google Custom Search error: " . $e->getMessage());
            return null;
        }
    }
}
