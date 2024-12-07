<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResearchArea extends Model
{
    use HasFactory;

    protected $table = 'research_area'; // Define the table name (optional if it follows convention)

    // Define relationships
    public function nicheDomains()
    {
        return $this->hasMany(NicheDomain::class);
    }

    public function fieldOfResearch()
    {
        return $this->belongsTo(FieldOfResearch::class);
    }
}
