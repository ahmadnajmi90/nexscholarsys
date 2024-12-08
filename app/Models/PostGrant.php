<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostGrant extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id',
        'title',
        'description',
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
        'purpose',
        'student_nationality',
        'student_level',
        'appointment_type',
        'purpose_of_collaboration',
        'image',
        'attachment',
        'amount',
        'application_url',
        'status'
    ];

    protected $casts = [
        'field_of_research' => 'array', // Cast field_of_study as an array
    ];


    /**
     * Define the relationship to the User model (Academician).
     */
    public function academician()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }
}
