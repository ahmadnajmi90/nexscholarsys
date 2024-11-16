<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostGrantForStudent extends Model
{
    use HasFactory;

    protected $fillable = [
        'academician_id',
        'title',
        'description',
    ];

    /**
     * Define the relationship to the User model (Academician).
     */
    public function academician()
    {
        return $this->belongsTo(User::class, 'academician_id', 'unique_id'); // Adjust to match your unique identifier field
    }
}
