<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Academician extends Model
{
    use HasFactory;

    protected $table = 'academicians';

    protected $fillable = [
        'academician_id',
        'phone_number',
        'full_name',
        'profile_picture',
        'current_position',
        'department',
        'university',
        'faculty',
        'highest_degree',
        'field_of_study',
        'research_expertise',
        'website',
        'linkedin',
        'google_scholar',
        'researchgate',
        'bio',
        'verified',
        'availability_for_collaboration',
        'availability_as_supervisor',
        'background_image',
        'url',
    ];

    protected $casts = [
        'research_expertise' => 'array', // Cast research_expertise as an array
    ];

    protected static function booted()
    {
        static::creating(function ($academician) {
            if (!$academician->url) {
                $slug = Str::slug($academician->full_name);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->exists()) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $academician->url = $slug;
            }
        });

        static::updating(function ($academician) {
            if ($academician->isDirty('full_name') || !$academician->url) {
                $slug = Str::slug($academician->full_name);
                $originalSlug = $slug;
                $count = 2;
                while (self::where('url', $slug)->where('id', '!=', $academician->id)->exists()) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $academician->url = $slug;
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'academician_id', 'unique_id');
    }

    public function facultyAdmin()
    {
        return $this->belongsTo(FacultyAdmin::class, 'faculty_id', 'faculty');
    }

    public function universityDetails()
    {
        return $this->belongsTo(UniversityList::class, 'university', 'id');
    }

    public function faculty()
    {
        return $this->belongsTo(FacultyList::class, 'faculty', 'id');
    }
}
