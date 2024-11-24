<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id',
        'event_name',
        'description',
        'image',
        'event_type',
        'theme',
        'location',
        'start_date_time',
        'end_date_time',
        'organized_by',
        'target_audience',
        'registration_url',
        'registration_deadline',
        'fees',
        'contact_email',
        'contact_number',
        'agenda',
        'speakers',
        'sponsors',
        'attachment',
        'event_status',
        'is_featured',
    ];

    /**
     * Define the relationship to the User model (Academician).
     */
    public function academician()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }
}
