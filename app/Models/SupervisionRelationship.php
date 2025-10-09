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
        'university_letter_path',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'accepted_at' => 'datetime',
        'terminated_at' => 'datetime',
    ];

    protected $appends = ['supervision_request'];

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

    public function unbindRequests()
    {
        return $this->hasMany(SupervisionRelationshipUnbindRequest::class, 'relationship_id');
    }

    public function activeUnbindRequest()
    {
        return $this->hasOne(SupervisionRelationshipUnbindRequest::class, 'relationship_id')
            ->where('status', SupervisionRelationshipUnbindRequest::STATUS_PENDING)
            ->latest();
    }

    public function researchDetail()
    {
        return $this->hasOne(SupervisionResearchDetail::class, 'relationship_id');
    }

    public function documents()
    {
        return $this->hasMany(SupervisionDocument::class, 'relationship_id');
    }

    public function supervisionRequest()
    {
        // The supervision request that led to this relationship
        // Note: This only matches on student_id. For proper filtering by academician_id,
        // use the supervisionRequestForAcademician() method or add constraints when eager loading
        return $this->hasOne(SupervisionRequest::class, 'student_id', 'student_id')
            ->where('status', SupervisionRequest::STATUS_ACCEPTED)
            ->latest();
    }
    
    /**
     * Get the specific supervision request for this relationship's academician
     * Use this when you need the exact request for this student-academician pair
     */
    public function getSupervisionRequestAttribute()
    {
        return SupervisionRequest::where('student_id', $this->student_id)
            ->where('academician_id', $this->academician_id)
            ->where('status', SupervisionRequest::STATUS_ACCEPTED)
            ->latest()
            ->first();
    }

    public function cosupervisorInvitations()
    {
        return $this->hasMany(CoSupervisorInvitation::class, 'relationship_id');
    }

    public function pendingCosupervisorInvitations()
    {
        return $this->hasMany(CoSupervisorInvitation::class, 'relationship_id')
            ->where(function ($query) {
                $query->where('cosupervisor_status', CoSupervisorInvitation::STATUS_PENDING)
                    ->orWhere('approver_status', CoSupervisorInvitation::STATUS_PENDING);
            })
            ->whereNull('cancelled_at');
    }

    public function cosupervisors()
    {
        return $this->hasMany(SupervisionRelationship::class, 'student_id', 'student_id')
            ->where('role', self::ROLE_CO)
            ->where('status', self::STATUS_ACTIVE);
    }

    public function isMainSupervisor()
    {
        return $this->role === self::ROLE_MAIN;
    }

    public function isCoSupervisor()
    {
        return $this->role === self::ROLE_CO;
    }
}

