<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\IOFactory as PhpWordIOFactory;
use Exception;

class DocumentTextExtractorService
{
    /**
     * Extract text from a document using the appropriate method based on file type
     *
     * @param string $filePath The path to the file relative to storage/app/public
     * @param int|null $userId Optional user ID for logging context
     * @return string|null The extracted text or null if extraction failed
     */
    public function extractText(string $filePath, ?int $userId = null): ?string
    {
        // Log the requested file path for debugging
        Log::info("CV text extraction requested", [
            'user_id' => $userId,
            'requested_path' => $filePath
        ]);

        // First try using Laravel's Storage facade to locate the file
        // This is the preferred modern approach that properly handles storage locations
        if (Storage::disk('public')->exists($filePath)) {
            $absolutePath = Storage::disk('public')->path($filePath);
            Log::info("File found in public storage", [
                'relative_path' => $filePath,
                'absolute_path' => $absolutePath,
                'file_size' => filesize($absolutePath)
            ]);
        }
        // Fallbacks in case the file is stored in a different location
        else {
            // Try different possible storage locations, prioritizing the correct path first
            $possiblePaths = [
                storage_path('app/public/' . $filePath),         // Standard Laravel public storage
                storage_path('app/private/public/' . $filePath), // Possible non-standard path
                storage_path('app/' . $filePath),                // Direct app storage
                public_path('storage/' . $filePath),             // Symlinked public path
                $filePath                                        // Direct absolute path as last resort
            ];
            
            // Find the first valid path that exists
            $absolutePath = null;
            foreach ($possiblePaths as $path) {
                if (file_exists($path)) {
                    $absolutePath = $path;
                    Log::info("File found via fallback path", [
                        'original_path' => $filePath,
                        'found_at' => $path,
                        'file_size' => filesize($path)
                    ]);
                    break;
                }
            }
            
            if (!$absolutePath) {
                Log::error("Document file not found in any of the expected locations", [
                    'user_id' => $userId,
                    'requested_path' => $filePath,
                    'tried_paths' => $possiblePaths
                ]);
                return null;
            }
        }
        
        $extension = strtolower(pathinfo($absolutePath, PATHINFO_EXTENSION));
        $filename = pathinfo($absolutePath, PATHINFO_BASENAME);
        
        try {
            // Direct text extraction methods first (for text-based files)
            $text = match($extension) {
                'pdf' => $this->extractFromPdf($absolutePath),
                'docx' => $this->extractFromDocx($absolutePath),
                'doc' => $this->extractFromDoc($absolutePath),
                'txt' => file_get_contents($absolutePath),
                'jpg', 'jpeg', 'png', 'tiff', 'bmp', 'gif' => $this->extractFromImage($absolutePath),
                default => null,
            };
            
            // If direct text extraction fails or produces poor results, try OCR as fallback for PDFs
            if (($extension === 'pdf' && (empty($text) || strlen($text) < 100)) || $text === null) {
                Log::info("Direct text extraction failed or produced poor results. Trying OCR fallback for: {$filePath}");
                $text = $this->extractFromImageWithOCR($absolutePath);
            }
            
            if ($text) {
                // Clean up the text
                $text = $this->cleanText($text);
                
                // Log the extracted text with user context
                $contextMsg = $userId ? "User ID: {$userId}" : "Unknown user";
                Log::info("Successfully extracted text from {$filename} ({$contextMsg})", [
                    'filename' => $filename,
                    'user_id' => $userId,
                    'file_size' => filesize($absolutePath),
                    'text_length' => strlen($text),
                    'extraction_method' => $extension === 'pdf' && strpos($text, 'OCR FALLBACK:') === 0 ? 'OCR' : 'direct'
                ]);
                
                // Log the full extracted text for debugging purposes
                Log::debug("Extracted CV text content for {$contextMsg}:", [
                    'filename' => $filename,
                    'content' => $text
                ]);
                
                return $text;
            }
            
            Log::error("Text extraction methods returned empty or null result", [
                'user_id' => $userId,
                'filename' => $filename,
                'extension' => $extension
            ]);
            return null;
        } catch (Exception $e) {
            Log::error("Error extracting text from document", [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'user_id' => $userId,
                'filename' => $filename,
                'extension' => $extension
            ]);
            return null;
        }
    }
    
    /**
     * Extract text from a PDF file using pdftotext
     *
     * @param string $filePath
     * @return string|null
     */
    protected function extractFromPdf(string $filePath): ?string
    {
        try {
            // First try Spatie PDF to Text if it exists
            if (class_exists('Spatie\PdfToText\Pdf')) {
                try {
                    Log::info("Attempting to extract PDF text using Spatie/pdftotext");
                    $pdfToText = new \Spatie\PdfToText\Pdf();
                    $text = $pdfToText->setPdf($filePath)->text();
                    
                    // If we got text, return it
                    if (!empty($text)) {
                        Log::info("Successfully extracted text using Spatie/pdftotext");
                        return $text;
                    }
                    
                    Log::info("Spatie/pdftotext returned empty text, trying Smalot/PDFParser");
                } catch (Exception $e) {
                    Log::error("Error using Spatie/pdftotext: {$e->getMessage()}");
                    Log::info("Falling back to Smalot/PDFParser");
                }
            } else {
                Log::info("Spatie\PdfToText\Pdf class not found, skipping pdftotext extraction");
            }
            
            // Second, try the Smalot PDFParser (pure PHP solution)
            $text = $this->extractWithSmalotParser($filePath);
            if (!empty($text)) {
                Log::info("Successfully extracted text using Smalot/PDFParser");
                return $text;
            }
            
            // If both methods fail, fall back to OCR
            Log::info("PDFParser and pdftotext both failed, falling back to OCR for PDF extraction");
            return $this->extractFromImageWithOCR($filePath);
        } catch (Exception $e) {
            Log::error("Error extracting text from PDF: {$e->getMessage()}");
            
            // Final fallback to OCR
            try {
                Log::info("Falling back to OCR for PDF extraction: {$filePath}");
                return $this->extractFromImageWithOCR($filePath);
            } catch (Exception $fallbackError) {
                Log::error("Error in OCR fallback for PDF: {$fallbackError->getMessage()}");
                return null;
            }
        }
    }
    
