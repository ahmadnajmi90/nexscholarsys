<?php

namespace App\Services;

use App\Models\Academician;
use App\Models\Publication;
use App\Models\ScholarProfile;
use App\Models\ScrapingLog;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use DOMDocument;
use DOMXPath;
use Exception;
use Illuminate\Support\Facades\Cache;

class GoogleScholarService
{
    protected $client;
    protected $userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Edg/92.0.902.55',
    ];

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 30,
            'headers' => [
                'User-Agent' => $this->getRandomUserAgent(),
                'Accept-Language' => 'en-US,en;q=0.9',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            ],
        ]);
    }

    /**
     * Scrape Google Scholar profile for an academician
     *
     * @param Academician $academician
     * @return bool
     */
    public function scrapeProfile(Academician $academician)
    {
        if (empty($academician->google_scholar)) {
            $this->logScraping($academician, 'failure', 'Google Scholar URL not found');
            return false;
        }

        // Check rate limiting
        if ($this->shouldThrottle()) {
            $this->logScraping($academician, 'failure', 'Rate limited by system');
            return false;
        }

        try {
            // Make the HTTP request
            $response = $this->client->get($academician->google_scholar, [
                'headers' => [
                    'User-Agent' => $this->getRandomUserAgent(),
                ],
            ]);

            $html = (string) $response->getBody();

            // Check if we got a CAPTCHA
            if (str_contains($html, 'id="captcha"') || str_contains($html, 'unusual traffic') || str_contains($html, "Sorry, we can't verify")) {
                $this->logScraping($academician, 'failure', 'CAPTCHA detected or unusual traffic warning');
                Cache::put('google_scholar_rate_limited', true, now()->addHours(6));
                return false;
            }

            // Parse the HTML
            $dom = new DOMDocument();
            @$dom->loadHTML($html);
            $xpath = new DOMXPath($dom);

            // Extract profile data
            $profileData = $this->extractProfileData($xpath);
            
            // Extract publication data
            $publications = $this->extractPublications($xpath);

            // Save data to database
            $this->saveProfileData($academician, $profileData);
            $this->savePublications($academician, $publications);

            // Log successful scraping
            $this->logScraping($academician, 'success', 'Profile scraped successfully');

            return true;
        } catch (RequestException $e) {
            $message = $e->getMessage();
            Log::error('Google Scholar scraping error: ' . $message);
            $this->logScraping($academician, 'failure', 'HTTP Request Error: ' . $message);
            return false;
        } catch (Exception $e) {
            $message = $e->getMessage();
            Log::error('Google Scholar scraping error: ' . $message);
            $this->logScraping($academician, 'failure', 'Error: ' . $message);
            return false;
        }
    }

    /**
     * Extract profile data from Google Scholar
     *
     * @param DOMXPath $xpath
     * @return array
     */
    protected function extractProfileData(DOMXPath $xpath)
    {
        $profileData = [
            'name' => '',
            'affiliation' => '',
            'total_citations' => 0,
            'h_index' => 0,
            'i10_index' => 0,
        ];

        // Extract name
        $nameNodes = $xpath->query('//div[@id="gsc_prf_in"]');
        if ($nameNodes->length > 0) {
            $profileData['name'] = trim($nameNodes->item(0)->textContent);
        }

        // Extract affiliation
        $affiliationNodes = $xpath->query('//div[@class="gsc_prf_il"]');
        if ($affiliationNodes->length > 0) {
            $profileData['affiliation'] = trim($affiliationNodes->item(0)->textContent);
        }

        // Extract citation metrics
        $tableRows = $xpath->query('//table[@id="gsc_rsb_st"]/tbody/tr');
        foreach ($tableRows as $row) {
            $label = $xpath->query('.//td[1]', $row)->item(0)->textContent;
            $value = (int) $xpath->query('.//td[2]', $row)->item(0)->textContent;

            if (str_contains(strtolower($label), 'citations')) {
                $profileData['total_citations'] = $value;
            } elseif (str_contains(strtolower($label), 'h-index')) {
                $profileData['h_index'] = $value;
            } elseif (str_contains(strtolower($label), 'i10-index')) {
                $profileData['i10_index'] = $value;
            }
        }

        return $profileData;
    }

    /**
     * Extract publications from Google Scholar
     *
     * @param DOMXPath $xpath
     * @return array
     */
    protected function extractPublications(DOMXPath $xpath)
    {
        $publications = [];
        $rows = $xpath->query('//tr[@class="gsc_a_tr"]');

        foreach ($rows as $index => $row) {
            $title = $xpath->query('.//a[@class="gsc_a_at"]', $row)->item(0);
            $authors = $xpath->query('.//div[@class="gs_gray"][1]', $row)->item(0);
            $venue = $xpath->query('.//div[@class="gs_gray"][2]', $row)->item(0);
            $year = $xpath->query('.//td[@class="gsc_a_y"]', $row)->item(0);
            $citations = $xpath->query('.//td[@class="gsc_a_c"]//a', $row)->item(0);
            
            // Get title text
            $titleText = $title ? trim($title->textContent) : '';
            
            // Get URL more safely
            $titleUrl = '';
            $hrefNodes = $xpath->query('.//a[@class="gsc_a_at"]/@href', $row);
            if ($hrefNodes && $hrefNodes->length > 0) {
                $titleUrl = 'https://scholar.google.com' . $hrefNodes->item(0)->nodeValue;
            }

            $publications[] = [
                'title' => $titleText,
                'url' => $titleUrl,
                'authors' => $authors ? trim($authors->textContent) : '',
                'venue' => $venue ? trim($venue->textContent) : '',
                'year' => $year ? trim($year->textContent) : '',
                'citations' => $citations ? (int) trim($citations->textContent) : 0,
            ];
        }

        return $publications;
    }

    /**
     * Save profile data to database
     *
     * @param Academician $academician
     * @param array $profileData
     * @return void
     */
    protected function saveProfileData(Academician $academician, array $profileData)
    {
        ScholarProfile::updateOrCreate(
            ['academician_id' => $academician->academician_id],
            [
                'name' => $profileData['name'],
                'affiliation' => $profileData['affiliation'],
                'total_citations' => $profileData['total_citations'],
                'h_index' => $profileData['h_index'],
                'i10_index' => $profileData['i10_index'],
                'last_scraped_at' => now(),
            ]
        );
    }

    /**
     * Save publications to database
     *
     * @param Academician $academician
     * @param array $publications
     * @return void
     */
    protected function savePublications(Academician $academician, array $publications)
    {
        foreach ($publications as $pubData) {
            Publication::updateOrCreate(
                [
                    'academician_id' => $academician->academician_id,
                    'title' => $pubData['title'],
                ],
                [
                    'authors' => $pubData['authors'],
                    'venue' => $pubData['venue'],
                    'year' => $pubData['year'],
                    'citations' => $pubData['citations'],
                    'url' => $pubData['url'],
                    'last_updated_at' => now(),
                ]
            );
        }
    }

    /**
     * Log scraping operation
     *
     * @param Academician $academician
     * @param string $status
     * @param string $message
     * @return void
     */
    protected function logScraping(Academician $academician, string $status, string $message)
    {
        ScrapingLog::create([
            'academician_id' => $academician->academician_id,
            'status' => $status,
            'message' => $message,
        ]);
    }

    /**
     * Get a random user agent
     *
     * @return string
     */
    protected function getRandomUserAgent()
    {
        return $this->userAgents[array_rand($this->userAgents)];
    }

    /**
     * Check if we should throttle requests
     *
     * @return bool
     */
    protected function shouldThrottle()
    {
        // If we're already rate-limited, throttle more aggressively
        if (Cache::get('google_scholar_rate_limited', false)) {
            // Sleep for a longer time when rate limited
            sleep(rand(20, 30));
            return rand(1, 100) <= 80; // 80% chance to throttle
        }

        // Normal throttling
        $key = 'google_scholar_last_request';
        $lastRequest = Cache::get($key, 0);
        $now = time();
        
        // Determine if we need to throttle (minimum 5-10 seconds between requests)
        $throttleSeconds = rand(5, 10);
        $shouldThrottle = ($now - $lastRequest) < $throttleSeconds;
        
        // Update the last request time
        Cache::put($key, $now, now()->addHour());
        
        // Add small random delay even if not throttling
        usleep(rand(500000, 1500000)); // 0.5-1.5 seconds
        
        return $shouldThrottle;
    }
} 