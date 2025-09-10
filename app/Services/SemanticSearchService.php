<?php

namespace App\Services;

use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class SemanticSearchService
{
    protected $embeddingService;
    protected $openaiCompletionService;
    protected $qdrantService;
    protected $useQdrant;

    public function __construct(
        EmbeddingService $embeddingService, 
        OpenAICompletionService $openaiCompletionService,
        QdrantService $qdrantService
    )
    {
        $this->embeddingService = $embeddingService;
        $this->openaiCompletionService = $openaiCompletionService;
        $this->qdrantService = $qdrantService;
        
        // Check if Qdrant search is enabled globally
        $globallyEnabled = config('services.qdrant.enabled', false);
        
        // Check if it's enabled for this specific request (set by middleware)
        $requestEnabled = config('services.qdrant.use_for_request', null);
        
        // Use per-request setting if available, otherwise fall back to global setting
        $this->useQdrant = $requestEnabled ?? $globallyEnabled;
        
        Log::info('SemanticSearchService initialized', [
            'use_qdrant' => $this->useQdrant,
            'globally_enabled' => $globallyEnabled,
            'request_enabled' => $requestEnabled
        ]);
    }

    /**
     * Find similar academicians based on a query using semantic search
     *
     * @param string $query The search query
     * @param int $limit Maximum number of results to return
     * @param float $threshold Minimum similarity threshold (0-1)
     * @param int|null $studentId Student ID for personalized search
     * @param string|null $studentType Student type (postgraduate/undergraduate)
     * @param bool|null $forceUseQdrant Override default Qdrant setting
     * @return array Array of academicians with similarity scores
     */
    public function findSimilarAcademicians(
        string $query, 
        int $limit = 10, 
        float $threshold = 0.3, 
        int $studentId = null, 
        string $studentType = null,
        bool $forceUseQdrant = null
    ): array
    {
        try {
            // Determine if we should use Qdrant or MySQL
            $useQdrant = $forceUseQdrant ?? $this->useQdrant;
            
            // Log the search strategy
            Log::info('Semantic search strategy', [
                'query' => $query,
                'use_qdrant' => $useQdrant,
                'limit' => $limit,
                'threshold' => $threshold
            ]);
            
            // Check if the query is vague and we should prioritize student profile
            $isVagueQuery = $this->isVagueQuery($query);
            $studentEmbedding = null;
            
            // If we have student info, try to get their embedding
            if ($studentId && $studentType) {
                $studentEmbedding = $this->getStudentEmbedding($studentId, $studentType);
                
                // If query is vague but we have student embedding, log this usage
                if ($isVagueQuery && $studentEmbedding) {
                    Log::info("Using student profile embedding for search due to vague query", [
                        'student_id' => $studentId,
                        'student_type' => $studentType,
                        'query' => $query
                    ]);
                }
            }
            
            // Generate embedding for the query (if not vague or if student embedding is missing)
            $queryEmbedding = null;
            if (!$isVagueQuery || !$studentEmbedding) {
                $queryEmbedding = $this->embeddingService->generateEmbedding($query, true);
                
                if (!$queryEmbedding) {
                    Log::error('Failed to generate embedding for query: ' . $query);
                    if (!$studentEmbedding) {
                        return []; // No embeddings at all, return empty results
                    }
                }
            }
            
            // Choose search strategy based on configuration
            if ($useQdrant) {
                return $this->searchUsingQdrant($queryEmbedding, $studentEmbedding, $isVagueQuery, $limit, $threshold, $studentId, $studentType);
            } else {
                return $this->searchUsingMySQL($queryEmbedding, $studentEmbedding, $isVagueQuery, $limit, $threshold, $studentId, $studentType);
            }
        } catch (\Exception $e) {
            Log::error('Error in semantic search: ' . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Search using Qdrant vector database
     */
    protected function searchUsingQdrant(array $queryEmbedding = null, array $studentEmbedding = null, bool $isVagueQuery = false, int $limit = 10, float $threshold = 0.3, int $studentId = null, string $studentType = null): array
    {
        Log::info('Performing semantic search using Qdrant', [
            'is_vague_query' => $isVagueQuery,
            'initial_threshold' => $threshold,
            'has_query_embedding' => !empty($queryEmbedding),
            'has_student_embedding' => !empty($studentEmbedding),
        ]);
        
        // Similar threshold adjustment logic as in MySQL search
        if ($isVagueQuery && $studentEmbedding) {
            $threshold = min($threshold, 0.3);
            Log::info("Using lower threshold for vague query with student profile", [
                'threshold' => $threshold,
                'student_type' => $studentType
            ]);
        }
        
        // Determine which embedding to use
        $searchEmbedding = null;
        $searchType = '';
        
        if ($isVagueQuery && $studentEmbedding) {
            // If query is vague and student embedding exists, use only student embedding
            $searchEmbedding = $studentEmbedding;
            $searchType = 'student_only';
        } elseif ($queryEmbedding && $studentEmbedding) {
            // For combined search, we need to first search with query and then with student profile and blend results
            // This is different from MySQL approach because Qdrant doesn't support client-side scoring combination
            
            // First search with query embedding (60% weight)
            $queryResults = $this->qdrantService->findSimilarAcademicians($queryEmbedding, $limit * 2, $threshold);
            
            // Then search with student embedding (40% weight)
            $studentResults = $this->qdrantService->findSimilarAcademicians($studentEmbedding, $limit * 2, $threshold);
            
            // Combine and reweight results (client-side)
            $combinedResults = $this->combineSearchResults($queryResults, $studentResults, 0.6, 0.4);
            
            // If combined results has few or no matches, implement fallback with lower thresholds
            if (count($combinedResults) < 3 && $threshold > 0.2) {
                Log::info("Few results found with threshold {$threshold} in combined Qdrant search, trying with lower threshold");
                
                // For higher initial thresholds, try an intermediate value first
                if ($threshold >= 0.4) {
                    $lowerThreshold = 0.3;
                    Log::info("Retrying with intermediate threshold {$lowerThreshold}");
                    
                    // Retry with lower threshold
                    $queryResults = $this->qdrantService->findSimilarAcademicians($queryEmbedding, $limit * 2, $lowerThreshold);
                    $studentResults = $this->qdrantService->findSimilarAcademicians($studentEmbedding, $limit * 2, $lowerThreshold);
                    
                    // Combine results again
                    $combinedResults = $this->combineSearchResults($queryResults, $studentResults, 0.6, 0.4);
                    
                    // If still few results, try with lowest threshold
                    if (count($combinedResults) < 3) {
                        $lowestThreshold = 0.2;
                        Log::info("Still few results, retrying with lowest threshold {$lowestThreshold}");
                        
                        $queryResults = $this->qdrantService->findSimilarAcademicians($queryEmbedding, $limit * 2, $lowestThreshold);
                        $studentResults = $this->qdrantService->findSimilarAcademicians($studentEmbedding, $limit * 2, $lowestThreshold);
                        $combinedResults = $this->combineSearchResults($queryResults, $studentResults, 0.6, 0.4);
                    }
                } else {
                    // For lower initial thresholds, go straight to the lowest threshold
                    $lowestThreshold = 0.2;
                    Log::info("Retrying with lowest threshold {$lowestThreshold}");
                    
                    $queryResults = $this->qdrantService->findSimilarAcademicians($queryEmbedding, $limit * 2, $lowestThreshold);
                    $studentResults = $this->qdrantService->findSimilarAcademicians($studentEmbedding, $limit * 2, $lowestThreshold);
                    $combinedResults = $this->combineSearchResults($queryResults, $studentResults, 0.6, 0.4);
                }
            }
            
            // Convert to expected format (this is different from the simpler search cases)
            return $this->loadAcademiciansFromIds(array_slice($combinedResults, 0, $limit));
        } elseif ($queryEmbedding) {
            // Use query embedding only
            $searchEmbedding = $queryEmbedding;
            $searchType = 'query_only';
        } elseif ($studentEmbedding) {
            // Use student embedding only
            $searchEmbedding = $studentEmbedding;
            $searchType = 'student_only';
        } else {
            // No valid embeddings
            Log::warning('No valid embeddings for search');
            return [];
        }
        
        // For simple single-embedding searches
        if ($searchType === 'query_only' || $searchType === 'student_only') {
            // Search in Qdrant
            $qdrantResults = $this->qdrantService->findSimilarAcademicians($searchEmbedding, $limit, $threshold);
            
            // Add fallback mechanism for single embedding searches
            if (count($qdrantResults) < 3 && $threshold > 0.2) {
                Log::info("Few results found with threshold {$threshold} in Qdrant {$searchType} search, trying with lower threshold");
                
                // For higher initial thresholds, try an intermediate value first
                if ($threshold >= 0.4) {
                    $lowerThreshold = 0.3;
                    Log::info("Retrying with intermediate threshold {$lowerThreshold}");
                    $qdrantResults = $this->qdrantService->findSimilarAcademicians($searchEmbedding, $limit, $lowerThreshold);
                    
                    // If still few results, try with lowest threshold
                    if (count($qdrantResults) < 3) {
                        $lowestThreshold = 0.2;
                        Log::info("Still few results, retrying with lowest threshold {$lowestThreshold}");
                        $qdrantResults = $this->qdrantService->findSimilarAcademicians($searchEmbedding, $limit, $lowestThreshold);
                    }
                } else {
                    // For lower initial thresholds, go straight to the lowest threshold
                    $lowestThreshold = 0.2;
                    Log::info("Retrying with lowest threshold {$lowestThreshold}");
                    $qdrantResults = $this->qdrantService->findSimilarAcademicians($searchEmbedding, $limit, $lowestThreshold);
                }
            }
            
            // Get full academician records from MySQL using IDs
            return $this->loadAcademiciansFromIds($qdrantResults);
        }
        
        // Should never reach here with current logic, but keep as fallback
        Log::warning('Unexpected search flow in Qdrant search');
        return [];
    }
    
    /**
     * Combine and reweight search results from two separate Qdrant searches
     */
    protected function combineSearchResults(array $queryResults, array $studentResults, float $queryWeight = 0.6, float $studentWeight = 0.4): array
    {
        $combined = [];
        $scoredIds = [];
        
        // Process query results
        foreach ($queryResults as $result) {
            $id = $result['mysql_id'];
            $scoredIds[$id] = ($result['score'] * $queryWeight);
        }
        
        // Process and combine student results
        foreach ($studentResults as $result) {
            $id = $result['mysql_id'];
            if (isset($scoredIds[$id])) {
                // Add weighted student score to existing query score
                $scoredIds[$id] += ($result['score'] * $studentWeight);
            } else {
                // This is only in student results
                $scoredIds[$id] = ($result['score'] * $studentWeight);
            }
        }
        
        // Convert to format expected by loadAcademiciansFromIds
        foreach ($scoredIds as $id => $score) {
            $combined[] = [
                'mysql_id' => $id,
                'score' => $score
            ];
        }
        
        // Sort by combined score (highest first)
        usort($combined, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });
        
        return $combined;
    }
    
    /**
     * Load full academician records from MySQL using IDs from Qdrant
     */
    protected function loadAcademiciansFromIds(array $qdrantResults): array
    {
        if (empty($qdrantResults)) {
            return [];
        }
        
        // Extract MySQL IDs
        $mysqlIds = array_map(function($result) {
            return $result['mysql_id'];
        }, $qdrantResults);
        
        // Create ID to score mapping
        $scoreMap = [];
        foreach ($qdrantResults as $result) {
            $scoreMap[$result['mysql_id']] = $result['score'];
        }
        
        // Get academicians from MySQL
        $academicians = Academician::with(['user.skills.subdomain.domain'])->whereIn('id', $mysqlIds)->get();
        
        // Convert to array and add scores
        $results = [];
        foreach ($academicians as $academician) {
            $academicianArray = $academician->toArray();
            $academicianArray['match_score'] = $scoreMap[$academician->id] ?? 0;
            // Load skills from user relationship
            $academicianArray['skills'] = $academician->user ? $academician->user->skills->toArray() : [];
            $results[] = $academicianArray;
        }
        
        // Sort by score (highest first)
        usort($results, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });
        
        return $results;
    }
    
    /**
     * Search using MySQL with PHP-based vector similarity (original method)
     */
    protected function searchUsingMySQL(array $queryEmbedding = null, array $studentEmbedding = null, bool $isVagueQuery = false, int $limit = 10, float $threshold = 0.3, int $studentId = null, string $studentType = null): array
    {
        // For MySQL databases, use PHP to calculate similarity
        Log::info('Performing semantic search using MySQL and PHP vector calculations', [
            'is_vague_query' => $isVagueQuery,
            'initial_threshold' => $threshold,
            'has_query_embedding' => !empty($queryEmbedding),
            'has_student_embedding' => !empty($studentEmbedding),
        ]);
        
        // Adjust threshold for vague queries - use a lower threshold when matching student profiles
        // This helps ensure we get sufficient matches for queries like "Supervisor suitable for me"
        if ($isVagueQuery && $studentEmbedding) {
            $threshold = min($threshold, 0.3); // Use a significantly lower threshold
            Log::info("Using lower threshold for vague query with student profile", [
                'threshold' => $threshold,
                'student_type' => $studentType
            ]);
        }
        
        // Fetch academicians that have embeddings
        $academicians = Academician::with(['user.skills.subdomain.domain'])->where('has_embedding', true)
            ->get();
        
        Log::info("Found " . $academicians->count() . " academicians with embeddings");
        
        // Calculate similarity scores in PHP (less efficient but works for any DB)
        $results = [];
        $lowSimilarityCount = 0;
        $highestSimilarity = 0;
        $lowestSimilarity = 1;
        
        foreach ($academicians as $academician) {
            $academicianEmbedding = $academician->embedding_vector;
            
            if (empty($academicianEmbedding)) {
                continue;
            }
            
            // Ensure the embedding vector is an array
            if (is_string($academicianEmbedding)) {
                $academicianEmbedding = json_decode($academicianEmbedding, true);
                if (json_last_error() !== JSON_ERROR_NONE || !is_array($academicianEmbedding)) {
                    Log::error("Failed to decode embedding vector for academician {$academician->id}: " . json_last_error_msg());
                    continue;
                }
            }
            
            // Calculate similarity based on query, student profile, or both
            $similarity = 0;
            
            if ($isVagueQuery && $studentEmbedding) {
                // If query is vague (e.g., "Find supervisor for me") and we have student embedding,
                // use only the student profile embedding
                $similarity = $this->cosineSimilarity($studentEmbedding, $academicianEmbedding);
            } elseif ($queryEmbedding && $studentEmbedding) {
                // If we have both query and student embeddings, use a weighted combination
                $querySimilarity = $this->cosineSimilarity($queryEmbedding, $academicianEmbedding);
                $profileSimilarity = $this->cosineSimilarity($studentEmbedding, $academicianEmbedding);
                
                // Weighted score: 60% query, 40% profile
                $similarity = (0.6 * $querySimilarity) + (0.4 * $profileSimilarity);
            } elseif ($queryEmbedding) {
                // If only query embedding is available
                $similarity = $this->cosineSimilarity($queryEmbedding, $academicianEmbedding);
            } elseif ($studentEmbedding) {
                // If only student embedding is available
                $similarity = $this->cosineSimilarity($studentEmbedding, $academicianEmbedding);
            } else {
                // This case shouldn't happen, as we check earlier, but just to be safe
                continue;
            }
            
            // Track statistics
            $highestSimilarity = max($highestSimilarity, $similarity);
            $lowestSimilarity = min($lowestSimilarity, $similarity);
            
            if ($similarity < $threshold) {
                $lowSimilarityCount++;
                continue;
            }
            
            $academicianArray = $academician->toArray();
            $academicianArray['match_score'] = $similarity;
            // Load skills from user relationship
            $academicianArray['skills'] = $academician->user ? $academician->user->skills->toArray() : [];
            $results[] = $academicianArray;
        }
        
        // Sort by similarity (highest first)
        usort($results, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });
        
        // Log results statistics
        Log::info("Search results statistics", [
            'found_count' => count($results),
            'below_threshold_count' => $lowSimilarityCount,
            'highest_similarity' => $highestSimilarity,
            'lowest_similarity' => $lowestSimilarity,
            'used_threshold' => $threshold
        ]);
        
        // If no results or very few results, try with a lower threshold as fallback
        // The fallback mechanism now works more consistently for all query types
        if (count($results) < 3 && $threshold > 0.2) {
            // For higher initial thresholds, try an intermediate threshold first
            if ($threshold >= 0.4) {
                $intermediateThreshold = 0.3;
                Log::info("Few or no results found with threshold {$threshold}, trying with intermediate threshold {$intermediateThreshold}");
                return $this->searchUsingMySQL($queryEmbedding, $studentEmbedding, $isVagueQuery, $limit, $intermediateThreshold, $studentId, $studentType);
            } else {
                // For already moderate thresholds, try the lowest reasonable threshold
                $lowestThreshold = 0.2;
                Log::info("Few or no results found with threshold {$threshold}, trying with lowest threshold {$lowestThreshold}");
                return $this->searchUsingMySQL($queryEmbedding, $studentEmbedding, $isVagueQuery, $limit, $lowestThreshold, $studentId, $studentType);
            }
        }
        
        // Limit results
        return array_slice($results, 0, $limit);
    }
    
    /**
     * Generate insights for academician matches using OpenAI GPT-4o
     *
     * @param array $academicians Array of academician data
     * @param string $query Search query
     * @param int|null $studentId Student ID for personalized insights
     * @param string|null $studentType Student type
     * @return array Academicians with added AI insights
     */
    public function generateAcademicianInsights(array $academicians, string $query, int $studentId = null, string $studentType = null): array
    {
        foreach ($academicians as &$academician) {
            try {
                // Skip generating insights for academicians that already have them
                if (isset($academician['ai_insights'])) {
                    continue;
                }
                
                // Use cache to avoid regenerating the same insights
                $cacheKey = 'academician_insight_' . md5($academician['id'] . '_' . $query . '_' . $studentId . '_' . $studentType);
                
                if (Cache::has($cacheKey)) {
                    $academician['ai_insights'] = Cache::get($cacheKey);
                    continue;
                }
                
                // Fetch publication data for this academician
                $publications = $this->getAcademicianPublications($academician['id']);
                
                // Generate insight using OpenAI
                $insight = $this->openaiCompletionService->generateSupervisorInsight(
                    $academician, 
                    $query, 
                    $studentId, 
                    $studentType,
                    $publications
                );
                
                $academician['ai_insights'] = $insight;
                
                // Cache the result
                Cache::put($cacheKey, $insight, now()->addMinutes(30));
            
            } catch (\Exception $e) {
                Log::error('Error generating insight for academician: ' . $e->getMessage(), [
                    'academician_id' => $academician['id'] ?? 'unknown',
                    'query' => $query
                ]);
                
                $academician['ai_insights'] = "No insights available for this match at this time.";
            }
        }
        
        return $academicians;
    }
    
    /**
     * Fetch publications for an academician
     *
     * @param int $academicianId The academician's ID
     * @return array Formatted publication data
     */
    protected function getAcademicianPublications(int $academicianId): array
    {
        try {
            // Look up the academician by ID to get the academician_id (unique identifier)
            $academician = Academician::find($academicianId);
            
            if (!$academician) {
                return [];
            }
            
            // Retrieve publications using the academician_id (unique identifier)
            $publications = \App\Models\Publication::where('academician_id', $academician->academician_id)
                ->orderBy('year', 'desc') // Most recent first
                ->limit(5) // Limit to 5 most recent publications
                ->get();
                
            if ($publications->isEmpty()) {
                return [];
            }
            
            // Format publications for inclusion in the prompt
            $result = [];
            foreach ($publications as $pub) {
                $pubData = [
                    'title' => $pub->title,
                    'year' => $pub->year,
                ];
                
                // Add optional fields if available
                if (!empty($pub->authors)) {
                    $pubData['authors'] = $pub->authors;
                }
                
                if (!empty($pub->venue)) {
                    $pubData['venue'] = $pub->venue;
                }
                
                if (!empty($pub->citations)) {
                    $pubData['citations'] = $pub->citations;
                }
                
                if (!empty($pub->abstract)) {
                    // Limit abstract length to avoid token bloat
                    $pubData['abstract'] = \Illuminate\Support\Str::limit($pub->abstract, 100);
                }
                
                $result[] = $pubData;
            }
            
            return $result;
            
        } catch (\Exception $e) {
            Log::error('Error fetching publications for academician: ' . $e->getMessage(), [
                'academician_id' => $academicianId
            ]);
            return [];
        }
    }
    
    /**
     * Calculate cosine similarity between two vectors
     *
     * @param array $v1 First vector
     * @param array $v2 Second vector
     * @return float Similarity score (0-1)
     */
    protected function cosineSimilarity(array $v1, array $v2): float
    {
        $dotProduct = 0;
        $magnitude1 = 0;
        $magnitude2 = 0;
        
        foreach ($v1 as $i => $value) {
            $dotProduct += $value * $v2[$i];
            $magnitude1 += $value * $value;
            $magnitude2 += $v2[$i] * $v2[$i];
        }
        
        $magnitude1 = sqrt($magnitude1);
        $magnitude2 = sqrt($magnitude2);
        
        if ($magnitude1 == 0 || $magnitude2 == 0) {
            return 0;
        }
        
        return $dotProduct / ($magnitude1 * $magnitude2);
    }

    /**
     * Determines if a query is vague and should use student profile instead
     *
     * @param string $query The search query
     * @return bool True if query is vague
     */
    protected function isVagueQuery(string $query): bool
    {
        $query = strtolower(trim($query));
        
        // List of vague queries that indicate the student wants to use their profile
        $vagueQueries = [
            'find supervisor for me',
            'find me a supervisor',
            'find supervisor suitable for me', 
            'supervisor for me',
            'for me',
            'suitable for me',
            'match me',
            'recommend',
            'recommend supervisor',
            'based on my profile',
            'my research',
            'my interests',
            'my profile'
        ];
        
        // Common academic fields that shouldn't be treated as vague (even if short)
        $academicFields = [
            'education',
            'biology',
            'chemistry',
            'physics',
            'mathematics',
            'math',
            'computer science',
            'engineering',
            'medicine',
            'psychology',
            'sociology',
            'history',
            'economics',
            'law',
            'business',
            'arts',
            'literature',
            'language',
            'linguistics',
            'philosophy',
            'theology',
            'agriculture',
            'science',
            'technology',
            'health',
            'nursing',
            'ai',
            'ml',
            'data science'
        ];
        
        // Check for exact matches with academic fields
        if (in_array($query, $academicFields)) {
            Log::info("Query matched common academic field: {$query}, not treating as vague");
            return false;
        }
        
        foreach ($vagueQueries as $vague) {
            if (strpos($query, $vague) !== false) {
                Log::info("Query contains vague pattern: {$vague}");
                return true;
            }
        }
        
        // Also consider very short queries as vague, but exclude common academic fields
        if (str_word_count($query) < 2 && !in_array($query, $academicFields)) {
            Log::info("Query is very short and not a common field: {$query}, treating as vague");
            return true;
        }
        
        return false;
    }
    
    /**
     * Get embedding vector for a student
     *
     * @param int $studentId The student ID
     * @param string $studentType The student type (postgraduate/undergraduate)
     * @return array|null The embedding vector or null if not found
     */
    protected function getStudentEmbedding(int $studentId, string $studentType): ?array
    {
        try {
            // Student type must be either postgraduate or undergraduate
            if (!in_array($studentType, ['postgraduate', 'undergraduate'])) {
                Log::warning("Invalid student type: {$studentType}");
                return null;
            }
            
            $cacheKey = "student_embedding_{$studentType}_{$studentId}";
            
            // Try to get from cache first
            if (Cache::has($cacheKey)) {
                return Cache::get($cacheKey);
            }
            
            $model = "\\App\\Models\\" . ucfirst($studentType);
            
            if (!class_exists($model)) {
                Log::error("Model class does not exist: {$model}");
                return null;
            }
            
            $student = $model::find($studentId);
            
            if (!$student) {
                Log::warning("{$studentType} with ID {$studentId} not found");
                return null;
            }
            
            // Get embedding from model
            $embedding = $student->embedding_vector;
            
            // If it's a string, decode it
            if (is_string($embedding)) {
                $embedding = json_decode($embedding, true);
            }
            
            // Check if it's a valid array
            if (empty($embedding) || !is_array($embedding)) {
                Log::warning("Invalid embedding vector for {$studentType} ID {$studentId}");
                return null;
            }
            
            // Cache the embedding for future use (15 minutes)
            Cache::put($cacheKey, $embedding, now()->addMinutes(15));
            
            return $embedding;
        } catch (\Exception $e) {
            Log::error("Error getting student embedding: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find similar students based on a query using semantic search
     *
     * @param string $query The search query
     * @param int $limit Maximum number of results to return
     * @param float $threshold Minimum similarity threshold (0-1)
     * @param int|null $academicianId Academician ID for personalized search
     * @param bool $includeBothTypes Whether to include both postgraduate and undergraduate students
     * @param string|null $specificType Limit to a specific student type (postgraduate/undergraduate)
     * @param bool|null $forceUseQdrant Override default Qdrant setting
     * @return array Array of students with similarity scores
     */
    public function findSimilarStudents(
        string $query, 
        int $limit = 10, 
        float $threshold = 0.3, 
        int $academicianId = null, 
        bool $includeBothTypes = true,
        string $specificType = null,
        bool $forceUseQdrant = null
    ): array
    {
        try {
            // Determine if we should use Qdrant or MySQL
            $useQdrant = $forceUseQdrant ?? $this->useQdrant;
            
            // Log the search strategy
            Log::info('Student semantic search strategy', [
                'query' => $query,
                'use_qdrant' => $useQdrant,
                'limit' => $limit,
                'threshold' => $threshold,
                'academician_id' => $academicianId,
                'include_both_types' => $includeBothTypes,
                'specific_type' => $specificType
            ]);
            
            // Generate embedding for the query
            $queryEmbedding = $this->embeddingService->generateEmbedding($query, true);
            
            if (!$queryEmbedding) {
                Log::error('Failed to generate embedding for query: ' . $query);
                return [];
            }
            
            // Get academician embedding for personalized matching if available
            $academicianEmbedding = null;
            if ($academicianId) {
                $academician = Academician::find($academicianId);
                if ($academician && !empty($academician->embedding_vector)) {
                    $academicianEmbedding = is_string($academician->embedding_vector) 
                        ? json_decode($academician->embedding_vector, true) 
                        : $academician->embedding_vector;
                }
            }
            
            // Choose search strategy based on configuration
            if ($useQdrant) {
                return $this->searchStudentsUsingQdrant(
                    $queryEmbedding, 
                    $academicianEmbedding, 
                    $limit, 
                    $threshold, 
                    $includeBothTypes, 
                    $specificType
                );
            } else {
                return $this->searchStudentsUsingMySQL(
                    $queryEmbedding, 
                    $academicianEmbedding, 
                    $limit, 
                    $threshold, 
                    $includeBothTypes, 
                    $specificType
                );
            }
        } catch (\Exception $e) {
            Log::error('Error in student semantic search: ' . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Search for students using Qdrant vector database
     */
    protected function searchStudentsUsingQdrant(
        array $queryEmbedding, 
        ?array $academicianEmbedding = null, 
        int $limit = 10, 
        float $threshold = 0.3, 
        bool $includeBothTypes = true, 
        ?string $specificType = null
    ): array
    {
        // If we have both query and academician embeddings, use a combination search
        if ($queryEmbedding && $academicianEmbedding) {
            // Search with query embedding (60% weight)
            $queryResults = $this->qdrantService->findSimilarStudents($queryEmbedding, $limit * 2, $threshold);
            
            // Search with academician embedding (40% weight)
            $academicianResults = $this->qdrantService->findSimilarStudents($academicianEmbedding, $limit * 2, $threshold);
            
            // Combine and reweight results
            $combinedResults = $this->combineStudentSearchResults($queryResults, $academicianResults, 0.6, 0.4);
            
            // Add fallback mechanism for combined searches
            if (count($combinedResults) < 3 && $threshold > 0.2) {
                Log::info("Few results found with threshold {$threshold} in combined Qdrant student search, trying with lower threshold");
                
                // For higher initial thresholds, try an intermediate value first
                if ($threshold >= 0.4) {
                    $lowerThreshold = 0.3;
                    Log::info("Retrying student search with intermediate threshold {$lowerThreshold}");
                    
                    // Retry with lower threshold
                    $queryResults = $this->qdrantService->findSimilarStudents($queryEmbedding, $limit * 2, $lowerThreshold);
                    $academicianResults = $this->qdrantService->findSimilarStudents($academicianEmbedding, $limit * 2, $lowerThreshold);
                    
                    // Combine results again
                    $combinedResults = $this->combineStudentSearchResults($queryResults, $academicianResults, 0.6, 0.4);
                    
                    // If still few results, try with lowest threshold
                    if (count($combinedResults) < 3) {
                        $lowestThreshold = 0.2;
                        Log::info("Still few student results, retrying with lowest threshold {$lowestThreshold}");
                        
                        $queryResults = $this->qdrantService->findSimilarStudents($queryEmbedding, $limit * 2, $lowestThreshold);
                        $academicianResults = $this->qdrantService->findSimilarStudents($academicianEmbedding, $limit * 2, $lowestThreshold);
                        $combinedResults = $this->combineStudentSearchResults($queryResults, $academicianResults, 0.6, 0.4);
                    }
                } else {
                    // For lower initial thresholds, go straight to the lowest threshold
                    $lowestThreshold = 0.2;
                    Log::info("Retrying student search with lowest threshold {$lowestThreshold}");
                    
                    $queryResults = $this->qdrantService->findSimilarStudents($queryEmbedding, $limit * 2, $lowestThreshold);
                    $academicianResults = $this->qdrantService->findSimilarStudents($academicianEmbedding, $limit * 2, $lowestThreshold);
                    $combinedResults = $this->combineStudentSearchResults($queryResults, $academicianResults, 0.6, 0.4);
                }
            }
            
            // Convert to expected format
            return $this->loadStudentsFromIds(array_slice($combinedResults, 0, $limit), $includeBothTypes, $specificType);
        } else {
            // Single embedding search (either query only or academician only)
            $searchEmbedding = $queryEmbedding ?: $academicianEmbedding;
            
            if (!$searchEmbedding) {
                Log::warning('No valid embeddings for student search');
                return [];
            }
            
            // Search in Qdrant
            $qdrantResults = $this->qdrantService->findSimilarStudents($searchEmbedding, $limit, $threshold);
            
            // Add fallback mechanism for single embedding searches
            if (count($qdrantResults) < 3 && $threshold > 0.2) {
                Log::info("Few results found with threshold {$threshold} in Qdrant student search, trying with lower threshold");
                
                // For higher initial thresholds, try an intermediate value first
                if ($threshold >= 0.4) {
                    $lowerThreshold = 0.3;
                    Log::info("Retrying student search with intermediate threshold {$lowerThreshold}");
                    $qdrantResults = $this->qdrantService->findSimilarStudents($searchEmbedding, $limit, $lowerThreshold);
                    
                    // If still few results, try with lowest threshold
                    if (count($qdrantResults) < 3) {
                        $lowestThreshold = 0.2;
                        Log::info("Still few student results, retrying with lowest threshold {$lowestThreshold}");
                        $qdrantResults = $this->qdrantService->findSimilarStudents($searchEmbedding, $limit, $lowestThreshold);
                    }
                } else {
                    // For lower initial thresholds, go straight to the lowest threshold
                    $lowestThreshold = 0.2;
                    Log::info("Retrying student search with lowest threshold {$lowestThreshold}");
                    $qdrantResults = $this->qdrantService->findSimilarStudents($searchEmbedding, $limit, $lowestThreshold);
                }
            }
            
            // Get full student records from MySQL using IDs
            return $this->loadStudentsFromIds($qdrantResults, $includeBothTypes, $specificType);
        }
    }
    
    /**
     * Search for students using MySQL with PHP-based vector similarity
     */
    protected function searchStudentsUsingMySQL(
        array $queryEmbedding, 
        ?array $academicianEmbedding = null, 
        int $limit = 10, 
        float $threshold = 0.3, 
        bool $includeBothTypes = true, 
        ?string $specificType = null
    ): array
    {
        $results = [];
        $lowSimilarityCount = 0;
        $highestSimilarity = 0;
        $lowestSimilarity = 1;
        
        // Determine which student types to include
        $includePostgraduates = $includeBothTypes || $specificType === 'postgraduate';
        $includeUndergraduates = $includeBothTypes || $specificType === 'undergraduate';
        
        // Process postgraduates if included
        if ($includePostgraduates) {
            $postgraduates = Postgraduate::with(['user.skills.subdomain.domain'])->where('has_embedding', true)->get();
            
            foreach ($postgraduates as $postgraduate) {
                $embedding = $postgraduate->research_embedding;
                
                if (empty($embedding)) {
                    continue;
                }
                
                // Ensure the embedding vector is an array
                if (is_string($embedding)) {
                    $embedding = json_decode($embedding, true);
                    if (json_last_error() !== JSON_ERROR_NONE || !is_array($embedding)) {
                        continue;
                    }
                }
                
                // Calculate similarity with query and/or academician embeddings
                $similarity = $this->calculateStudentSimilarity($queryEmbedding, $academicianEmbedding, $embedding);
                
                // Track statistics
                $highestSimilarity = max($highestSimilarity, $similarity);
                $lowestSimilarity = min($lowestSimilarity, $similarity);
                
                if ($similarity < $threshold) {
                    $lowSimilarityCount++;
                    continue;
                }
                
                // Add to results
                $studentArray = $postgraduate->toArray();
                $studentArray['match_score'] = $similarity;
                $studentArray['student_type'] = 'postgraduate';
                // Load skills from user relationship
                $studentArray['skills'] = $postgraduate->user ? $postgraduate->user->skills->toArray() : [];
                $results[] = $studentArray;
            }
        }
        
        // Process undergraduates if included
        if ($includeUndergraduates) {
            $undergraduates = Undergraduate::with(['user.skills.subdomain.domain'])->where('has_embedding', true)->get();
            
            foreach ($undergraduates as $undergraduate) {
                $embedding = $undergraduate->research_embedding;
                
                if (empty($embedding)) {
                    continue;
                }
                
                // Ensure the embedding vector is an array
                if (is_string($embedding)) {
                    $embedding = json_decode($embedding, true);
                    if (json_last_error() !== JSON_ERROR_NONE || !is_array($embedding)) {
                        continue;
                    }
                }
                
                // Calculate similarity with query and/or academician embeddings
                $similarity = $this->calculateStudentSimilarity($queryEmbedding, $academicianEmbedding, $embedding);
                
                // Track statistics
                $highestSimilarity = max($highestSimilarity, $similarity);
                $lowestSimilarity = min($lowestSimilarity, $similarity);
                
                if ($similarity < $threshold) {
                    $lowSimilarityCount++;
                    continue;
                }
                
                // Add to results
                $studentArray = $undergraduate->toArray();
                $studentArray['match_score'] = $similarity;
                $studentArray['student_type'] = 'undergraduate';
                // Load skills from user relationship
                $studentArray['skills'] = $undergraduate->user ? $undergraduate->user->skills->toArray() : [];
                $results[] = $studentArray;
            }
        }
        
        // Sort by similarity (highest first)
        usort($results, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });
        
        // Log results statistics
        Log::info("Student search results statistics", [
            'found_count' => count($results),
            'below_threshold_count' => $lowSimilarityCount,
            'highest_similarity' => $highestSimilarity,
            'lowest_similarity' => $lowestSimilarity,
            'used_threshold' => $threshold
        ]);
        
        // Add fallback mechanism for student searches too
        if (count($results) < 3 && $threshold > 0.2) {
            // For higher initial thresholds, try an intermediate threshold first
            if ($threshold >= 0.4) {
                $intermediateThreshold = 0.3;
                Log::info("Few or no student results found with threshold {$threshold}, trying with intermediate threshold {$intermediateThreshold}");
                return $this->searchStudentsUsingMySQL($queryEmbedding, $academicianEmbedding, $limit, $intermediateThreshold, $includeBothTypes, $specificType);
            } else {
                // For already moderate thresholds, try the lowest reasonable threshold
                $lowestThreshold = 0.2;
                Log::info("Few or no student results found with threshold {$threshold}, trying with lowest threshold {$lowestThreshold}");
                return $this->searchStudentsUsingMySQL($queryEmbedding, $academicianEmbedding, $limit, $lowestThreshold, $includeBothTypes, $specificType);
            }
        }
        
        // Limit results
        return array_slice($results, 0, $limit);
    }
    
    /**
     * Calculate weighted similarity score between student embedding and query/academician embeddings
     */
    protected function calculateStudentSimilarity(array $queryEmbedding, ?array $academicianEmbedding, array $studentEmbedding): float
    {
        // If we have both query and academician embeddings, use weighted combination
        if ($queryEmbedding && $academicianEmbedding) {
            $querySimilarity = $this->cosineSimilarity($queryEmbedding, $studentEmbedding);
            $academicianSimilarity = $this->cosineSimilarity($academicianEmbedding, $studentEmbedding);
            
            // Weighted score: 60% query, 40% academician profile
            return (0.6 * $querySimilarity) + (0.4 * $academicianSimilarity);
        } 
        // If only query embedding is available
        elseif ($queryEmbedding) {
            return $this->cosineSimilarity($queryEmbedding, $studentEmbedding);
        }
        // If only academician embedding is available
        elseif ($academicianEmbedding) {
            return $this->cosineSimilarity($academicianEmbedding, $studentEmbedding);
        }
        
        // This case shouldn't happen, but return 0 just in case
        return 0;
    }
    
    /**
     * Combine and reweight student search results from two separate Qdrant searches
     */
    protected function combineStudentSearchResults(array $queryResults, array $academicianResults, float $queryWeight = 0.6, float $academicianWeight = 0.4): array
    {
        $combined = [];
        $scoredIds = [];
        
        // Process query results
        foreach ($queryResults as $result) {
            $id = $result['mysql_id'];
            $scoredIds[$id] = [
                'score' => ($result['score'] * $queryWeight),
                'student_type' => $result['student_type']
            ];
        }
        
        // Process and combine academician results
        foreach ($academicianResults as $result) {
            $id = $result['mysql_id'];
            if (isset($scoredIds[$id])) {
                // Add weighted academician score to existing query score
                $scoredIds[$id]['score'] += ($result['score'] * $academicianWeight);
            } else {
                // This is only in academician results
                $scoredIds[$id] = [
                    'score' => ($result['score'] * $academicianWeight),
                    'student_type' => $result['student_type']
                ];
            }
        }
        
        // Convert to format expected by loadStudentsFromIds
        foreach ($scoredIds as $id => $data) {
            $combined[] = [
                'mysql_id' => $id,
                'score' => $data['score'],
                'student_type' => $data['student_type']
            ];
        }
        
        // Sort by combined score (highest first)
        usort($combined, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });
        
        return $combined;
    }
    
    /**
     * Load full student records from MySQL using IDs from Qdrant
     */
    protected function loadStudentsFromIds(array $qdrantResults, bool $includeBothTypes = true, ?string $specificType = null): array
    {
        if (empty($qdrantResults)) {
            return [];
        }
        
        $results = [];
        
        // Separate IDs by student type
        $postgraduateIds = [];
        $undergraduateIds = [];
        
        foreach ($qdrantResults as $result) {
            if ($result['student_type'] === 'postgraduate') {
                $postgraduateIds[$result['mysql_id']] = $result['score'];
            } else if ($result['student_type'] === 'undergraduate') {
                $undergraduateIds[$result['mysql_id']] = $result['score'];
            }
        }
        
        // Load postgraduates if needed
        if (($includeBothTypes || $specificType === 'postgraduate') && !empty($postgraduateIds)) {
            $postgraduates = Postgraduate::with(['user.skills.subdomain.domain'])->whereIn('id', array_keys($postgraduateIds))->get();
            
            foreach ($postgraduates as $postgraduate) {
                $postgraduateArray = $postgraduate->toArray();
                $postgraduateArray['match_score'] = $postgraduateIds[$postgraduate->id] ?? 0;
                $postgraduateArray['student_type'] = 'postgraduate';
                // Load skills from user relationship
                $postgraduateArray['skills'] = $postgraduate->user ? $postgraduate->user->skills->toArray() : [];
                $results[] = $postgraduateArray;
            }
        }
        
        // Load undergraduates if needed
        if (($includeBothTypes || $specificType === 'undergraduate') && !empty($undergraduateIds)) {
            $undergraduates = Undergraduate::with(['user.skills.subdomain.domain'])->whereIn('id', array_keys($undergraduateIds))->get();
            
            foreach ($undergraduates as $undergraduate) {
                $undergraduateArray = $undergraduate->toArray();
                $undergraduateArray['match_score'] = $undergraduateIds[$undergraduate->id] ?? 0;
                $undergraduateArray['student_type'] = 'undergraduate';
                // Load skills from user relationship
                $undergraduateArray['skills'] = $undergraduate->user ? $undergraduate->user->skills->toArray() : [];
                $results[] = $undergraduateArray;
            }
        }
        
        // Sort by score (highest first)
        usort($results, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });
        
        return $results;
    }
} 