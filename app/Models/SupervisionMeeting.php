<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupervisionMeeting extends Model
{
    use HasFactory, SoftDeletes;

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
        'cancelled_at',
        'reminder_24h_sent_at',
        'reminder_1h_sent_at',
    ];

    protected $casts = [
        'scheduled_for' => 'datetime',
        'attachments' => 'array',
        'cancelled_at' => 'datetime',
        'reminder_24h_sent_at' => 'datetime',
        'reminder_1h_sent_at' => 'datetime',
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

