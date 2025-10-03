<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionMilestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'research_id',
        'title',
        'description',
        'due_date',
        'completed',
        'completed_at',
        'order',
        'created_by',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function researchDetail()
    {
        return $this->belongsTo(SupervisionResearchDetail::class, 'research_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

