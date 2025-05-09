<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class QdrantService
{
    protected $apiUrl;
    protected $apiKey;
    protected $academiciansCollection;
    protected $studentsCollection;
    protected $vectorSize;
    protected $httpClient;

    public function __construct()
    {
        $this->apiUrl = rtrim(config('services.qdrant.url'), '/');
        $this->apiKey = config('services.qdrant.api_key');
        $this->academiciansCollection = config('services.qdrant.academicians_collection', 'nexscholar_academicians');
        $this->studentsCollection = config('services.qdrant.students_collection', 'nexscholar_students');
        $this->vectorSize = (int) config('services.qdrant.vector_size', 1536); // Ensure integer value
        
        // Initialize HTTP client with default headers
        $this->httpClient = Http::withHeaders([
            'Content-Type' => 'application/json',
            'api-key' => $this->apiKey
        ])->baseUrl($this->apiUrl);
        
        // Log configuration for debugging
        Log::debug('QdrantService initialized', [
            'url' => $this->apiUrl,
            'academicians_collection' => $this->academiciansCollection,
            'students_collection' => $this->studentsCollection,
            'vector_size' => $this->vectorSize
        ]);
    }

    /**
     * Create a collection if it doesn't already exist
     *
     * @param string $collectionName The name of the collection to create
     * @param array $options Additional options for collection creation
     * @return bool True if successful, false otherwise
     */
    public function createCollection(string $collectionName, array $options = []): bool
    {
        try {
            // Check if collection already exists
            if ($this->collectionExists($collectionName)) {
                Log::info("Collection {$collectionName} already exists in Qdrant");
                return true;
            }

            // Required format for Qdrant API according to their documentation
            $collectionOptions = [
                'vectors' => [
                    'size' => $this->vectorSize,
                    'distance' => 'Cosine'
                ],
                'optimizers_config' => [
                    'default_segment_number' => 2
                ],
                'replication_factor' => 1
            ];

            // Merge any custom options
            if (!empty($options)) {
                $collectionOptions = array_merge_recursive($collectionOptions, $options);
            }

            Log::debug("Creating Qdrant collection with options", [
                'collection' => $collectionName,
                'options' => $collectionOptions
            ]);

            $response = $this->httpClient->put("/collections/{$collectionName}", $collectionOptions);

            if ($response->successful()) {
                Log::info("Successfully created collection {$collectionName} in Qdrant");
                return true;
            } else {
                Log::error("Failed to create collection {$collectionName} in Qdrant", [
                    'status' => $response->status(),
                    'response' => $response->json(),
                    'request_body' => json_encode($collectionOptions),
                    'vector_size_type' => gettype($this->vectorSize)
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Exception when creating Qdrant collection {$collectionName}: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Check if a collection exists
     *
     * @param string $collectionName The name of the collection to check
     * @return bool True if exists, false otherwise
     */
    public function collectionExists(string $collectionName): bool
    {
        try {
            $response = $this->httpClient->get("/collections/{$collectionName}");
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Upsert a vector into a collection
     *
     * @param string $collectionName The collection to upsert into
     * @param string $id The unique ID for the vector (will be converted to UUID)
     * @param array $vector The embedding vector
     * @param array $payload Additional metadata to store with the vector
     * @return bool True if successful, false otherwise
     */
    public function upsertVector(string $collectionName, string $id, array $vector, array $payload = []): bool
    {
        try {
            // Convert string ID to a UUID (v5) using SHA-1 hash
            // This ensures we have a valid UUID that's deterministic based on the ID string
            $namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // UUID namespace (using DNS namespace)
            $uuid = $this->generateUuidV5($namespace, $id);
            
            // Add original ID to payload for reference
            $payload['original_id'] = $id;
            
            $data = [
                'points' => [
                    [
                        'id' => $uuid,
                        'vector' => $vector,
                        'payload' => $payload
                    ]
                ]
            ];

            Log::debug("Upserting vector", [
                'collection' => $collectionName,
                'original_id' => $id,
                'uuid' => $uuid
            ]);

            $response = $this->httpClient->put("/collections/{$collectionName}/points", $data);

            if ($response->successful()) {
                return true;
            } else {
                Log::error("Failed to upsert vector in collection {$collectionName}", [
                    'id' => $id,
                    'uuid' => $uuid,
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Exception when upserting vector: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Generate a UUID v5 from a namespace and a name
     *
     * @param string $namespace A UUID namespace
     * @param string $name The name to hash
     * @return string UUID v5
     */
    protected function generateUuidV5(string $namespace, string $name): string
    {
        // Convert namespace from string to bytes
        $namespaceBytes = '';
        $namespace = str_replace(['-', '{', '}'], '', $namespace);
        for ($i = 0; $i < strlen($namespace); $i += 2) {
            $namespaceBytes .= chr(hexdec($namespace[$i] . $namespace[$i + 1]));
        }

        // Calculate hash
        $hash = sha1($namespaceBytes . $name);

        // Format the UUID
        return sprintf(
            '%08s-%04s-%04x-%04x-%12s',
            substr($hash, 0, 8),
            substr($hash, 8, 4),
            (hexdec(substr($hash, 12, 4)) & 0x0fff) | 0x5000,  // Version 5
            (hexdec(substr($hash, 16, 4)) & 0x3fff) | 0x8000,  // Variant 1
            substr($hash, 20, 12)
        );
    }

    /**
     * Batch upsert multiple vectors into a collection
     *
     * @param string $collectionName The collection to upsert into
     * @param array $points Array of points (id, vector, payload)
     * @return bool True if successful, false otherwise
     */
    public function batchUpsertVectors(string $collectionName, array $points): bool
    {
        try {
            $namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // UUID namespace
            
            // Convert all IDs to UUIDs
            foreach ($points as &$point) {
                if (isset($point['id'])) {
                    $originalId = $point['id'];
                    // Convert to UUID
                    $point['id'] = $this->generateUuidV5($namespace, $originalId);
                    
                    // Store original ID in payload
                    if (!isset($point['payload'])) {
                        $point['payload'] = [];
                    }
                    $point['payload']['original_id'] = $originalId;
                }
            }
            
            $data = [
                'points' => $points
            ];

            $response = $this->httpClient->put("/collections/{$collectionName}/points", $data);

            if ($response->successful()) {
                return true;
            } else {
                Log::error("Failed to batch upsert vectors in collection {$collectionName}", [
                    'count' => count($points),
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Exception when batch upserting vectors: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Delete a vector from a collection
     *
     * @param string $collectionName The collection from which to delete the vector
     * @param string $id The ID of the vector to delete (will be converted to UUID)
     * @return bool True if successful, false otherwise
     */
    public function deleteVector(string $collectionName, string $id): bool
    {
        try {
            // Convert string ID to UUID
            $namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
            $uuid = $this->generateUuidV5($namespace, $id);
            
            $data = [
                'points' => [$uuid]
            ];

            $response = $this->httpClient->post("/collections/{$collectionName}/points/delete", $data);

            if ($response->successful()) {
                return true;
            } else {
                Log::error("Failed to delete vector {$id} from collection {$collectionName}", [
                    'original_id' => $id,
                    'uuid' => $uuid,
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Exception when deleting vector: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Search for similar vectors
     *
     * @param string $collectionName The collection to search in
     * @param array $vector The query vector
     * @param int $limit Maximum number of results to return
     * @param float $threshold Minimum similarity threshold (0-1)
     * @return array Array of results with IDs, scores, and payloads
     */
    public function searchVectors(string $collectionName, array $vector, int $limit = 10, float $threshold = 0.3): array
    {
        try {
            $data = [
                'vector' => $vector,
                'limit' => $limit,
                'with_payload' => true,
                'with_vector' => false,
                'score_threshold' => $threshold
            ];

            $cacheKey = "qdrant_search_" . md5($collectionName . '_' . json_encode($vector) . '_' . $limit . '_' . $threshold);
            
            // Try to get cached results first
            if (Cache::has($cacheKey)) {
                return Cache::get($cacheKey);
            }

            $response = $this->httpClient->post("/collections/{$collectionName}/points/search", $data);

            if ($response->successful()) {
                $results = $response->json('result', []);
                
                // Cache results for 15 minutes
                Cache::put($cacheKey, $results, now()->addMinutes(15));
                
                return $results;
            } else {
                Log::error("Failed to search vectors in collection {$collectionName}", [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                return [];
            }
        } catch (\Exception $e) {
            Log::error("Exception when searching vectors: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Upsert an academician's embedding to Qdrant
     *
     * @param string $academicianId The academician_id
     * @param int $mysqlId The MySQL record ID
     * @param array $vector The embedding vector
     * @param array $additionalPayload Additional payload data
     * @return bool True if successful, false otherwise
     */
    public function upsertAcademicianEmbedding(string $academicianId, int $mysqlId, array $vector, array $additionalPayload = []): bool
    {
        // Ensure mysql_id is included in payload
        $payload = array_merge([
            'mysql_id' => $mysqlId,
            'record_type' => 'academician'
        ], $additionalPayload);

        return $this->upsertVector($this->academiciansCollection, $academicianId, $vector, $payload);
    }

    /**
     * Upsert a student's embedding to Qdrant
     *
     * @param string $studentType The student type (postgraduate/undergraduate)
     * @param int $studentId The student ID
     * @param int $mysqlId The MySQL record ID
     * @param array $vector The embedding vector
     * @param array $additionalPayload Additional payload data
     * @return bool True if successful, false otherwise
     */
    public function upsertStudentEmbedding(string $studentType, int $studentId, int $mysqlId, array $vector, array $additionalPayload = []): bool
    {
        $id = $studentType . '_' . $studentId;
        $payload = array_merge([
            'mysql_id' => $mysqlId,
            'student_type' => $studentType,
            'record_type' => 'student'
        ], $additionalPayload);

        return $this->upsertVector($this->studentsCollection, $id, $vector, $payload);
    }

    /**
     * Find similar academicians based on a query vector
     *
     * @param array $vector The query vector
     * @param int $limit Maximum number of results to return
     * @param float $threshold Minimum similarity threshold (0-1)
     * @return array Array of academician MySQL IDs with similarity scores
     */
    public function findSimilarAcademicians(array $vector, int $limit = 10, float $threshold = 0.3): array
    {
        $results = $this->searchVectors($this->academiciansCollection, $vector, $limit, $threshold);
        
        // Transform to simple array of MySQL IDs with scores
        $academicians = [];
        foreach ($results as $result) {
            // Get MySQL ID from payload (primary identifier for database queries)
            $mysqlId = $result['payload']['mysql_id'] ?? null;
            
            // Original string ID (may be useful for debugging)
            $originalId = $result['payload']['original_id'] ?? null;
            
            if ($mysqlId) {
                $academicians[] = [
                    'mysql_id' => $mysqlId,
                    'original_id' => $originalId,
                    'score' => $result['score']
                ];
            }
        }
        
        return $academicians;
    }

    /**
     * Delete an academician's embedding
     *
     * @param string $academicianId The academician_id
     * @return bool True if successful, false otherwise
     */
    public function deleteAcademicianEmbedding(string $academicianId): bool
    {
        return $this->deleteVector($this->academiciansCollection, $academicianId);
    }

    /**
     * Delete a student's embedding
     *
     * @param string $studentType The student type (postgraduate/undergraduate)
     * @param int $studentId The student ID
     * @return bool True if successful, false otherwise
     */
    public function deleteStudentEmbedding(string $studentType, int $studentId): bool
    {
        $id = $studentType . '_' . $studentId;
        return $this->deleteVector($this->studentsCollection, $id);
    }

    /**
     * Test the connection to the Qdrant server
     *
     * @return bool True if connection successful, false otherwise
     */
    public function testConnection(): bool
    {
        try {
            // Simply check the collections list endpoint
            $response = $this->httpClient->get('/collections');
            
            if ($response->successful()) {
                Log::info('Successfully connected to Qdrant server');
                return true;
            } else {
                Log::error('Failed to connect to Qdrant server', [
                    'status' => $response->status(),
                    'response' => $response->json()
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('Exception when testing connection to Qdrant: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }
} 