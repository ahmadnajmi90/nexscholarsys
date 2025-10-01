<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionOnboardingChecklistItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'supervision_relationship_id',
        'task',
        'completed',
        'completed_at',
        'order',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function relationship()
    {
        return $this->belongsTo(SupervisionRelationship::class, 'supervision_relationship_id');
    }
}
