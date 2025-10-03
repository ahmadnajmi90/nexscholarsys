<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionResearchDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'relationship_id',
        'title',
        'objectives',
        'progress_percentage',
        'key_findings',
        'literature_notes',
        'methodology_notes',
        'free_form_content',
    ];

    protected $casts = [
        'objectives' => 'array',
        'progress_percentage' => 'integer',
    ];

    public function relationship()
    {
        return $this->belongsTo(SupervisionRelationship::class, 'relationship_id');
    }

    public function milestones()
    {
        return $this->hasMany(SupervisionMilestone::class, 'research_id')->orderBy('order');
    }
}

