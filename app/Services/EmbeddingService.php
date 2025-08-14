<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\User;

class EmbeddingService
{
    protected $apiKey;
    protected $apiEndpoint;
    protected $model;
    protected $azureApiVersion;

    protected QdrantService $qdrantService;

    public function __construct(QdrantService $qdrantService)
    {
        $this->qdrantService = $qdrantService;
        $this->apiKey = config('services.openai.api_key', env('OPENAI_API_KEY'));
        $this->apiEndpoint = config('services.openai.embedding_api_url', 'https://api.openai.com/v1/embeddings');
        $this->model = config('services.openai.embedding_model', 'text-embedding-3-small');
        
        // Log::info('Embedding Service Configuration', [
        //     'endpoint' => $this->apiEndpoint,
        //     'model' => $this->model,
        //     'api_key_prefix' => substr($this->apiKey, 0, 10) . '...'
        // ]);
    }

    /**
     * Generate and upsert a user's embedding to Qdrant based on their active role.
     * Returns true if an embedding was generated and upserted; false otherwise.
     */
    public function generateForUser(User $user): bool
    {
        try {
            // Prefer role order: academician -> postgraduate -> undergraduate
            if ($user->academician) {
                $academician = $user->academician;
                $vector = $this->generateAcademicianEmbedding($academician);
                if (!$vector) { return false; }
                $payload = [
                    'full_name' => $academician->full_name,
                    'university_id' => $academician->university ?? null,
                    'faculty_id' => $academician->faculty ?? null,
                    'has_embedding' => true,
                ];
                return $this->qdrantService->upsertAcademicianEmbedding(
                    (string) ($academician->academician_id ?? $user->unique_id ?? $academician->id),
                    (int) $academician->id,
                    $vector,
                    $payload
                );
            }
            if ($user->postgraduate) {
                $pg = $user->postgraduate;
                $vector = $this->generatePostgraduateEmbedding($pg);
                if (!$vector) { return false; }
                $payload = [
                    'full_name' => $pg->full_name,
                    'university_id' => $pg->university_id ?? null,
                    'faculty_id' => $pg->faculty_id ?? null,
                    'has_embedding' => true,
                ];
                return $this->qdrantService->upsertStudentEmbedding('postgraduate', (int) $pg->id, (int) $pg->id, $vector, $payload);
            }
            if ($user->undergraduate) {
                $ug = $user->undergraduate;
                $vector = $this->generateUndergraduateEmbedding($ug);
                if (!$vector) { return false; }
                $payload = [
                    'full_name' => $ug->full_name,
                    'university_id' => $ug->university_id ?? null,
                    'faculty_id' => $ug->faculty_id ?? null,
                    'has_embedding' => true,
                ];
                return $this->qdrantService->upsertStudentEmbedding('undergraduate', (int) $ug->id, (int) $ug->id, $vector, $payload);
            }
            Log::info('generateForUser: No role profile found for user ' . $user->id);
            return false;
        } catch (\Throwable $t) {
            Log::error('EmbeddingService.generateForUser error: ' . $t->getMessage());
            return false;
        }
    }

