<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PostgraduateProgram extends Model
{
    use HasFactory;

    protected $table = 'postgraduate_programs';

    protected $fillable = [
        'name',
        'program_type',
        'university_id',
        'faculty_id',
        'description',
        'duration_years',
        'funding_info',
        'application_url',
        'country',
        'research_areas',
    ];

    protected $casts = [
        'research_areas' => 'array',
    ];

    public function university(): BelongsTo
    {
        // Universities are stored in `university_list` via the `UniversityList` model
        return $this->belongsTo(UniversityList::class, 'university_id');
    }

    public function faculty(): BelongsTo
    {
        // Faculties are stored in `faculty_list` via the `FacultyList` model
        return $this->belongsTo(FacultyList::class, 'faculty_id');
    }

    public function academicians(): BelongsToMany
    {
        // Explicitly define the pivot table to avoid naming ambiguity
        return $this->belongsToMany(
            Academician::class,
            'academician_postgraduate_program',
            'postgraduate_program_id',
            'academician_id'
        )
            ->withTimestamps();
    }
}

