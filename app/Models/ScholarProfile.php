<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScholarProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'academician_id',
        'name',
        'affiliation',
        'total_citations',
        'h_index',
        'i10_index',
        'last_scraped_at'
    ];

    protected $casts = [
        'last_scraped_at' => 'datetime',
    ];

    public function academician()
    {
        return $this->belongsTo(Academician::class, 'academician_id', 'academician_id');
    }

    public function publications()
    {
        return $this->hasMany(Publication::class, 'academician_id', 'academician_id');
    }
} 