    /**
     * Generate embedding for text
     *
     * @param string $text The text to embed
     * @param bool $isQuery Whether this is a search query (vs. a document)
     * @return array|null Vector embedding or null if failed
     */
    public function generateEmbedding($text, $isQuery = false)
    {
        // Sanitize text to ensure valid UTF-8 and avoid json_encode errors
        try {
            $text = mb_convert_encoding($text, 'UTF-8', 'UTF-8');
        } catch (\Throwable $e) {
            // Fallback: strip invalid characters if conversion fails unexpectedly
            $text = iconv('UTF-8', 'UTF-8//IGNORE', $text);
        }
        if (empty($text)) {
            Log::warning('Empty text provided for embedding generation');
            return null;
        }

        // If this is a query, enhance it for better search relevance
        if ($isQuery) {
            $text = $this->enhanceQueryForEmbedding($text);
        }
        
        // Prepare text (clean, normalize)
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
            
            $payload = [
                'model' => $this->model,
                'input' => $text
            ];
            
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
     * Enhance a search query for better embedding-based matching
     * 
     * @param string $query The original search query
     * @return string Enhanced query for embedding
     */
    protected function enhanceQueryForEmbedding(string $query): string
    {
        // Normalize
        $query = trim($query);
        
        // Skip enhancement for very long queries (likely already detailed)
        if (str_word_count($query) > 20) {
            return $query;
        }
        
        // Check for academic field keywords to provide context
        $academicFieldKeywords = [
            'artificial intelligence', 'machine learning', 'deep learning', 'neural networks',
            'data science', 'big data', 'data mining', 'natural language processing',
            'computer vision', 'robotics', 'software engineering', 'information systems',
            'cybersecurity', 'networking', 'database', 'cloud computing', 'computational',
            'bioinformatics', 'physics', 'chemistry', 'biology', 'mathematics', 'statistics',
            'engineering', 'electrical', 'mechanical', 'civil', 'medicine', 'healthcare',
            'psychology', 'sociology', 'economics', 'business', 'management', 'finance',
            'accounting', 'marketing', 'law', 'education', 'architecture', 'arts',
            'humanities', 'philosophy', 'linguistics', 'language', 'literature'
        ];
        
        // Check if query contains academic field terms
        $containsAcademicField = false;
        foreach ($academicFieldKeywords as $keyword) {
            if (stripos($query, $keyword) !== false) {
                $containsAcademicField = true;
                break;
            }
        }
        
        // If it's a single technical term or very short query, enhance it
        if (str_word_count($query) <= 3) {
            if ($containsAcademicField) {
                return "Research in academic field: " . $query;
            } else {
                return "Research topic in academic context: " . $query;
            }
        }
        
        // For natural language queries about finding supervisors
        if (stripos($query, "supervisor") !== false || 
            stripos($query, "professor") !== false || 
            stripos($query, "academician") !== false) {
            
            return "Find academic supervisor specializing in: " . $query;
        }
        
        // For queries about collaboration
        if (stripos($query, "collaborat") !== false || 
            stripos($query, "partner") !== false) {
            
            return "Find academic collaboration in: " . $query;
        }
        
        // For queries about students
        if (stripos($query, "student") !== false || 
            stripos($query, "postgraduate") !== false || 
            stripos($query, "undergraduate") !== false) {
            
            return "Find students interested in: " . $query;
        }
        
        // Default enhancement for other queries
        if ($containsAcademicField) {
            return "Academic research in: " . $query;
        } else {
            return "Academic research query: " . $query;
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
        
        // Research expertise - the most important part, emphasized three times with different labels
        if (!empty($academician->research_expertise)) {
            // Get the text representation of research expertise IDs
            $expertiseText = $this->getResearchExpertiseText($academician->research_expertise);
            if (!empty($expertiseText)) {
                // Add research expertise three times to increase its weight for matching
                $textParts[] = "Research Expertise: " . $expertiseText;
                $textParts[] = "Research Focus: " . $expertiseText;
                $textParts[] = "Research Specialty: " . $expertiseText;
            } else {
                $expertiseValue = is_array($academician->research_expertise) 
                    ? implode(", ", $academician->research_expertise) 
                    : $academician->research_expertise;
                // Still add multiple times for weighting
                $textParts[] = "Research Expertise: " . $expertiseValue;
                $textParts[] = "Research Focus: " . $expertiseValue;
                $textParts[] = "Research Specialty: " . $expertiseValue;
            }
        }
        
        // Bio or about section - important for context
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
        
        // Field of study - general field
        if (!empty($academician->field_of_study)) {
            $textParts[] = "Field of Study: " . $academician->field_of_study;
        }
        
        // Selected publications if available
        if (!empty($academician->publications) && is_array($academician->publications)) {
            $publications = array_slice($academician->publications, 0, 5); // Take up to 5 publications
            $textParts[] = "Selected Publications: " . implode("; ", $publications);
        }
        
        // Extract keywords from various fields to create a dedicated keywords section
        $keywords = [];
        
        // Add field_of_study and department as keywords if available
        if (!empty($academician->field_of_study)) {
            $keywords[] = $academician->field_of_study;
        }
        
        if (!empty($academician->department)) {
            $keywords[] = $academician->department;
        }
        
        // Add Keywords section to boost term matching
        if (!empty($keywords)) {
            $textParts[] = "Keywords: " . implode("; ", array_unique($keywords));
        }
        
        // Combine all parts
        return implode("\n", $textParts);
    }
    
    /**
     * Get text representation of research expertise from IDs
     * 
     * @param array|string $expertiseIds Array of expertise IDs in format "field_id-area_id-domain_id"
     * @return string Text representation
     */
    protected function getResearchExpertiseText($expertiseIds): string
    {
        if (empty($expertiseIds) || (!is_array($expertiseIds) && !is_string($expertiseIds))) {
            return '';
        }
        
        // Convert string to array if necessary
        if (is_string($expertiseIds)) {
            // Try to decode if it's a JSON string
            $decoded = json_decode($expertiseIds, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $expertiseIds = $decoded;
            } else {
                // Single string value
                $expertiseIds = [$expertiseIds];
            }
        }
        
        $textParts = [];
        $fieldParts = [];
        $areaParts = [];
        $domainParts = [];
        $combinedParts = [];
        
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
                            // Full hierarchical representation
                            $textParts[] = "{$field->name} - {$area->name} - {$domain->name}";
                            
                            // Store individual components for separate inclusion
                            if (!in_array($field->name, $fieldParts)) {
                                $fieldParts[] = $field->name;
                            }
                            
                            if (!in_array($area->name, $areaParts)) {
                                $areaParts[] = $area->name;
                            }
                            
                            if (!in_array($domain->name, $domainParts)) {
                                $domainParts[] = $domain->name;
                            }
                            
                            // Store useful combinations for improved matching
                            $combinedParts[] = "{$field->name} {$area->name}";
                            $combinedParts[] = "{$area->name} {$domain->name}";
                            $combinedParts[] = "{$field->name} {$domain->name}";
                        } else {
                            Log::warning("Could not resolve all components of research expertise ID: {$expertiseId}");
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
        
        $result = '';
        
        // Start with the full hierarchical representations
        if (!empty($textParts)) {
            $result .= implode("; ", array_unique($textParts));
        }
        
        // Add individual field components to improve match rates
        if (!empty($fieldParts)) {
            $result .= "\nFields: " . implode(", ", array_unique($fieldParts));
        }
        
        if (!empty($areaParts)) {
            $result .= "\nAreas: " . implode(", ", array_unique($areaParts));
        }
        
        if (!empty($domainParts)) {
            $result .= "\nDomains: " . implode(", ", array_unique($domainParts));
        }
        
        // Add useful combinations
        if (!empty($combinedParts)) {
            $result .= "\nTerms: " . implode(", ", array_unique($combinedParts));
        }
        
        return $result;
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
        
        // Field of research (prioritized for embedding) - emphasized three times for better matching
        if (!empty($postgraduate->field_of_research)) {
            // Get the text representation of research field IDs (same format as academician)
            $researchText = $this->getResearchExpertiseText($postgraduate->field_of_research);
            if (!empty($researchText)) {
                // Add three times with different labels to increase weight
                $textParts[] = "Field of Research: " . $researchText;
                $textParts[] = "Research Focus: " . $researchText;
                $textParts[] = "Research Interests: " . $researchText;
            } else {
                $fieldValue = is_array($postgraduate->field_of_research) 
                        ? implode(", ", $postgraduate->field_of_research) 
                    : $postgraduate->field_of_research;
                // Still add multiple times for weighting
                $textParts[] = "Field of Research: " . $fieldValue;
                $textParts[] = "Research Focus: " . $fieldValue;
                $textParts[] = "Research Interests: " . $fieldValue;
            }
        }
        
        // Suggested research information - important for matching
        if (!empty($postgraduate->suggested_research_title)) {
            $textParts[] = "Suggested Research Title: " . $postgraduate->suggested_research_title;
        }
        
        if (!empty($postgraduate->suggested_research_description)) {
            $textParts[] = "Research Description: " . $postgraduate->suggested_research_description;
        }
        
        // Academic background
        if (!empty($postgraduate->bachelor)) {
            $textParts[] = "Bachelor's Degree: " . $postgraduate->bachelor;
        }
        
        if (!empty($postgraduate->master)) {
            $textParts[] = "Master's Degree: " . $postgraduate->master;
        }
        
        // Bio or about section
        if (!empty($postgraduate->bio)) {
            $textParts[] = "Bio: " . $postgraduate->bio;
        }
        
        // Extract keywords for better matching
        $keywords = [];
        
        // Add bachelor's and master's fields as keywords if available
        if (!empty($postgraduate->bachelor)) {
            $keywords[] = $postgraduate->bachelor;
        }
        
        if (!empty($postgraduate->master)) {
            $keywords[] = $postgraduate->master;
        }
        
        // Add keywords section to boost term matching
        if (!empty($keywords)) {
            $textParts[] = "Keywords: " . implode("; ", array_unique($keywords));
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
        
        // Research preference (prioritized for embedding) - emphasized three times for better matching
        if (!empty($undergraduate->research_preference)) {
            // Get the text representation of research preference IDs (same format as academician)
            $researchText = $this->getResearchExpertiseText($undergraduate->research_preference);
            if (!empty($researchText)) {
                // Add three times with different labels to increase weight
                $textParts[] = "Research Preference: " . $researchText;
                $textParts[] = "Research Interest: " . $researchText;
                $textParts[] = "Research Focus: " . $researchText;
            } else {
                $preferenceValue = is_array($undergraduate->research_preference) 
                        ? implode(", ", $undergraduate->research_preference) 
                    : $undergraduate->research_preference;
                // Still add multiple times for weighting
                $textParts[] = "Research Preference: " . $preferenceValue;
                $textParts[] = "Research Interest: " . $preferenceValue;
                $textParts[] = "Research Focus: " . $preferenceValue;
            }
        }
        
        // Academic background
        if (!empty($undergraduate->bachelor)) {
            $textParts[] = "Bachelor's Degree: " . $undergraduate->bachelor;
        }
        
        // Research interest flag - explicitly indicate interest in research
        if (!empty($undergraduate->interested_do_research)) {
            $textParts[] = "Interested in Research: Yes";
            // Add an extra emphasis on research interest if flag is true
            $textParts[] = "Active Research Interest: Yes";
        }
        
        // Bio or about section
        if (!empty($undergraduate->bio)) {
            $textParts[] = "Bio: " . $undergraduate->bio;
        }
        
        // Extract keywords for better matching
        $keywords = [];
        
        // Add bachelor's field as keyword if available
        if (!empty($undergraduate->bachelor)) {
            $keywords[] = $undergraduate->bachelor;
        }
        
        // Add keywords section to boost term matching
        if (!empty($keywords)) {
            $textParts[] = "Keywords: " . implode("; ", array_unique($keywords));
        }
        
        // Combine all parts
        return implode("\n", $textParts);
    }
} 