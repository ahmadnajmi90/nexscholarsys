<?php

namespace App\Imports;

use App\Models\PostgraduateProgram;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PostgraduateProgramsImport implements ToModel, WithHeadingRow
{
    /**
     * Map a row from the spreadsheet to a PostgraduateProgram model instance.
     *
     * @param array<string,mixed> $row
     */
    public function model(array $row)
    {
        // Prevent duplicates by updating existing program matched by name + university
        return PostgraduateProgram::updateOrCreate(
            [
                'name' => $row['name'] ?? null,
                'university_id' => $row['university_id'] ?? null,
            ],
            [
                'program_type' => $row['program_type'] ?? 'Master',
                'faculty_id' => $row['faculty_id'] ?? null,
                'description' => $row['description'] ?? null,
                'duration_years' => $row['duration_years'] ?? null,
                'funding_info' => $row['funding_info'] ?? null,
                'application_url' => $row['application_url'] ?? null,
                'country' => $row['country'] ?? null,
            ]
        );
    }
}

