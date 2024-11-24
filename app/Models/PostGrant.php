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
        'image',
        'post_status',
        'grant_status',
        'category',
        'tags',
        'sponsored_by',
        'location',
        'email',
        'contact_number',
        'purpose',
        'start_date',
        'end_date',
        'budget',
        'eligibility_criteria',
        'is_featured',
        'application_url',
        'attachment',
    ];


    /**
     * Define the relationship to the User model (Academician).
     */
    public function academician()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }
}
