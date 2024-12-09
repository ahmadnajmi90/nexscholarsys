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
        'event_type',
        'event_mode',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'image',
        'attachment',
        'registration_url',
        'registration_deadline',
        'contact_email',
        'venue',
        'city',
        'country',
        'event_status'
    ];

    /**
     * Define the relationship to the User model (Academician).
     */
    public function academician()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }
}
