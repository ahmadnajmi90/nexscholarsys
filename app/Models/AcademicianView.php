<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademicianView extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'academician_id',
        'user_id',
        'ip_address',
    ];

    /**
     * Get the academician that owns the view.
     */
    public function academician(): BelongsTo
    {
        return $this->belongsTo(Academician::class, 'academician_id');
    }

    /**
     * Get the user that owns the view.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include views from a specific academician.
     */
    public function scopeForAcademician($query, $academicianId)
    {
        return $query->where('academician_id', $academicianId);
    }

    /**
     * Scope a query to only include views from a specific user.
     */
    public function scopeFromUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include views from a specific IP address.
     */
    public function scopeFromIp($query, $ipAddress)
    {
        return $query->where('ip_address', $ipAddress);
    }

    /**
     * Scope a query to only include views created today.
     */
    public function scopeCreatedToday($query)
    {
        return $query->whereDate('created_at', now()->toDateString());
    }

    /**
     * Scope a query to only include views created in the last 24 hours.
     */
    public function scopeCreatedInLast24Hours($query)
    {
        return $query->where('created_at', '>=', now()->subHours(24));
    }
}
