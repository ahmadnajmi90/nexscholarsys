<?php

namespace App\Services;

use App\Models\Academician;
use Illuminate\Support\Facades\Log;

class SemanticSearchService
{
    protected $embeddingService;

    public function __construct(EmbeddingService $embeddingService)
    {
        $this->embeddingService = $embeddingService;
    }

    /**
     * Find similar academicians based on a query using semantic search
     *
     * @param string $query The search query
     * @param int $limit Maximum number of results to return
     * @param float $threshold Minimum similarity threshold (0-1)
     * @return array Array of academicians with similarity scores
     */
    public function findSimilarAcademicians(string $query, int $limit = 10, float $threshold = 0.7): array
    {
        try {
            // Generate embedding for the query
            $queryEmbedding = $this->embeddingService->generateEmbedding($query);
            
            if (!$queryEmbedding) {
                Log::error('Failed to generate embedding for query: ' . $query);
                return [];
            }
            
            // Use MySQL with PHP-based vector similarity
            return $this->searchUsingMySQL($queryEmbedding, $limit, $threshold);
        } catch (\Exception $e) {
            Log::error('Error in semantic search: ' . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Search using MySQL with PHP-based vector similarity
     */
    protected function searchUsingMySQL(array $queryEmbedding, int $limit, float $threshold): array
    {
        // For MySQL databases, use PHP to calculate similarity
        Log::info('Performing semantic search using MySQL and PHP vector calculations');
        
        // Fetch academicians that have embeddings
        $academicians = Academician::where('has_embedding', true)
            ->get();
        
        // Calculate similarity scores in PHP (less efficient but works for any DB)
        $results = [];
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
            
            // Calculate cosine similarity
            $similarity = $this->cosineSimilarity($queryEmbedding, $academicianEmbedding);
            
            if ($similarity >= $threshold) {
                $academicianArray = $academician->toArray();
                $academicianArray['match_score'] = $similarity;
                $results[] = $academicianArray;
            }
        }
        
        // Sort by similarity (highest first)
        usort($results, function ($a, $b) {
            return $b['match_score'] <=> $a['match_score'];
        });
        
        // Limit results
        return array_slice($results, 0, $limit);
    }
    
    /**
     * Generate AI insights for each academician based on the search query
     *
     * @param array $academicians Array of academicians with match scores
     * @param string $query The original search query
     * @return array Updated array with AI insights
     */
    public function generateAcademicianInsights(array $academicians, string $query): array
    {
        $results = [];
        
        foreach ($academicians as $academician) {
            // Generate a personalized insight based on the academician's profile and the query
            $insight = $this->generateInsight($academician, $query, $academician['match_score'] ?? 0);
            
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
     * Generate insight for why an academician is a good match for the query
     *
     * @param array $academician The academician data
     * @param string $query The search query
     * @param float $score The match score
     * @return string Generated insight
     */
    protected function generateInsight(array $academician, string $query, float $score): string
    {
        // Base insights on the match score
        $matchQuality = "";
        if ($score > 0.95) {
            $matchQuality = "excellent match";
        } elseif ($score > 0.85) {
            $matchQuality = "very good match";
        } elseif ($score > 0.75) {
            $matchQuality = "good match";
        } else {
            $matchQuality = "potential match";
        }
        
        // Format research expertise for display
        $expertise = [];
        if (!empty($academician['research_expertise']) && is_array($academician['research_expertise'])) {
            // Get the actual text of research expertise items
            foreach ($academician['research_expertise'] as $expertiseItem) {
                // If it's in the format field_id-area_id-domain_id, extract IDs
                if (strpos($expertiseItem, '-') !== false) {
                    $ids = explode('-', $expertiseItem);
                    if (count($ids) == 3) {
                        $fieldId = $ids[0];
                        $areaId = $ids[1];
                        $domainId = $ids[2];
                        
                        $field = \App\Models\FieldOfResearch::find($fieldId);
                        $area = \App\Models\ResearchArea::find($areaId);
                        $domain = \App\Models\NicheDomain::find($domainId);
                        
                        if ($field && $area && $domain) {
                            $expertise[] = "{$field->name}, focusing on {$area->name} and specifically {$domain->name}";
                        }
                    }
                } else {
                    // Use the text directly
                    $expertise[] = $expertiseItem;
                }
            }
        }
        
        // Generate the insight
        $name = $academician['full_name'] ?? $academician['name'] ?? 'This supervisor';
        $position = $academician['current_position'] ?? 'researcher';
        $department = $academician['department'] ?? 'their department';
        
        $insight = "{$name} is an {$matchQuality} for your research interest in \"{$query}\".";
        
        if (!empty($expertise)) {
            $insight .= " They have expertise in " . implode(" and ", array_slice($expertise, 0, 2)) . ".";
        }
        
        $insight .= " As a {$position} in {$department}";
        
        // Add supervision style if available
        if (!empty($academician['style_of_supervision'])) {
            $style = is_array($academician['style_of_supervision']) 
                ? $academician['style_of_supervision'][0] 
                : $academician['style_of_supervision'];
            
            $insight .= ", they employ a {$style} supervision approach";
        }
        
        $insight .= ".";
        
        return $insight;
    }
} 