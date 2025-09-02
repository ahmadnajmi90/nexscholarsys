<?php

namespace App\Imports;

use App\Models\PostgraduateProgram;
use App\Models\UniversityList;
use App\Models\FacultyList;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Illuminate\Support\Facades\Log;

class PostgraduateProgramsImport implements ToModel, WithHeadingRow, SkipsEmptyRows
{
    private array $skippedRows = [];
    private array $processedRows = [];

    /**
     * Map a row from the spreadsheet to a PostgraduateProgram model instance.
     * Performs advanced data cleaning, enrichment, and validation.
     *
     * @param array<string,mixed> $row
     * @return PostgraduateProgram|null Returns null if row should be skipped
     */
    public function model(array $row): ?PostgraduateProgram
    {
        try {
            // Skip empty rows or rows without essential data
            if (empty($row['name'])) {
                $this->skippedRows[] = ['row' => $row, 'reason' => 'Missing program name'];
                return null;
            }

            // 1. Determine program_type from Excel column or name
            $programType = $this->determineProgramType($row['name'], $row['program_type'] ?? null);
            if (!$programType) {
                $this->skippedRows[] = ['row' => $row, 'reason' => 'Unable to determine program type from Excel column or name'];
                return null;
            }

            // 2. Resolve university_id and faculty_id
            $universityId = $this->resolveUniversityId($row['university_id'] ?? null);
            if (!$universityId) {
                $this->skippedRows[] = ['row' => $row, 'reason' => 'Unable to resolve university'];
                return null;
            }

            $facultyId = $this->resolveFacultyId($row['faculty_id'] ?? null, $universityId);

            // 3. Derive country from university
            $country = $this->deriveCountryFromUniversity($universityId);

            // 4. Clean description
            $description = $this->cleanDescription($row['description'] ?? null);

            // 5. Set default funding_info
            $fundingInfo = $this->setDefaultFundingInfo($row['funding_info'] ?? null);

            // 6. Clean duration_years
            $durationYears = $this->cleanDurationYears($row['duration_years'] ?? null);

            // Create or update the program
            $program = PostgraduateProgram::updateOrCreate(
                [
                    'name' => trim($row['name']),
                    'university_id' => $universityId,
                ],
                [
                    'program_type' => $programType,
                    'faculty_id' => $facultyId,
                    'description' => $description,
                    'duration_years' => $durationYears,
                    'funding_info' => $fundingInfo,
                'application_url' => $row['application_url'] ?? null,
                    'country' => $country,
                ]
            );

            $this->processedRows[] = [
                'original' => $row,
                'processed' => $program->toArray(),
                'changes' => [
                    'program_type' => $programType,
                    'university_id' => $universityId,
                    'faculty_id' => $facultyId,
                    'country' => $country,
                    'description' => $description,
                    'funding_info' => $fundingInfo,
                    'duration_years' => $durationYears,
                ]
            ];

            return $program;

        } catch (\Exception $e) {
            Log::error('Error processing postgraduate program import row', [
                'row' => $row,
                'error' => $e->getMessage()
            ]);
            $this->skippedRows[] = ['row' => $row, 'reason' => 'Processing error: ' . $e->getMessage()];
            return null;
        }
    }

    /**
     * Determine program type from Excel column or program name.
     * Implements two-step validation: Excel column priority, then name analysis.
     */
    private function determineProgramType(string $name, ?string $programTypeFromExcel): ?string
    {
        // Step 1: Prioritize the Excel program_type column
        if (!empty($programTypeFromExcel)) {
            $excelType = strtolower(trim($programTypeFromExcel));

            if (in_array($excelType, ['master', 'masters'])) {
                return 'Master';
            }

            if (in_array($excelType, ['phd', 'doctor'])) {
                return 'PhD';
            }
        }

        // Step 2: Fallback to name analysis if Excel column is empty or doesn't match
        $nameLower = strtolower($name);

        if (str_contains($nameLower, 'master') || str_contains($nameLower, 'msc') || str_contains($nameLower, 'm.sc')) {
            return 'Master';
        }

        if (str_contains($nameLower, 'doctor') || str_contains($nameLower, 'phd')) {
            return 'PhD';
        }

        return null;
    }

