<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id',
        'title',
        'description',
        'project_type',
        'purpose',
        'start_date',
        'end_date',
        'image',
        'attachment',
        'email',
        'location'
    ];

    public function academician()
    {
        return $this->belongsTo(User::class, 'author_id', 'unique_id'); // Adjust to match your unique identifier field
    }
}

