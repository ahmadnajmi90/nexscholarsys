<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class EmbeddingService
{
    protected $apiKey;
    protected $apiEndpoint;
    protected $model;
    protected $azureApiVersion;

    public function __construct()
    {
        $this->apiKey = config('services.openai.key');
        
        // Check if using Azure OpenAI (different endpoint formatting)
        $isAzure = config('services.openai.is_azure', false);
        $this->azureApiVersion = config('services.openai.azure_api_version', '2024-02-01');
        
        if ($isAzure) {
            // Azure OpenAI requires a specific endpoint format
            $baseEndpoint = config('services.openai.azure_endpoint');
            $deploymentName = config('services.openai.embedding_deployment', 'text-embedding-3-small');
            $this->apiEndpoint = "{$baseEndpoint}/openai/deployments/{$deploymentName}/embeddings?api-version={$this->azureApiVersion}";
            $this->model = null; // Not needed for Azure, as it's part of the URL
        } else {
            // Regular OpenAI or GitHub OpenAI endpoint
            $baseEndpoint = config('services.openai.endpoint', 'https://api.github.com/octocat/openai');
            
            // For direct OpenAI API, we need to append '/embeddings' to the endpoint
            if (strpos($baseEndpoint, 'api.openai.com') !== false) {
                $this->apiEndpoint = rtrim($baseEndpoint, '/') . '/embeddings';
            } else {
                // GitHub OpenAI or other custom endpoint
                $this->apiEndpoint = $baseEndpoint;
            }
            
            // OpenAI updated their embedding models in early 2024:
            // - text-embedding-3-small (1536 dimensions) - replacement for ada-002
            // - text-embedding-3-large (3072 dimensions) - higher quality, larger dimensions
            $this->model = config('services.openai.embedding_model', 'text-embedding-3-small');
        }
        
        Log::info('Embedding Service Configuration', [
            'isAzure' => $isAzure,
            'endpoint' => $this->apiEndpoint,
            'model' => $this->model
        ]);
    }

    /**
     * Generate embeddings for a text input
     *
     * @param string $text The text to embed
     * @return array|null The embedding vector or null if failed
     */
    public function generateEmbedding($text)
    {
        // Clean and prepare the text
        $text = $this->prepareText($text);
        
        // Check cache first to avoid redundant API calls
        $cacheKey = 'embedding_' . md5($text . $this->model);
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            $headers = [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ];
            
            // For Azure OpenAI, use api-key header instead of Authorization
            if (config('services.openai.is_azure', false)) {
                $headers = [
                    'api-key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                ];
            }
            
            $payload = ['input' => $text];
            
            // Add model only if not using Azure (for Azure, it's in the URL)
            if ($this->model) {
                $payload['model'] = $this->model;
            }
            
            $response = Http::withHeaders($headers)
                ->post($this->apiEndpoint, $payload);

            if ($response->successful()) {
                $embedding = $response->json('data.0.embedding');
                
                // Cache the embedding for future use
                Cache::put($cacheKey, $embedding, now()->addDays(30));
                
                return $embedding;
            } else {
                $error = $response->body();
                Log::error('OpenAI Embedding API error: ' . $error);
                
                // Check if it's a model-related error and provide more helpful message
                if (strpos($error, 'unknown_model') !== false) {
                    Log::error('The specified embedding model "' . $this->model . '" is not available. ' . 
                              'Please update your OPENAI_EMBEDDING_MODEL environment variable to use ' .
                              '"text-embedding-3-small" or "text-embedding-3-large".');
                }
                
                return null;
            }
        } catch (\Exception $e) {
            Log::error('Error generating embedding: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Generate embeddings for an academician
     *
     * @param mixed $academician Academician model
     * @return array|null The embedding vector or null if failed
     */
    public function generateAcademicianEmbedding($academician)
    {
        // Construct text that captures the academician's semantic essence
        $text = $this->constructAcademicianText($academician);
        
        // Generate the embedding
        return $this->generateEmbedding($text);
    }

    /**
     * Construct a comprehensive text representation of the academician
     *
     * @param mixed $academician Academician model
     * @return string Text representation
     */
    protected function constructAcademicianText($academician): string
    {
        // Construct a text that captures the academician's profile
        $textParts = [];
        
        // Basic information
        if (!empty($academician->full_name)) {
            $textParts[] = "Name: " . $academician->full_name;
        }
        
        // Professional title and affiliation
        if (!empty($academician->professional_title)) {
            $textParts[] = "Title: " . $academician->professional_title;
        }
        
        // Research interests and expertise
        if (!empty($academician->research_expertise)) {
            // Get the text representation of research expertise IDs
            $expertiseText = $this->getResearchExpertiseText($academician->research_expertise);
            if (!empty($expertiseText)) {
                $textParts[] = "Research Expertise: " . $expertiseText;
            } else {
                $textParts[] = "Research Expertise: " . 
                    (is_array($academician->research_expertise) 
                        ? implode(", ", $academician->research_expertise) 
                        : $academician->research_expertise);
            }
        }
        
        if (!empty($academician->research_interests)) {
            $textParts[] = "Research Interests: " . 
                (is_array($academician->research_interests) 
                    ? implode(", ", $academician->research_interests) 
                    : $academician->research_interests);
        }
        
        // Bio or about section
        if (!empty($academician->bio)) {
            $textParts[] = "Bio: " . $academician->bio;
        }
        
        // Current position
        if (!empty($academician->current_position)) {
            $textParts[] = "Position: " . $academician->current_position;
        }
        
        // Department
        if (!empty($academician->department)) {
            $textParts[] = "Department: " . $academician->department;
        }
        
        // Field of study
        if (!empty($academician->field_of_study)) {
            $textParts[] = "Field of Study: " . $academician->field_of_study;
        }
        
        // Selected publications if available
        if (!empty($academician->publications) && is_array($academician->publications)) {
            $publications = array_slice($academician->publications, 0, 5); // Take up to 5 publications
            $textParts[] = "Selected Publications: " . implode("; ", $publications);
        }
        
        // Combine all parts
        return implode("\n", $textParts);
    }
    
    /**
     * Get text representation of research expertise from IDs
     * 
     * @param array $expertiseIds Array of expertise IDs in format "field_id-area_id-domain_id"
     * @return string Text representation
     */
    protected function getResearchExpertiseText($expertiseIds): string
    {
        if (empty($expertiseIds) || !is_array($expertiseIds)) {
            return '';
        }
        
        $textParts = [];
        
        foreach ($expertiseIds as $expertiseId) {
            // Check if in format "field_id-area_id-domain_id"
            if (strpos($expertiseId, '-') !== false) {
                $ids = explode('-', $expertiseId);
                if (count($ids) === 3) {
                    $fieldId = $ids[0];
                    $areaId = $ids[1]; 
                    $domainId = $ids[2];
                    
                    // Load the models to get text representations
                    $field = \App\Models\FieldOfResearch::find($fieldId);
                    $area = \App\Models\ResearchArea::find($areaId);
                    $domain = \App\Models\NicheDomain::find($domainId);
                    
                    if ($field && $area && $domain) {
                        $textParts[] = "{$field->name}, {$area->name}, {$domain->name}";
                    }
                }
            } else {
                // If not in ID format, use as-is
                $textParts[] = $expertiseId;
            }
        }
        
        return implode("; ", $textParts);
    }

    /**
     * Prepare text for embedding by cleaning and normalizing
     *
     * @param string $text
     * @return string
     */
    protected function prepareText($text)
    {
        // Trim and normalize whitespace
        $text = trim(preg_replace('/\s+/', ' ', $text));
        
        // Ensure text isn't too long (most embedding models have token limits)
        $approxTokens = str_word_count($text) * 1.5; // Rough estimation
        
        if ($approxTokens > 8000) {
            // Truncate if too long (approximate token count)
            $text = substr($text, 0, floor(8000 / $approxTokens * strlen($text)));
        }
        
        return $text;
    }
} 