    /**
     * Extract text from a PDF using Smalot PDFParser (pure PHP solution)
     *
     * @param string $filePath
     * @return string|null
     */
    protected function extractWithSmalotParser(string $filePath): ?string
    {
        if (!class_exists('Smalot\PdfParser\Parser')) {
            Log::error("Smalot\PdfParser\Parser class not found. Make sure smalot/pdfparser is installed.");
            return null;
        }
        
        try {
            Log::info("Attempting to extract PDF text using Smalot PDFParser");
            
            // Create a new parser
            $parser = new \Smalot\PdfParser\Parser();
            
            // Parse the file
            $pdf = $parser->parseFile($filePath);
            
            // Extract text from PDF
            $text = $pdf->getText();
            
            if (empty($text)) {
                Log::info("Smalot PDFParser returned empty text");
                return null;
            }
            
            return $text;
        } catch (Exception $e) {
            Log::error("Error extracting text with Smalot PDFParser: {$e->getMessage()}");
            return null;
        }
    }
    
    /**
     * Extract text from a DOCX file
     *
     * @param string $filePath
     * @return string|null
     */
    protected function extractFromDocx(string $filePath): ?string
    {
        try {
            $phpWord = PhpWordIOFactory::load($filePath);
            $text = '';
            
            foreach ($phpWord->getSections() as $section) {
                foreach ($section->getElements() as $element) {
                    if (method_exists($element, 'getElements')) {
                        foreach ($element->getElements() as $childElement) {
                            if (method_exists($childElement, 'getText')) {
                                $text .= $childElement->getText() . ' ';
                            }
                        }
                    } elseif (method_exists($element, 'getText')) {
                        $text .= $element->getText() . ' ';
                    }
                }
            }
            
            return $text;
        } catch (Exception $e) {
            Log::error("Error extracting text from DOCX: {$e->getMessage()}");
            return null;
        }
    }
    
    /**
     * Extract text from a DOC file
     *
     * @param string $filePath
     * @return string|null
     */
    protected function extractFromDoc(string $filePath): ?string
    {
        try {
            // Try using catdoc if available on the system
            $text = shell_exec("catdoc {$filePath}");
            
            if (!$text) {
                // Fallback to antiword if available
                $text = shell_exec("antiword {$filePath}");
            }
            
            return $text;
        } catch (Exception $e) {
            Log::error("Error extracting text from DOC: {$e->getMessage()}");
            return null;
        }
    }
    
    /**
     * Extract text from an image using OCR
     *
     * @param string $filePath
     * @return string|null
     */
    protected function extractFromImage(string $filePath): ?string
    {
        return $this->extractFromImageWithOCR($filePath);
    }
    
    /**
     * Extract text from a document using Tesseract OCR
     * Used as a fallback for PDFs and primary method for images
     *
     * @param string $filePath
     * @return string|null
     */
    protected function extractFromImageWithOCR(string $filePath): ?string
    {
        try {
            // Check if Tesseract OCR class exists
            if (!class_exists('thiagoalessio\TesseractOCR\TesseractOCR')) {
                Log::error("thiagoalessio\TesseractOCR\TesseractOCR class not found. Make sure the package is properly installed.");
                return null;
            }
            
            $ocr = new \thiagoalessio\TesseractOCR\TesseractOCR($filePath);
            $ocr->lang('eng');
            $text = $ocr->run();
            
            return $text;
        } catch (Exception $e) {
            Log::error("Error extracting text with OCR: {$e->getMessage()}");
            return null;
        }
    }
    
    /**
     * Clean and normalize extracted text
     *
     * @param string $text
     * @return string
     */
    protected function cleanText(string $text): string
    {
        // Remove excessive whitespace
        $text = preg_replace('/\s+/', ' ', $text);
        
        // Trim the text
        $text = trim($text);
        
        // Fix malformed UTF-8 characters
        $text = $this->sanitizeUtf8($text);
        
        return $text;
    }
    
    /**
     * Sanitize text to ensure it contains valid UTF-8 characters
     * This prevents errors when the text is JSON encoded for API calls
     *
     * @param string $text
     * @return string
     */
    protected function sanitizeUtf8(string $text): string
    {
        // Replace any invalid UTF-8 sequences with the Unicode replacement character
        if (!mb_check_encoding($text, 'UTF-8')) {
            // Option 1: Replace invalid characters with Unicode replacement character
            $text = mb_convert_encoding($text, 'UTF-8', 'UTF-8');
            
            // Option 2: Stronger sanitization if needed
            $text = iconv('UTF-8', 'UTF-8//IGNORE', $text);
            
            // Log that sanitization was needed
            Log::info("Text required UTF-8 sanitization");
        }
        
        // Remove any null bytes, control characters and other problematic characters
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text);
        
        return $text;
    }
} 