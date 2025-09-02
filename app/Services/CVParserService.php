<?php

namespace App\Services;

use Spatie\PdfToText\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class CVParserService
{
    /**
     * Extracts text content from a given file path in storage.
     *
     * @param string $filePath The path to the file within the storage disk.
     * @return string The extracted text content.
     */
    public static function getText(string $filePath): string
    {
        $fullPath = Storage::disk('public')->path($filePath);

        if (!Storage::disk('public')->exists($filePath)) {
            Log::error("CVParserService: File does not exist at path: {$filePath}");
            return '';
        }

        try {
            // --- THE DEFINITIVE FIX IS HERE ---
            // Provide the absolute path directly to the pdftotext executable.
            // Verify this path is exactly correct on your machine.
            $pathToBinary = config('services.poppler.path');

            // 1. Extract text without forcing any encoding at the command level.
            $text = (new Pdf($pathToBinary))
                ->setPdf($fullPath)
                ->text();

            // 2. Force the extracted text to be valid UTF-8.
            // This is a more robust method to clean up malformed characters.
            return mb_convert_encoding($text, 'UTF-8', 'ISO-8859-1');

        } catch (\Exception $e) {
            Log::error("CVParserService: Failed to extract text from PDF. Error: " . $e->getMessage());
            return '';
        }
    }
}