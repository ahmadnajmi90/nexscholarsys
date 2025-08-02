<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FieldOfResearch extends Model
{
    protected $fillable = ['name'];
    use HasFactory;

    protected $table = 'field_of_research'; // Define the table name (optional if it follows convention)

    // Define relationships
    public function researchAreas()
    {
        return $this->hasMany(ResearchArea::class);
    }
}
