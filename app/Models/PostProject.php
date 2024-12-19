<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostProject extends Model
{
    use HasFactory;

    protected $table = 'post_projects'; // Replace with your actual table name

    protected $fillable = [
        'author_id',
        'title',
        'description',
        'project_theme',
        'purpose',
        'start_date',
        'end_date',
        'application_deadline',
        'duration',
        'sponsored_by',
        'category',
        'field_of_research',
        'supervisor_category',
        'supervisor_name',
        'university',
        'email',
        'origin_country',
        'student_nationality',
        'student_level',
        'appointment_type',
        'purpose_of_collaboration',
        'image',
        'attachment',
        'application_url',
        'amount',
        'project_status'
    ];

    protected $casts = [
        'field_of_research' => 'array', // Cast field_of_study as an array
        'purpose' => 'array', // Cast field_of_study as an array
    ];

    public function academician()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }
}

