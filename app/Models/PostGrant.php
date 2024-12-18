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
        'grant_type',
        'grant_theme',
        'cycle',
        'sponsored_by',
        'email',
        'website',
        'country',
        'image',
        'attachment',
        'status',
    ];

    protected $casts = [
        'grant_theme' => 'array', // Cast field_of_study as an array
    ];


    /**
     * Define the relationship to the User model (Academician).
     */
    public function academician()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }
}
