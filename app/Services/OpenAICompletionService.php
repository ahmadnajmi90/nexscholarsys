<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use App\Models\User;
use App\Models\FieldOfResearch;
use App\Models\ResearchArea;
use App\Models\NicheDomain;

class OpenAICompletionService
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
            $deploymentName = config('services.openai.completion_deployment', 'gpt-4o');
            $this->apiEndpoint = "{$baseEndpoint}/openai/deployments/{$deploymentName}/chat/completions?api-version={$this->azureApiVersion}";
            $this->model = null; // Not needed for Azure, as it's part of the URL
        } else {
            // Regular OpenAI or GitHub OpenAI endpoint
            $baseEndpoint = config('services.openai.endpoint', 'https://api.github.com/octocat/openai');
            
            // For direct OpenAI API, we need to append '/chat/completions' to the endpoint
            if (strpos($baseEndpoint, 'api.openai.com') !== false) {
                $this->apiEndpoint = rtrim($baseEndpoint, '/') . '/chat/completions';
            } else {
                // GitHub OpenAI or other custom endpoint
                $this->apiEndpoint = $baseEndpoint;
            }
            
            $this->model = config('services.openai.model', 'gpt-4o');
        }
        
        Log::info('OpenAI Completion Service Configuration', [
            'isAzure' => $isAzure,
            'endpoint' => $this->apiEndpoint,
            'model' => $this->model
        ]);
    }

    /**
     * Generate personalized supervisor insight based on academician data and search query
     *
     * @param array $academician Academician data
     * @param string $query The search query
     * @param int|null $studentId The authenticated student's ID (if available)
     * @param string|null $studentType The student type (postgraduate/undergraduate, if available)
     * @return string Generated insight
     */
    public function generateSupervisorInsight(array $academician, string $query, int $studentId = null, string $studentType = null): string
    {
        // Create cache key including the student ID if available
        $cacheKey = 'supervisor_insight_' . md5($academician['id'] . '_' . $query . '_' . $studentId);
        
        // Check cache first
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        try {
            // Build the system prompt
            $systemPrompt = "You are an academic advisor helping students find suitable research supervisors. ";
            $systemPrompt .= "Provide a personalized insight about why this supervisor might be a good match ";
            $systemPrompt .= "for the student based on their research interests and the supervisor's expertise. ";
            $systemPrompt .= "Keep your response concise (4-5 sentences maximum) but informative, highlighting ";
            $systemPrompt .= "the most relevant aspects of the supervisor's background that align with the student's interests.";
            
            // Build the user message
            $userMessage = "I'm looking for a supervisor in: {$query}\n\n";
            $userMessage .= "Potential supervisor details:\n";
            $userMessage .= "Name: " . ($academician['full_name'] ?? 'Unknown') . "\n";
            
            if (!empty($academician['professional_title'])) {
                $userMessage .= "Title: " . $academician['professional_title'] . "\n";
            }
            
            if (!empty($academician['department'])) {
                $userMessage .= "Department: " . $academician['department'] . "\n";
            }
            
            if (!empty($academician['current_position'])) {
                $userMessage .= "Position: " . $academician['current_position'] . "\n";
            }
            
            // Research expertise (the main field for academic interests)
            if (!empty($academician['research_expertise'])) {
                try {
                    // Convert research expertise IDs to readable text
                    $expertiseText = $this->getResearchExpertiseText($academician['research_expertise']);
                    if (empty($expertiseText)) {
                        // Fallback to original expertise
                        if (is_array($academician['research_expertise'])) {
                            // Extract only string values to avoid Array to string conversion
                            $expertiseItems = [];
                            foreach ($academician['research_expertise'] as $item) {
                                if (is_string($item)) {
                                    $expertiseItems[] = $item;
                                } elseif (is_numeric($item)) {
                                    $expertiseItems[] = (string)$item;
                                }
                            }
                            $expertiseText = implode(", ", $expertiseItems);
                        } elseif (is_string($academician['research_expertise'])) {
                            $expertiseText = $academician['research_expertise'];
                        } else {
                            $expertiseText = '';
                        }
                    }
                    
                    if (!empty($expertiseText)) {
                        $userMessage .= "Research Expertise: " . $expertiseText . "\n";
                    }
                } catch (\Exception $e) {
                    Log::warning("Error processing research expertise: " . $e->getMessage());
                }
            }
            
            // Field of study
            if (!empty($academician['field_of_study'])) {
                try {
                    if (is_string($academician['field_of_study'])) {
                        $userMessage .= "Field of Study: " . $academician['field_of_study'] . "\n";
                    }
                } catch (\Exception $e) {
                    Log::warning("Error processing field of study: " . $e->getMessage());
                }
            }
            
            if (!empty($academician['style_of_supervision'])) {
                try {
                    $supervisionStyle = '';
                    if (is_array($academician['style_of_supervision'])) {
                        $supervisionStyle = implode(", ", array_filter($academician['style_of_supervision'], 'is_string'));
                    } elseif (is_string($academician['style_of_supervision'])) {
                        $supervisionStyle = $academician['style_of_supervision'];
                    }
                    
                    if (!empty($supervisionStyle)) {
                        $userMessage .= "Supervision Style: " . $supervisionStyle . "\n";
                    }
                } catch (\Exception $e) {
                    Log::warning("Error processing supervision style: " . $e->getMessage());
                }
            }
            
            // Add student information if available
            if ($studentId && $studentType) {
                $studentInfo = $this->getStudentResearchInfo($studentId, $studentType);
                if (!empty($studentInfo)) {
                    $userMessage .= "\nMy profile:\n" . $studentInfo;
                }
            }
            
            // Generate completion
            $messages = [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userMessage]
            ];
            
            // Log for debugging
            Log::debug('OpenAI prompt for supervisor insight', [
                'academician_id' => $academician['id'] ?? 'unknown',
                'query' => $query,
                'user_message_length' => strlen($userMessage)
            ]);
            
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
            
            $payload = [
                'messages' => $messages,
                'temperature' => 0.1, // Low temperature for consistent results
                'max_tokens' => 300 // Limit response size
            ];
            
            // Add model only if not using Azure (for Azure, it's in the URL)
            if ($this->model) {
                $payload['model'] = $this->model;
            }
            
            $response = Http::withHeaders($headers)
                ->timeout(15) // 15 second timeout
                ->post($this->apiEndpoint, $payload);
            
            if ($response->successful()) {
                $insight = $response->json('choices.0.message.content');
                
                // Cache the insight for 30 minutes
                Cache::put($cacheKey, $insight, now()->addMinutes(30));
                
                // Store in database for analytics
                $this->storeInsight($academician['id'], $query, $insight, $studentId, $studentType);
                
                return $insight;
            } else {
                $error = $response->body();
                Log::error('OpenAI Completion API error: ' . $error);
                
                // Return a fallback message
                return $this->getFallbackInsight($academician, $query);
            }
        } catch (\Exception $e) {
            Log::error('Error generating supervisor insight: ' . $e->getMessage());
            
            // Return a fallback message
            return $this->getFallbackInsight($academician, $query);
        }
    }
    
    /**
     * Get student's research information
     *
     * @param int $studentId Student ID
     * @param string $studentType Student type (postgraduate/undergraduate)
     * @return string Student information for the prompt
     */
    protected function getStudentResearchInfo(int $studentId, string $studentType): string
    {
        try {
            if ($studentType === 'postgraduate') {
                $student = Postgraduate::find($studentId);
                if ($student && !empty($student->field_of_research)) {
                    // Convert field of research IDs to readable text
                    $researchText = $this->getResearchExpertiseText($student->field_of_research);
                    if (empty($researchText)) {
                        // Fallback to original format
                        $researchText = is_array($student->field_of_research) 
                            ? implode(", ", $student->field_of_research)
                            : $student->field_of_research;
                    }
                    
                    $info = "I am a postgraduate student ";
                    $info .= "researching in the field of: {$researchText}\n";
                    
                    if (!empty($student->suggested_research_title)) {
                        $info .= "My research topic: {$student->suggested_research_title}\n";
                    }
                    
                    if (!empty($student->suggested_research_description)) {
                        $shortDesc = substr($student->suggested_research_description, 0, 150);
                        if (strlen($student->suggested_research_description) > 150) {
                            $shortDesc .= '...';
                        }
                        $info .= "Brief description: {$shortDesc}\n";
                    }
                    
                    return $info;
                }
            } elseif ($studentType === 'undergraduate') {
                $student = Undergraduate::find($studentId);
                if ($student && !empty($student->research_preference)) {
                    // Convert research preference IDs to readable text
                    $researchText = $this->getResearchExpertiseText($student->research_preference);
                    if (empty($researchText)) {
                        // Fallback to original format
                        $researchText = is_array($student->research_preference) 
                            ? implode(", ", $student->research_preference)
                            : $student->research_preference;
                    }
                    
                    $info = "I am an undergraduate student ";
                    $info .= "interested in: {$researchText}\n";
                    
                    if (!empty($student->bio)) {
                        $shortBio = substr($student->bio, 0, 100);
                        if (strlen($student->bio) > 100) {
                            $shortBio .= '...';
                        }
                        $info .= "About me: {$shortBio}\n";
                    }
                    
                    return $info;
                }
            }
        } catch (\Exception $e) {
            Log::error('Error retrieving student research info: ' . $e->getMessage());
        }
        
        return '';
    }
    
    /**
     * Store the generated insight in the database
     *
     * @param int $academicianId Academician ID
     * @param string $query Search query
     * @param string $insight Generated insight
     * @param int|null $studentId Student ID
     * @param string|null $studentType Student type
     */
    protected function storeInsight(int $academicianId, string $query, string $insight, int $studentId = null, string $studentType = null): void
    {
        try {
            // We're not storing insights in the database currently, as the existing
            // AcademicianRecommendation model has a different structure.
            // A separate migration would be needed to add the necessary fields to
            // the academician_recommendations table or create a new table.
            
            // For now, just log that an insight was generated
            Log::info('Generated supervisor insight', [
                'academician_id' => $academicianId,
                'query' => $query,
                'student_id' => $studentId,
                'student_type' => $studentType,
            ]);
        } catch (\Exception $e) {
            Log::error('Error storing supervisor insight: ' . $e->getMessage());
        }
    }
    
    /**
     * Get a fallback insight when API call fails
     *
     * @param array $academician Academician data
     * @param string $query Search query
     * @return string Fallback insight
     */
    protected function getFallbackInsight(array $academician, string $query): string
    {
        try {
            // Prepare a generic fallback message
            $name = $academician['full_name'] ?? 'This supervisor';
            $expertise = '';
            
            // Try to get expertise from research_expertise
            if (!empty($academician['research_expertise'])) {
                // Try to convert expertise IDs to readable text first
                $expertiseText = $this->getResearchExpertiseText($academician['research_expertise']);
                
                // If that failed, attempt simple fallback
                if (empty($expertiseText)) {
                    if (is_array($academician['research_expertise'])) {
                        // Handle arrays - extract strings only to prevent "Array to string conversion" errors
                        $expertiseItems = [];
                        foreach (array_slice($academician['research_expertise'], 0, 2) as $item) {
                            if (is_string($item)) {
                                $expertiseItems[] = $item;
                            } elseif (is_numeric($item)) {
                                $expertiseItems[] = (string)$item;
                            }
                        }
                        $expertiseText = implode(", ", $expertiseItems);
                    } elseif (is_string($academician['research_expertise'])) {
                        $expertiseText = $academician['research_expertise'];
                    } else {
                        // If it's not a string or array, use a generic fallback
                        $expertiseText = '';
                    }
                }
                
                if (!empty($expertiseText)) {
                    $expertise = " with expertise in {$expertiseText}";
                }
            }
            
            // Use field_of_study as fallback if research_expertise is problematic
            if (empty($expertise) && !empty($academician['field_of_study'])) {
                if (is_string($academician['field_of_study'])) {
                    $expertise = " with background in {$academician['field_of_study']}";
                }
            }
            
            // As a last resort, use the department
            if (empty($expertise) && !empty($academician['department'])) {
                if (is_string($academician['department'])) {
                    $expertise = " from the {$academician['department']} department";
                }
            }
            
            $fallbackMessage = "{$name}{$expertise} may be a suitable supervisor for research in {$query}. " .
                "Review their full profile for more information about their research interests and experience.";
                
            Log::info("Using fallback insight for academician", [
                'academician_id' => $academician['id'] ?? 'unknown',
                'query' => $query
            ]);
                
            return $fallbackMessage;
        } catch (\Exception $e) {
            // Final fallback in case of any errors in this method itself
            Log::error('Error generating fallback insight: ' . $e->getMessage());
            $name = $academician['full_name'] ?? 'This supervisor';
            return "{$name} may be a suitable match for your research interests. " .
                "Review their full profile for more information.";
        }
    }
    
    /**
     * Get text representation of research expertise from IDs
     * 
     * @param array|string $expertiseIds Array of expertise IDs in format "field_id-area_id-domain_id"
     * @return string Text representation
     */
    protected function getResearchExpertiseText($expertiseIds): string
    {
        if (empty($expertiseIds)) {
            return '';
        }
        
        if (!is_array($expertiseIds)) {
            // If it's already a string representation, return it as is
            if (!preg_match('/^\d+-\d+-\d+$/', $expertiseIds)) {
                return $expertiseIds;
            }
            
            // Convert string to array if it's a single ID
            $expertiseIds = [$expertiseIds];
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
                        $field = FieldOfResearch::find($fieldId);
                        $area = ResearchArea::find($areaId);
                        $domain = NicheDomain::find($domainId);
                        
                        if ($field && $area && $domain) {
                            $textParts[] = "{$field->name} - {$area->name} - {$domain->name}";
                        } else {
                            // If any model is missing, log it but include the ID for debugging
                            Log::warning("Could not resolve research expertise ID: {$expertiseId}");
                            $textParts[] = $expertiseId;
                        }
                    } catch (\Exception $e) {
                        Log::error("Error resolving research expertise ID {$expertiseId}: " . $e->getMessage());
                        $textParts[] = $expertiseId;
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
        
        return implode("; ", $textParts);
    }
} 