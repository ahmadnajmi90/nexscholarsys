<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionTimeline extends Model
{
    use HasFactory;

    protected $table = 'supervision_timeline';

    protected $fillable = [
        'entity_type',
        'entity_id',
        'event_type',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];
}

