<?php

namespace App\Services\Supervision;

use App\Models\SupervisionRequest;
use App\Models\SupervisionRequestAbstract;
use App\Models\SupervisionRequestAttachment;
use App\Services\DocumentTextExtractorService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Exception;

class AbstractService
{
    protected DocumentTextExtractorService $textExtractor;

    public function __construct(DocumentTextExtractorService $textExtractor)
    {
        $this->textExtractor = $textExtractor;
    }

    /**
     * Extract abstract from proposal attachment and store it
     *
     * @param SupervisionRequest $request
     * @param int $attachmentId
     * @return SupervisionRequestAbstract|null
     */
    public function extractAndStore(SupervisionRequest $request, int $attachmentId): ?SupervisionRequestAbstract
    {
        try {
            $attachment = SupervisionRequestAttachment::find($attachmentId);
            
            if (!$attachment) {
                Log::error('Attachment not found for abstract extraction', ['attachment_id' => $attachmentId]);
                return $this->markAsFailed($request, 'Proposal attachment not found');
            }

            // Get the file path
            $filePath = $attachment->path;
            
            // Extract full text from document
            $fullText = $this->textExtractor->extractText($filePath);
            
            if (empty($fullText)) {
                Log::warning('Could not extract text from proposal document', [
                    'request_id' => $request->id,
                    'attachment_id' => $attachmentId,
                    'file_path' => $filePath
                ]);
                return $this->markAsFailed($request, 'Could not extract text from document. Please enter abstract manually.');
            }

            // Find and extract abstract section
            $abstract = $this->findAbstractSection($fullText);
            
            if (empty($abstract)) {
                Log::warning('Could not find abstract section in document', [
                    'request_id' => $request->id,
                    'text_length' => strlen($fullText)
                ]);
                return $this->markAsFailed($request, 'Abstract section not found in document. Please enter it manually.');
            }

            // Clean and validate the extracted text
            $abstract = $this->cleanExtractedText($abstract);
            
            $minLength = config('abstracts.min_length');
            $maxLength = config('abstracts.max_length');
            
            if (strlen($abstract) < $minLength) {
                return $this->markAsFailed($request, "Extracted abstract is too short (minimum {$minLength} characters). Please enter it manually.");
            }

            if (strlen($abstract) > $maxLength) {
                $abstract = substr($abstract, 0, $maxLength);
                Log::info("Abstract truncated to {$maxLength} characters", ['request_id' => $request->id]);
            }

            // Store the abstract in a transaction
            $abstractRecord = \Illuminate\Support\Facades\DB::transaction(function () use ($request, $abstract, $attachment, $filePath) {
                return SupervisionRequestAbstract::updateOrCreate(
                    ['supervision_request_id' => $request->id],
                    [
                        'abstract' => $abstract,
                        'extraction_status' => 'extracted',
                        'source_file' => $attachment->original_name ?? basename($filePath),
                        'extraction_error' => null,
                    ]
                );
            });

            Log::info('Successfully extracted and stored abstract', [
                'request_id' => $request->id,
                'abstract_length' => strlen($abstract)
            ]);

            return $abstractRecord;

        } catch (Exception $e) {
            Log::error('Error extracting abstract', [
                'request_id' => $request->id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return $this->markAsFailed($request, 'An error occurred while extracting abstract: ' . $e->getMessage());
        }
    }

    /**
     * Find the abstract section in the document text
     *
     * @param string $text
     * @return string|null
     */
    protected function findAbstractSection(string $text): ?string
    {
        // Patterns to find abstract section
        // Looking for "Abstract" heading followed by content until next major heading
        $patterns = [
            // Pattern 1: ABSTRACT in all caps (most common in theses)
            '/\bABSTRACT\b\s*[\r\n]+((?:(?!\b(?:ABSTRAK|ACKNOWLEDGEMENT|TABLE OF CONTENTS|LIST OF|CHAPTER|INTRODUCTION)\b).)+)/is',
            
            // Pattern 2: Abstract followed by common sections (case-insensitive)
            '/\bAbstract\b\s*[\r\n]+((?:(?!\b(?:Abstrak|Acknowledgement|Table of Contents|List of|Chapter|Introduction|Keywords|Background)\b).)+)/is',
            
            // Pattern 3: Abstract with colon
            '/\bAbstract\s*:\s*((?:(?!\b(?:Keywords|Introduction|Background|Chapter)\b).)+)/is',
            
            // Pattern 4: More flexible - capture until double line break or next all-caps heading
            '/\bAbstract\b\s*:?\s*[\r\n]+((?:(?![A-Z]{2,}[A-Z\s]+[\r\n]).)+?)(?=\n\s*\n|\n[A-Z]{3,})/is',
            
            // Pattern 5: Very flexible - just find "Abstract" and grab next 500-3000 chars
            '/\bAbstract\b\s*:?\s*[\r\n]+(.{500,3000}?)(?=\n\s*\n[A-Z]|\n\s*\nKeywords)/is',
            
            // Pattern 6: Fallback - simple extraction
            '/\bAbstract\b\s*:?\s*[\r\n]*(.{100,}?)(?=\n\s*\n\s*\n|$)/is',
        ];

        foreach ($patterns as $patternIndex => $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $abstract = trim($matches[1]);
                
                // Clean up potential false positives
                // Stop at common section headers that might have been captured
                $stopWords = ['Keywords:', 'ABSTRAK', 'Acknowledgement', 'TABLE OF CONTENTS', 'CHAPTER'];
                foreach ($stopWords as $stopWord) {
                    $pos = stripos($abstract, $stopWord);
                    if ($pos !== false) {
                        $abstract = trim(substr($abstract, 0, $pos));
                    }
                }
                
                // Validate that we got meaningful content
                if (strlen($abstract) > 50 && strlen($abstract) < 10000) {
                    Log::info('Abstract found using pattern', [
                        'pattern_index' => $patternIndex,
                        'length' => strlen($abstract),
                        'preview' => substr($abstract, 0, 100) . '...'
                    ]);
                    return $abstract;
                }
            }
        }

        Log::warning('No abstract pattern matched in document');
        return null;
    }

    /**
     * Clean and format the extracted abstract text
     *
     * @param string $text
     * @return string
     */
    protected function cleanExtractedText(string $text): string
    {
        // Remove excessive whitespace while preserving paragraph breaks
        $text = preg_replace('/[ \t]+/', ' ', $text);
        
        // Normalize line breaks
        $text = preg_replace('/\r\n|\r/', "\n", $text);
        
        // Remove excessive line breaks (more than 2)
        $text = preg_replace('/\n{3,}/', "\n\n", $text);
        
        // Trim
        $text = trim($text);
        
        // Remove any "Keywords:" section if accidentally included
        $text = preg_replace('/\n\s*Keywords?\s*:.*$/is', '', $text);
        
        return $text;
    }

    /**
     * Update abstract manually
     *
     * @param int $requestId
     * @param string $text
     * @return SupervisionRequestAbstract
     */
    public function updateManually(int $requestId, string $text): SupervisionRequestAbstract
    {
        $abstract = SupervisionRequestAbstract::updateOrCreate(
            ['supervision_request_id' => $requestId],
            [
                'abstract' => $text,
                'extraction_status' => 'manual',
                'extraction_error' => null,
            ]
        );

        Log::info('Abstract updated manually', [
            'request_id' => $requestId,
            'abstract_length' => strlen($text)
        ]);

        return $abstract;
    }

    /**
     * Get abstract for a request
     *
     * @param int $requestId
     * @return SupervisionRequestAbstract|null
     */
    public function getAbstract(int $requestId): ?SupervisionRequestAbstract
    {
        return SupervisionRequestAbstract::where('supervision_request_id', $requestId)->first();
    }

    /**
     * Mark extraction as failed
     *
     * @param SupervisionRequest $request
     * @param string $error
     * @return SupervisionRequestAbstract
     */
    public function markAsFailed(SupervisionRequest $request, string $error): SupervisionRequestAbstract
    {
        return SupervisionRequestAbstract::updateOrCreate(
            ['supervision_request_id' => $request->id],
            [
                'abstract' => null,
                'extraction_status' => 'failed',
                'extraction_error' => $error,
            ]
        );
    }

    /**
     * Retry extraction for a failed abstract
     *
     * @param int $requestId
     * @return SupervisionRequestAbstract|null
     */
    public function retryExtraction(int $requestId): ?SupervisionRequestAbstract
    {
        $request = SupervisionRequest::find($requestId);
        
        if (!$request) {
            return null;
        }

        $proposalAttachment = $request->attachments()->where('type', 'proposal')->first();
        
        if (!$proposalAttachment) {
            return null;
        }

        return $this->extractAndStore($request, $proposalAttachment->id);
    }
}

