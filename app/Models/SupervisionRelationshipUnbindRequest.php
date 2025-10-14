<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupervisionRelationshipUnbindRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'relationship_id',
        'initiated_by',
        'reason',
        'status',
        'attempt_count',
        'cooldown_until',
        'student_approved_at',
    ];

    protected $casts = [
        'cooldown_until' => 'datetime',
        'student_approved_at' => 'datetime',
    ];

    public const INITIATED_BY_SUPERVISOR = 'supervisor';
    public const INITIATED_BY_STUDENT = 'student';

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_FORCE_UNBIND = 'force_unbind';

    public const MAX_ATTEMPTS_BEFORE_FORCE = 3;

    public function relationship()
    {
        return $this->belongsTo(SupervisionRelationship::class, 'relationship_id');
    }

    public function isInCooldown(): bool
    {
        return $this->cooldown_until && $this->cooldown_until->isFuture();
    }

    public function canForceUnbind(): bool
    {
        return $this->attempt_count >= self::MAX_ATTEMPTS_BEFORE_FORCE;
    }
}

