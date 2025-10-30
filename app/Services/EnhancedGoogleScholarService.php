<?php

namespace App\Services;

use App\Models\Academician;
use App\Models\Publication;
use App\Models\ScholarProfile;
use App\Models\ScrapingLog;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;
use Symfony\Component\DomCrawler\Crawler;
use Exception;

class EnhancedGoogleScholarService
{
    protected $client;
    protected $config;

    public function __construct()
    {
        $this->config = config('scraping.google_scholar');
        $this->client = new Client([
            'timeout' => $this->config['timeout'],
            'verify' => false, // For development; enable in production
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

        Log::info('Starting pagination scrape', [
            'academician_id' => $academician->id,
            'url' => $academician->google_scholar,
        ]);

        try {
            // Scrape all publications with pagination
            $result = $this->scrapeAllPublications($academician->google_scholar);

            if ($result === false) {
                $this->logScraping($academician, 'failure', 'Failed to scrape publications');
                return false;
            }

            // Extract profile data and publications
            $profileData = $result['profile'];
            $publications = $result['publications'];

            // Save data to database
            $this->saveProfileData($academician, $profileData);
            $this->savePublications($academician, $publications);

            // Log successful scraping
            $this->logScraping($academician, 'success', "Scraped {$result['total_publications']} publications across {$result['pages_scraped']} pages");

            Log::info('Scraping completed', [
                'academician_id' => $academician->id,
                'total_publications' => $result['total_publications'],
                'pages_scraped' => $result['pages_scraped'],
            ]);

            return true;
        } catch (Exception $e) {
            $message = $e->getMessage();
            Log::error('Google Scholar scraping error: ' . $message);
            $this->logScraping($academician, 'failure', 'Error: ' . $message);
            return false;
        }
    }

    /**
     * Scrape all publications with URL-based pagination
     *
     * @param string $googleScholarUrl
     * @return array|bool
     */
    public function scrapeAllPublications(string $googleScholarUrl)
    {
        // Extract user ID from URL
        $userId = $this->extractUserId($googleScholarUrl);
        
        if (!$userId) {
            Log::error('Could not extract user ID from URL', ['url' => $googleScholarUrl]);
            return false;
        }

        // Initialize variables
        $allPublications = [];
        $profileData = null;
        $page = 0;
        $pagesScraped = 0;
        $cookieJar = new CookieJar();
        $pageSize = $this->config['page_size'];
        $maxPages = $this->config['max_pages'];

        // Loop through pages until no more results
        while ($page < ($maxPages * $pageSize)) {
            // Build pagination URL
            $url = $this->buildPaginationUrl($userId, $page);

            // Human-like delay before request
            if ($page > 0) {
                $this->humanDelay();
            }

            try {
                // Make HTTP request
                $html = $this->makeRequest($url, $cookieJar);

                // Check for CAPTCHA
                if ($this->hasCAPTCHA($html)) {
                    Log::warning('CAPTCHA detected', [
                        'page' => $page,
                        'url' => $url,
                    ]);
                    break; // Stop scraping and return what we have
                }

                // Parse profile data (only on first page)
                if ($page === 0) {
                    $profileData = $this->extractProfileData($html);
                }

                // Parse publications from current page
                $publications = $this->parsePublications($html);

                Log::info('Page scraped', [
                    'page' => $page / $pageSize + 1,
                    'publications_found' => count($publications),
                ]);

                // Check if we've reached the end
                if (empty($publications)) {
                    break; // No more publications
                }

                // Add to collection
                $allPublications = array_merge($allPublications, $publications);
                $pagesScraped++;

                // Stop if we got fewer results than page size (last page)
                if (count($publications) < $pageSize) {
                    break;
                }

                // Move to next page
                $page += $pageSize;

            } catch (RequestException $e) {
                Log::error('Request failed', [
                    'page' => $page,
                    'error' => $e->getMessage(),
                ]);
                break; // Stop on error and return what we have
            }
        }

        return [
            'profile' => $profileData,
            'publications' => $allPublications,
            'total_publications' => count($allPublications),
            'pages_scraped' => $pagesScraped,
        ];
    }

    /**
     * Extract user ID from Google Scholar URL
     *
     * @param string $url
     * @return string|null
     */
    private function extractUserId(string $url): ?string
    {
        // Parse URL and extract 'user' parameter
        $parsedUrl = parse_url($url);
        
        if (!isset($parsedUrl['query'])) {
            return null;
        }

        parse_str($parsedUrl['query'], $params);

        return $params['user'] ?? null;
    }

    /**
     * Build pagination URL with cstart and pagesize parameters
     *
     * @param string $userId
     * @param int $page
     * @return string
     */
    private function buildPaginationUrl(string $userId, int $page): string
    {
        $params = [
            'user' => $userId,
            'hl' => 'en',
            'cstart' => $page,
            'pagesize' => $this->config['page_size'],
            'sortby' => 'pubdate', // Sort by publication date
        ];

        return 'https://scholar.google.com/citations?' . http_build_query($params);
    }

    /**
     * Make HTTP request with anti-detection measures
     *
     * @param string $url
     * @param CookieJar $cookieJar
     * @return string
     */
    private function makeRequest(string $url, CookieJar $cookieJar): string
    {
        $response = $this->client->get($url, [
            'cookies' => $cookieJar,
            'headers' => $this->getRealisticHeaders(),
        ]);

        return (string) $response->getBody();
    }

    /**
     * Check if response contains CAPTCHA
     *
     * @param string $html
     * @return bool
     */
    private function hasCAPTCHA(string $html): bool
    {
        $captchaIndicators = [
            'id="captcha"',
            'id="recaptcha"',
            'unusual traffic',
            'automated requests',
            'Sorry, we can\'t verify',
            'g-recaptcha',
        ];

        foreach ($captchaIndicators as $indicator) {
            if (str_contains($html, $indicator)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Extract profile data from HTML using Symfony DomCrawler
     *
     * @param string $html
     * @return array
     */
    private function extractProfileData(string $html): array
    {
        $crawler = new Crawler($html);

        $profileData = [
            'name' => '',
            'affiliation' => '',
            'total_citations' => 0,
            'h_index' => 0,
            'i10_index' => 0,
        ];

        try {
            // Extract name
            $nameNode = $crawler->filter('#gsc_prf_in');
            if ($nameNode->count() > 0) {
                $profileData['name'] = trim($nameNode->text());
            }

            // Extract affiliation
            $affiliationNode = $crawler->filter('.gsc_prf_il');
            if ($affiliationNode->count() > 0) {
                $profileData['affiliation'] = trim($affiliationNode->text());
            }

            // Extract citation metrics from table
            $tableRows = $crawler->filter('#gsc_rsb_st tbody tr');
            $tableRows->each(function (Crawler $row) use (&$profileData) {
                $label = $row->filter('td')->eq(0)->text();
                $value = (int) $row->filter('td')->eq(1)->text();

                if (str_contains(strtolower($label), 'citations')) {
                    $profileData['total_citations'] = $value;
                } elseif (str_contains(strtolower($label), 'h-index')) {
                    $profileData['h_index'] = $value;
                } elseif (str_contains(strtolower($label), 'i10-index')) {
                    $profileData['i10_index'] = $value;
                }
            });

        } catch (Exception $e) {
            Log::warning('Failed to extract some profile data', ['error' => $e->getMessage()]);
        }

        return $profileData;
    }

    /**
     * Parse publications from HTML using Symfony DomCrawler
     *
     * @param string $html
     * @return array
     */
    private function parsePublications(string $html): array
    {
        $crawler = new Crawler($html);
        $publications = [];

        try {
            $rows = $crawler->filter('.gsc_a_tr');

            $rows->each(function (Crawler $row) use (&$publications) {
                try {
                    // Extract title and URL
                    $titleNode = $row->filter('.gsc_a_at');
                    $title = $titleNode->count() > 0 ? trim($titleNode->text()) : '';
                    
                    $url = '';
                    if ($titleNode->count() > 0) {
                        $href = $titleNode->attr('href');
                        if ($href) {
                            $url = 'https://scholar.google.com' . $href;
                        }
                    }

                    // Extract authors
                    $authorsNode = $row->filter('.gs_gray')->eq(0);
                    $authors = $authorsNode->count() > 0 ? trim($authorsNode->text()) : '';

                    // Extract venue
                    $venueNode = $row->filter('.gs_gray')->eq(1);
                    $venue = $venueNode->count() > 0 ? trim($venueNode->text()) : '';

                    // Extract year
                    $yearNode = $row->filter('.gsc_a_y');
                    $year = $yearNode->count() > 0 ? trim($yearNode->text()) : '';

                    // Extract citations
                    $citationsNode = $row->filter('.gsc_a_c a');
                    $citations = 0;
                    if ($citationsNode->count() > 0) {
                        $citations = (int) trim($citationsNode->text());
                    }

                    if (!empty($title)) {
                        $publications[] = [
                            'title' => $title,
                            'url' => $url,
                            'authors' => $authors,
                            'venue' => $venue,
                            'year' => $year,
                            'citations' => $citations,
                        ];
                    }

                } catch (Exception $e) {
                    Log::warning('Failed to parse publication row', ['error' => $e->getMessage()]);
                }
            });

        } catch (Exception $e) {
            Log::error('Failed to parse publications', ['error' => $e->getMessage()]);
        }

        return $publications;
    }

    /**
     * Get realistic HTTP headers with rotating user agent
     *
     * @return array
     */
    private function getRealisticHeaders(): array
    {
        return [
            'User-Agent' => UserAgentPool::getRandom(),
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language' => 'en-US,en;q=0.9',
            'Accept-Encoding' => 'gzip, deflate, br',
            'DNT' => '1',
            'Connection' => 'keep-alive',
            'Upgrade-Insecure-Requests' => '1',
            'Sec-Fetch-Site' => 'none',
            'Sec-Fetch-Mode' => 'navigate',
            'Sec-Fetch-User' => '?1',
            'Sec-Fetch-Dest' => 'document',
            'Referer' => 'https://www.google.com/',
            'Cache-Control' => 'max-age=0',
        ];
    }

    /**
     * Random human-like delay between requests
     *
     * @return void
     */
    private function humanDelay(): void
    {
        $minDelay = $this->config['request_delay_min'];
        $maxDelay = $this->config['request_delay_max'];
        
        // Random delay in seconds
        $seconds = rand($minDelay, $maxDelay);
        
        // Add random microseconds for more realistic timing
        $microseconds = rand(0, 999999);
        
        sleep($seconds);
        usleep($microseconds);
    }

    /**
     * Save profile data to database
     *
     * @param Academician $academician
     * @param array $profileData
     * @return void
     */
    private function saveProfileData(Academician $academician, array $profileData): void
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
    private function savePublications(Academician $academician, array $publications): void
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
    private function logScraping(Academician $academician, string $status, string $message): void
    {
        ScrapingLog::create([
            'academician_id' => $academician->academician_id,
            'status' => $status,
            'message' => $message,
        ]);
    }
}

