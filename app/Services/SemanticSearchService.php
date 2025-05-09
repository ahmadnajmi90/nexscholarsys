<?php

namespace App\Services;

use App\Models\Academician;
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
                $queryEmbedding = $this->embeddingService->generateEmbedding($query);
                
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
        $academicians = Academician::whereIn('id', $mysqlIds)->get();
        
        // Convert to array and add scores
        $results = [];
        foreach ($academicians as $academician) {
            $academicianArray = $academician->toArray();
            $academicianArray['match_score'] = $scoreMap[$academician->id] ?? 0;
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
        $academicians = Academician::where('has_embedding', true)
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
        
        // If no results, try with a lower threshold as fallback, but only for non-specific queries
        if (count($results) === 0 && $threshold > 0.2 && !$isVagueQuery) {
            // Check if this was likely a specific query (threshold ≥ 0.5)
            if ($threshold >= 0.5) {
                // For specific queries, first try an intermediate threshold
                Log::info("No results found with specific query threshold {$threshold}, trying with intermediate threshold 0.35");
                return $this->searchUsingMySQL($queryEmbedding, $studentEmbedding, $isVagueQuery, $limit, 0.35, $studentId, $studentType);
            } else {
                // For regular queries, try the lowest fallback threshold
                Log::info("No results found with threshold {$threshold}, trying with lower threshold 0.2");
                return $this->searchUsingMySQL($queryEmbedding, $studentEmbedding, $isVagueQuery, $limit, 0.2, $studentId, $studentType);
            }
        }
        
        // Limit results
        return array_slice($results, 0, $limit);
    }
    
    /**
     * Generate AI insights for each academician based on the search query
     *
     * @param array $academicians Array of academicians with match scores
     * @param string $query The original search query
     * @param int|null $studentId Student ID for personalized insights
     * @param string|null $studentType Student type (postgraduate/undergraduate)
     * @return array Updated array with AI insights
     */
    public function generateAcademicianInsights(array $academicians, string $query, int $studentId = null, string $studentType = null): array
    {
        $results = [];
        
        foreach ($academicians as $academician) {
            // Generate a personalized insight using the OpenAI Completion Service
            $insight = $this->openaiCompletionService->generateSupervisorInsight(
                $academician, 
                $query, 
                $studentId, 
                $studentType
            );
            
            // Add the insight to the academician data
            $academician['ai_insights'] = $insight;
            $results[] = $academician;
        }
        
        return $results;
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
} 