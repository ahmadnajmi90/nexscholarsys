<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupervisionRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'academician_id',
        'postgraduate_program_id',
        'proposal_title',
        'motivation',
        'welcome_message',
        'offer_details',
        'rejection_feedback',
        'recommended_supervisors',
        'suggested_keywords',
        'status',
        'submitted_at',
        'decision_at',
        'cancel_reason',
        'conversation_id',
        'rejection_acknowledged_at',
        'offer_acknowledged_at',
        'student_response_acknowledged_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'decision_at' => 'datetime',
        'rejection_acknowledged_at' => 'datetime',
        'offer_acknowledged_at' => 'datetime',
        'student_response_acknowledged_at' => 'datetime',
        'offer_details' => 'array',
        'recommended_supervisors' => 'array',
    ];

    public const STATUS_PENDING = 'pending';
    public const STATUS_PENDING_STUDENT_ACCEPTANCE = 'pending_student_acceptance';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_AUTO_CANCELLED = 'auto_cancelled';
    public const STATUS_CANCELLED = 'cancelled';

    public function student()
    {
        return $this->belongsTo(Postgraduate::class, 'student_id', 'postgraduate_id');
    }

    public function academician()
    {
        return $this->belongsTo(Academician::class, 'academician_id', 'academician_id');
    }

    public function postgraduateProgram()
    {
        return $this->belongsTo(PostgraduateProgram::class);
    }

    public function attachments()
    {
        return $this->hasMany(SupervisionRequestAttachment::class);
    }

    public function conversation()
    {
        return $this->belongsTo(Messaging\Conversation::class);
    }

    public function timeline()
    {
        return $this->morphMany(SupervisionTimeline::class, 'entity');
    }

    public function relationship()
    {
        // Match by student_id and academician_id
        return $this->hasOne(SupervisionRelationship::class, 'student_id', 'student_id')
            ->where('academician_id', $this->academician_id);
    }

    public function notes()
    {
        return $this->hasMany(SupervisionRequestNote::class)->orderByDesc('created_at');
    }

    public function meetings()
    {
        return $this->hasMany(SupervisionMeeting::class, 'supervision_request_id')->orderBy('scheduled_for');
    }

    public function abstract()
    {
        return $this->hasOne(SupervisionRequestAbstract::class, 'supervision_request_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }
}

