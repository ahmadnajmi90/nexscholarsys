<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionRelationship extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'academician_id',
        'role',
        'status',
        'start_date',
        'end_date',
        'cohort',
        'meeting_cadence',
        'scholarlab_workspace_id',
        'scholarlab_board_id',
        'conversation_id',
        'accepted_at',
        'terminated_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'accepted_at' => 'datetime',
        'terminated_at' => 'datetime',
    ];

    public const ROLE_MAIN = 'main';
    public const ROLE_CO = 'co';

    public const STATUS_ACTIVE = 'active';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_TERMINATED = 'terminated';

    public function student()
    {
        return $this->belongsTo(Postgraduate::class, 'student_id', 'postgraduate_id');
    }

    public function academician()
    {
        return $this->belongsTo(Academician::class, 'academician_id', 'academician_id');
    }

    public function conversation()
    {
        return $this->belongsTo(Messaging\Conversation::class);
    }

    public function meetings()
    {
        return $this->hasMany(SupervisionMeeting::class);
    }

    public function notes()
    {
        return $this->hasMany(SupervisionNote::class);
    }

    public function timeline()
    {
        return $this->morphMany(SupervisionTimeline::class, 'entity');
    }

    public function onboardingChecklistItems()
    {
        return $this->hasMany(SupervisionOnboardingChecklistItem::class)->orderBy('order');
    }
}

