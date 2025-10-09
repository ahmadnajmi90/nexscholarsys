<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoSupervisorInvitation extends Model
{
    use HasFactory;

    protected $table = 'supervision_cosupervisor_invitations';

    protected $fillable = [
        'relationship_id',
        'cosupervisor_academician_id',
        'initiated_by',
        'cosupervisor_status',
        'approver_status',
        'invitation_message',
        'rejection_reason',
        'cosupervisor_responded_at',
        'approver_responded_at',
        'completed_at',
        'cancelled_at',
    ];

    protected $casts = [
        'cosupervisor_responded_at' => 'datetime',
        'approver_responded_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    // Initiated by constants
    public const INITIATED_BY_STUDENT = 'student';
    public const INITIATED_BY_MAIN_SUPERVISOR = 'main_supervisor';

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';

    /**
     * Get the main supervision relationship
     */
    public function relationship()
    {
        return $this->belongsTo(SupervisionRelationship::class, 'relationship_id');
    }

    /**
     * Get the invited co-supervisor
     */
    public function cosupervisor()
    {
        return $this->belongsTo(Academician::class, 'cosupervisor_academician_id', 'academician_id');
    }

    /**
     * Check if invitation is pending
     */
    public function isPending()
    {
        return $this->cosupervisor_status === self::STATUS_PENDING || 
               $this->approver_status === self::STATUS_PENDING;
    }

    /**
     * Check if invitation is fully accepted
     */
    public function isAccepted()
    {
        return $this->cosupervisor_status === self::STATUS_ACCEPTED && 
               $this->approver_status === self::STATUS_ACCEPTED;
    }

    /**
     * Check if invitation is rejected
     */
    public function isRejected()
    {
        return $this->cosupervisor_status === self::STATUS_REJECTED || 
               $this->approver_status === self::STATUS_REJECTED;
    }

    /**
     * Check if invitation is cancelled
     */
    public function isCancelled()
    {
        return !is_null($this->cancelled_at);
    }

    /**
     * Get the approver role (opposite of initiator)
     */
    public function getApproverRole()
    {
        return $this->initiated_by === self::INITIATED_BY_STUDENT 
            ? 'main_supervisor' 
            : 'student';
    }
}
