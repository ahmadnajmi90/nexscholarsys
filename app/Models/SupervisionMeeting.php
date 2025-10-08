<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionMeeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'supervision_relationship_id',
        'supervision_request_id',
        'title',
        'scheduled_for',
        'location_link',
        'agenda',
        'attachments',
        'external_event_id',
        'external_provider',
        'created_by',
    ];

    protected $casts = [
        'scheduled_for' => 'datetime',
        'attachments' => 'array',
    ];

    public function relationship()
    {
        return $this->belongsTo(SupervisionRelationship::class, 'supervision_relationship_id');
    }

    public function request()
    {
        return $this->belongsTo(SupervisionRequest::class, 'supervision_request_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

