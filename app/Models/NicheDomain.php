<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NicheDomain extends Model
{
    use HasFactory;

    protected $table = 'niche_domain'; // Define the table name (optional if it follows convention)

    // Define relationships
    public function researchArea()
    {
        return $this->belongsTo(ResearchArea::class);
    }
}