    /**
     * Resolve university ID from ID or name string.
     */
    private function resolveUniversityId(mixed $universityValue): ?int
    {
        if (empty($universityValue)) {
            return null;
        }

        // If it's numeric, treat as ID
        if (is_numeric($universityValue)) {
            $university = UniversityList::find((int) $universityValue);
            return $university ? $university->id : null;
        }

        // If it's a string, search by full_name or short_name
        if (is_string($universityValue)) {
            $university = UniversityList::where('full_name', 'like', '%' . trim($universityValue) . '%')
                ->orWhere('short_name', 'like', '%' . trim($universityValue) . '%')
                ->first();

            return $university ? $university->id : null;
        }

        return null;
    }

    /**
     * Resolve faculty ID from ID or name string, ensuring it belongs to the university.
     */
    private function resolveFacultyId(mixed $facultyValue, int $universityId): ?int
    {
        if (empty($facultyValue)) {
            return null;
        }

        // If it's numeric, treat as ID and verify it belongs to the university
        if (is_numeric($facultyValue)) {
            $faculty = FacultyList::where('id', (int) $facultyValue)
                ->where('university_id', $universityId)
                ->first();
            return $faculty ? $faculty->id : null;
        }

        // If it's a string, search by name within the university
        if (is_string($facultyValue)) {
            $faculty = FacultyList::where('name', 'like', '%' . trim($facultyValue) . '%')
                ->where('university_id', $universityId)
                ->first();

            return $faculty ? $faculty->id : null;
        }

        return null;
    }

    /**
     * Derive country from the resolved university.
     */
    private function deriveCountryFromUniversity(int $universityId): ?string
    {
        $university = UniversityList::find($universityId);
        return $university ? $university->country : null;
    }

    /**
     * Clean description by capitalizing the first letter.
     */
    private function cleanDescription(?string $description): ?string
    {
        if (empty($description)) {
            return null;
        }

        return ucfirst(trim($description));
    }

    /**
     * Set default funding_info if empty.
     */
    private function setDefaultFundingInfo(?string $fundingInfo): string
    {
        if (empty(trim($fundingInfo ?? ''))) {
            return 'Self-funded or external scholarships';
        }

        return trim($fundingInfo);
    }

    /**
     * Clean and standardize duration_years format.
     * Implements specific transformations for consistent formatting.
     */
    private function cleanDurationYears(?string $duration): ?string
    {
        if (empty($duration)) {
            return null;
        }

        $cleaned = trim($duration);

        // 1. Remove spaces around hyphens to standardize ranges
        // Example: "2 - 8 semesters" becomes "2-8 semesters"
        $cleaned = preg_replace('/\s*-\s*/', '-', $cleaned);

        // 2. Ensure spaces around slashes for separators
        // Example: "3-6 years/6-12 semesters" becomes "3-6 years / 6-12 semesters"
        $cleaned = preg_replace('/\s*\/\s*/', ' / ', $cleaned);

        // 3. Parse min/max format into standard range format
        // Example: "2 semesters (minimum); 8 semesters (maximum)" becomes "2-8 semesters"
        if (preg_match('/(.+?)\s*\(minimum\)\s*;\s*(.+?)\s*\(maximum\)/i', $cleaned, $matches)) {
            // Extract the unit from the first part (e.g., "semesters" from "2 semesters (minimum)")
            if (preg_match('/(\d+(?:\.\d+)?)\s+(.+)/', trim($matches[1]), $minMatch)) {
                $minValue = $minMatch[1];
                $unit = $minMatch[2];

                // Extract the max value from the second part
                if (preg_match('/(\d+(?:\.\d+)?)/', trim($matches[2]), $maxMatch)) {
                    $maxValue = $maxMatch[1];
                    $cleaned = $minValue . '-' . $maxValue . ' ' . $unit;
                }
            }
        }

        // Additional cleanup: ensure consistent spacing
        $cleaned = preg_replace('/\s+/', ' ', $cleaned);

        return $cleaned;
    }

    /**
     * Get skipped rows for reporting.
     */
    public function getSkippedRows(): array
    {
        return $this->skippedRows;
    }

    /**
     * Get processed rows for reporting.
     */
    public function getProcessedRows(): array
    {
        return $this->processedRows;
    }
}

