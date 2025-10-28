<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class AIMatchingSearchHistory extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * Laravel converts AIMatchingSearchHistory to a_i_matching_search_histories,
     * but we want ai_matching_search_histories
     */
    protected $table = 'ai_matching_search_histories';

    protected $fillable = [
        'user_id',
        'search_type',
        'search_query',
        'search_results',
        'results_count',
        'expires_at',
    ];

    protected $casts = [
        'search_results' => 'array',
        'expires_at' => 'datetime',
        'results_count' => 'integer',
    ];

    /**
     * Relationship: Belongs to User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: Get only non-expired entries
     */
    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', now());
    }

    /**
     * Scope: Get entries for a specific user and search type
     */
    public function scopeForUserAndType($query, $userId, $searchType)
    {
        return $query->where('user_id', $userId)
                     ->where('search_type', $searchType);
    }

    /**
     * Boot method to set default expiration
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->expires_at) {
                $model->expires_at = Carbon::now()->addDays(7);
            }
        });
    }
}

