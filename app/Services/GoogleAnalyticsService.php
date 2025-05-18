<?php

namespace App\Services;

use Google\Analytics\Data\V1beta\Client\BetaAnalyticsDataClient;
use Google\Analytics\Data\V1beta\DateRange;
use Google\Analytics\Data\V1beta\Dimension;
use Google\Analytics\Data\V1beta\Filter;
use Google\Analytics\Data\V1beta\Filter\StringFilter;
use Google\Analytics\Data\V1beta\Filter\StringFilter\MatchType;
use Google\Analytics\Data\V1beta\FilterExpression;
use Google\Analytics\Data\V1beta\Metric;
use Google\Analytics\Data\V1beta\OrderBy;
use Google\Analytics\Data\V1beta\RunReportRequest;
use Illuminate\Support\Facades\Cache;
use Exception;
use Illuminate\Support\Facades\Log;

class GoogleAnalyticsService
{
    protected $client;
    protected $propertyId;
    protected $cacheLifetime;

    public function __construct()
    {
        try {
            $this->propertyId = config('analytics.property_id');
            $this->cacheLifetime = config('analytics.cache_lifetime', 60);
            
            $credentialsPath = config('analytics.service_account_credentials_json');
            $measurementId = config('analytics.measurement_id');
            
            // Validate measurement ID format
            if ($measurementId !== 'G-Q6VXXF3B0T' && !app()->environment('testing')) {
                Log::warning('Google Analytics measurement ID does not match expected value (G-Q6VXXF3B0T)', [
                    'configured_id' => $measurementId
                ]);
            }
            
            // Debug logging to help troubleshoot
            Log::info('Google Analytics initialization attempt', [
                'property_id' => $this->propertyId,
                'measurement_id' => $measurementId,
                'credentials_path' => $credentialsPath,
                'file_exists' => file_exists($credentialsPath) ? 'true' : 'false'
            ]);
            
            if (!file_exists($credentialsPath)) {
                Log::error("Google Analytics credentials file not found at: {$credentialsPath}");
                return; // Exit early, don't try to initialize the client
            }
            
            $this->client = new BetaAnalyticsDataClient([
                'credentials' => $credentialsPath
            ]);
            
            Log::info('Google Analytics client initialized successfully');
        } catch (Exception $e) {
            Log::error('Google Analytics initialization error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'code' => $e->getCode()
            ]);
        }
    }

    /**
     * Get active users count
     *
     * @return int
     */
    public function getActiveUsers()
    {
        return Cache::remember('ga_active_users', $this->cacheLifetime, function () {
            try {
                if (!$this->client) {
                    Log::warning('Google Analytics client not initialized. Returning 0 for active users.');
                    return 0;
                }
                
                $request = new RunReportRequest();
                $request->setProperty('properties/' . $this->propertyId);
                
                $dateRange = new DateRange();
                $dateRange->setStartDate('1daysAgo');
                $dateRange->setEndDate('today');
                $request->setDateRanges([$dateRange]);
                
                $metric = new Metric();
                $metric->setName('activeUsers');
                $request->setMetrics([$metric]);
                
                $response = $this->client->runReport($request);

                if (count($response->getRows()) > 0) {
                    return (int) $response->getRows()[0]->getMetricValues()[0]->getValue();
                }
                
                return 0;
            } catch (Exception $e) {
                Log::error('Google Analytics active users error: ' . $e->getMessage());
                return 0;
            }
        });
    }

    /**
     * Get average session duration
     *
     * @return float
     */
    public function getAverageSessionDuration()
    {
        return Cache::remember('ga_avg_session_duration', $this->cacheLifetime, function () {
            try {
                if (!$this->client) {
                    Log::warning('Google Analytics client not initialized. Returning 0 for session duration.');
                    return 0;
                }
                
                $request = new RunReportRequest();
                $request->setProperty('properties/' . $this->propertyId);
                
                $dateRange = new DateRange();
                $dateRange->setStartDate('30daysAgo');
                $dateRange->setEndDate('today');
                $request->setDateRanges([$dateRange]);
                
                $metric = new Metric();
                $metric->setName('averageSessionDuration');
                $request->setMetrics([$metric]);
                
                $response = $this->client->runReport($request);

                if (count($response->getRows()) > 0) {
                    return round((float) $response->getRows()[0]->getMetricValues()[0]->getValue());
                }
                
                return 0;
            } catch (Exception $e) {
                Log::error('Google Analytics session duration error: ' . $e->getMessage());
                return 0;
            }
        });
    }

    /**
     * Get top pages by pageviews
     *
     * @param int $limit
     * @return array
     */
    public function getTopPages($limit = 10)
    {
        return Cache::remember('ga_top_pages_' . $limit, $this->cacheLifetime, function () use ($limit) {
            try {
                if (!$this->client) {
                    Log::warning('Google Analytics client not initialized. Returning empty array for top pages.');
                    return [];
                }
                
                $request = new RunReportRequest();
                $request->setProperty('properties/' . $this->propertyId);
                
                $dateRange = new DateRange();
                $dateRange->setStartDate('30daysAgo');
                $dateRange->setEndDate('today');
                $request->setDateRanges([$dateRange]);
                
                $dimensionPath = new Dimension();
                $dimensionPath->setName('pagePath');
                
                $dimensionTitle = new Dimension();
                $dimensionTitle->setName('pageTitle');
                $request->setDimensions([$dimensionPath, $dimensionTitle]);
                
                $metric = new Metric();
                $metric->setName('screenPageViews');
                $request->setMetrics([$metric]);
                
                $orderBy = new OrderBy();
                $metricOrderBy = new OrderBy\MetricOrderBy();
                $metricOrderBy->setMetricName('screenPageViews');
                $orderBy->setMetric($metricOrderBy);
                $orderBy->setDesc(true);
                $request->setOrderBys([$orderBy]);
                
                $request->setLimit($limit);
                
                $response = $this->client->runReport($request);

                $results = [];
                foreach ($response->getRows() as $row) {
                    $results[] = [
                        'path' => $row->getDimensionValues()[0]->getValue(),
                        'title' => $row->getDimensionValues()[1]->getValue(),
                        'views' => (int) $row->getMetricValues()[0]->getValue(),
                    ];
                }
                
                return $results;
            } catch (Exception $e) {
                Log::error('Google Analytics top pages error: ' . $e->getMessage());
                return [];
            }
        });
    }

    /**
     * Get page views over time
     *
     * @param int $days
     * @return array
     */
    public function getPageViewsOverTime($days = 30)
    {
        return Cache::remember('ga_pageviews_over_time_' . $days, $this->cacheLifetime, function () use ($days) {
            try {
                if (!$this->client) {
                    Log::warning('Google Analytics client not initialized. Returning empty array for page views over time.');
                    return [];
                }
                
                $request = new RunReportRequest();
                $request->setProperty('properties/' . $this->propertyId);
                
                $dateRange = new DateRange();
                $dateRange->setStartDate($days . 'daysAgo');
                $dateRange->setEndDate('today');
                $request->setDateRanges([$dateRange]);
                
                $dimension = new Dimension();
                $dimension->setName('date');
                $request->setDimensions([$dimension]);
                
                $metric = new Metric();
                $metric->setName('screenPageViews');
                $request->setMetrics([$metric]);
                
                $orderBy = new OrderBy();
                $dimensionOrderBy = new OrderBy\DimensionOrderBy();
                $dimensionOrderBy->setDimensionName('date');
                $orderBy->setDimension($dimensionOrderBy);
                $orderBy->setDesc(false);
                $request->setOrderBys([$orderBy]);
                
                $response = $this->client->runReport($request);

                $results = [];
                foreach ($response->getRows() as $row) {
                    $date = $row->getDimensionValues()[0]->getValue();
                    // Format: YYYYMMDD to YYYY-MM-DD
                    $formattedDate = substr($date, 0, 4) . '-' . substr($date, 4, 2) . '-' . substr($date, 6, 2);
                    
                    $results[] = [
                        'date' => $formattedDate,
                        'views' => (int) $row->getMetricValues()[0]->getValue(),
                    ];
                }
                
                return $results;
            } catch (Exception $e) {
                Log::error('Google Analytics page views over time error: ' . $e->getMessage());
                return [];
            }
        });
    }
} 