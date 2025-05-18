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
        $this->apiKey = env('OPENAI_API_KEY');
        
        // Use OpenAI API directly
        $this->apiEndpoint = 'https://api.openai.com/v1/embeddings';
        
        // Use the model from environment variables
        $this->model = env('OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small');
        
        Log::info('Embedding Service Configuration', [
            'endpoint' => $this->apiEndpoint,
            'model' => $this->model,
            'api_key_prefix' => substr($this->apiKey, 0, 10) . '...'
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
        
        // Keywords section - duplicated to increase relevance for search
        $keywords = [];
        
        // Research interests and expertise
        if (!empty($academician->research_expertise)) {
            // Get the text representation of research expertise IDs
            $expertiseText = $this->getResearchExpertiseText($academician->research_expertise);
            if (!empty($expertiseText)) {
                $textParts[] = "Research Expertise: " . $expertiseText;
                $keywords[] = $expertiseText;
            } else {
                $expertiseValue = is_array($academician->research_expertise) 
                    ? implode(", ", $academician->research_expertise) 
                    : $academician->research_expertise;
                $textParts[] = "Research Expertise: " . $expertiseValue;
                $keywords[] = $expertiseValue;
            }
        }
        
        if (!empty($academician->research_interests)) {
            $interestsValue = is_array($academician->research_interests) 
                ? implode(", ", $academician->research_interests) 
                : $academician->research_interests;
            $textParts[] = "Research Interests: " . $interestsValue;
            $keywords[] = $interestsValue;
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
            $keywords[] = $academician->department;
        }
        
        // Field of study
        if (!empty($academician->field_of_study)) {
            $textParts[] = "Field of Study: " . $academician->field_of_study;
            $keywords[] = $academician->field_of_study;
        }
        
        // Selected publications if available
        if (!empty($academician->publications) && is_array($academician->publications)) {
            $publications = array_slice($academician->publications, 0, 5); // Take up to 5 publications
            $textParts[] = "Selected Publications: " . implode("; ", $publications);
        }
        
        // Keywords section - redundant to increase matching weight
        if (!empty($keywords)) {
            $textParts[] = "Keywords: " . implode("; ", array_unique($keywords));
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
            // Skip if not a string or empty
            if (!is_string($expertiseId) || empty($expertiseId)) {
                continue;
            }
            
            // Check if in format "field_id-area_id-domain_id"
            if (strpos($expertiseId, '-') !== false) {
                $ids = explode('-', $expertiseId);
                if (count($ids) === 3) {
                    $fieldId = $ids[0];
                    $areaId = $ids[1]; 
                    $domainId = $ids[2];
                    
                    try {
                        // Load the models to get text representations
                        $field = \App\Models\FieldOfResearch::find($fieldId);
                        $area = \App\Models\ResearchArea::find($areaId);
                        $domain = \App\Models\NicheDomain::find($domainId);
                        
                        if ($field && $area && $domain) {
                            // Include all the terms to make it more searchable
                            $textParts[] = "{$field->name} - {$area->name} - {$domain->name}";
                            // Also add individual terms to improve match likelihood
                            if (!in_array($field->name, $textParts)) {
                                $textParts[] = $field->name;
                            }
                            if (!in_array($area->name, $textParts)) {
                                $textParts[] = $area->name;
                            }
                            if (!in_array($domain->name, $textParts)) {
                                $textParts[] = $domain->name;
                            }
                        } else {
                            Log::warning("Could not resolve research expertise ID: {$expertiseId}");
                        }
                    } catch (\Exception $e) {
                        Log::error("Error resolving research expertise ID {$expertiseId}: " . $e->getMessage());
                    }
                } else {
                    // If not in expected format, use as-is
                    $textParts[] = $expertiseId;
                }
            } else {
                // If not in ID format, use as-is
                $textParts[] = $expertiseId;
            }
        }
        
        return implode("; ", array_unique($textParts));
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

    /**
     * Generate embeddings for a postgraduate
     *
     * @param mixed $postgraduate Postgraduate model
     * @return array|null The embedding vector or null if failed
     */
    public function generatePostgraduateEmbedding($postgraduate)
    {
        // Skip if no field_of_research data is available
        if (empty($postgraduate->field_of_research) || 
            (is_array($postgraduate->field_of_research) && count($postgraduate->field_of_research) === 0)) {
            Log::info("Skipping embedding generation for postgraduate {$postgraduate->id}: No field_of_research data");
            return null;
        }
        
        // Construct text that captures the postgraduate's research interests
        $text = $this->constructPostgraduateText($postgraduate);
        
        // Generate the embedding
        return $this->generateEmbedding($text);
    }
    
    /**
     * Generate embeddings for an undergraduate
     *
     * @param mixed $undergraduate Undergraduate model
     * @return array|null The embedding vector or null if failed
     */
    public function generateUndergraduateEmbedding($undergraduate)
    {
        // Skip if no research_preference data is available
        if (empty($undergraduate->research_preference) || 
            (is_array($undergraduate->research_preference) && count($undergraduate->research_preference) === 0)) {
            Log::info("Skipping embedding generation for undergraduate {$undergraduate->id}: No research_preference data");
            return null;
        }
        
        // Construct text that captures the undergraduate's research interests
        $text = $this->constructUndergraduateText($undergraduate);
        
        // Generate the embedding
        return $this->generateEmbedding($text);
    }
    
    /**
     * Construct a comprehensive text representation of the postgraduate
     *
     * @param mixed $postgraduate Postgraduate model
     * @return string Text representation
     */
    protected function constructPostgraduateText($postgraduate): string
    {
        // Construct a text that captures the postgraduate's profile
        $textParts = [];
        
        // Basic information
        if (!empty($postgraduate->full_name)) {
            $textParts[] = "Name: " . $postgraduate->full_name;
        }
        
        // Field of research (prioritized for embedding)
        if (!empty($postgraduate->field_of_research)) {
            // Get the text representation of research field IDs (same format as academician)
            $researchText = $this->getResearchExpertiseText($postgraduate->field_of_research);
            if (!empty($researchText)) {
                $textParts[] = "Field of Research: " . $researchText;
            } else {
                $textParts[] = "Field of Research: " . 
                    (is_array($postgraduate->field_of_research) 
                        ? implode(", ", $postgraduate->field_of_research) 
                        : $postgraduate->field_of_research);
            }
        }
        
        // Suggested research information
        if (!empty($postgraduate->suggested_research_title)) {
            $textParts[] = "Suggested Research Title: " . $postgraduate->suggested_research_title;
        }
        
        if (!empty($postgraduate->suggested_research_description)) {
            $textParts[] = "Research Description: " . $postgraduate->suggested_research_description;
        }
        
        // Academic background
        if (!empty($postgraduate->previous_degree)) {
            $textParts[] = "Previous Degree: " . $postgraduate->previous_degree;
        }
        
        if (!empty($postgraduate->master)) {
            $textParts[] = "Master's Degree: " . $postgraduate->master;
        }
        
        // Bio or about section
        if (!empty($postgraduate->bio)) {
            $textParts[] = "Bio: " . $postgraduate->bio;
        }
        
        // Combine all parts
        return implode("\n", $textParts);
    }
    
    /**
     * Construct a comprehensive text representation of the undergraduate
     *
     * @param mixed $undergraduate Undergraduate model
     * @return string Text representation
     */
    protected function constructUndergraduateText($undergraduate): string
    {
        // Construct a text that captures the undergraduate's profile
        $textParts = [];
        
        // Basic information
        if (!empty($undergraduate->full_name)) {
            $textParts[] = "Name: " . $undergraduate->full_name;
        }
        
        // Research preference (prioritized for embedding)
        if (!empty($undergraduate->research_preference)) {
            // Get the text representation of research preference IDs (same format as academician)
            $researchText = $this->getResearchExpertiseText($undergraduate->research_preference);
            if (!empty($researchText)) {
                $textParts[] = "Research Preference: " . $researchText;
            } else {
                $textParts[] = "Research Preference: " . 
                    (is_array($undergraduate->research_preference) 
                        ? implode(", ", $undergraduate->research_preference) 
                        : $undergraduate->research_preference);
            }
        }
        
        // Academic background
        if (!empty($undergraduate->bachelor)) {
            $textParts[] = "Bachelor's Degree: " . $undergraduate->bachelor;
        }
        
        // Research interest
        if (!empty($undergraduate->interested_do_research)) {
            $textParts[] = "Interested in Research: Yes";
        }
        
        // Bio or about section
        if (!empty($undergraduate->bio)) {
            $textParts[] = "Bio: " . $undergraduate->bio;
        }
        
        // Combine all parts
        return implode("\n", $textParts);
    }
} 