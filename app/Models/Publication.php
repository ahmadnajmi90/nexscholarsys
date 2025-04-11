<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    use HasFactory;

    protected $fillable = [
        'academician_id',
        'title',
        'authors',
        'venue',
        'year',
        'citations',
        'url',
        'abstract',
        'last_updated_at'
    ];

    protected $casts = [
        'last_updated_at' => 'datetime',
    ];

    public function academician()
    {
        return $this->belongsTo(Academician::class, 'academician_id', 'academician_id');
    }
} 