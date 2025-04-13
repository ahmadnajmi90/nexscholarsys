<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicianRecommendation extends Model
{
    use HasFactory;

    protected $table = 'academician_recommendations';

    protected $fillable = [
        'academician_id',
        'user_id',
        'ip_address',
        'communication_rating',
        'communication_comment',
        'support_rating',
        'support_comment',
        'expertise_rating',
        'expertise_comment',
        'responsiveness_rating',
        'responsiveness_comment',
    ];

    /**
     * Get the academician that owns the recommendation.
     */
    public function academician()
    {
        return $this->belongsTo(Academician::class, 'academician_id', 'academician_id');
    }

    /**
     * Get the user who made the recommendation.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if a user has already recommended an academician.
     *
     * @param string $academicianId
     * @param int|null $userId
     * @param string|null $ipAddress
     * @return bool
     */
    public static function hasRecommended($academicianId, $userId = null, $ipAddress = null)
    {
        $query = self::where('academician_id', $academicianId);
        
        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($ipAddress) {
            $query->where('ip_address', $ipAddress);
        } else {
            return false;
        }
        
        return $query->exists();
    }
    
    /**
     * Get average ratings for an academician by category.
     *
     * @param string $academicianId
     * @return array
     */
    public static function getAverageRatings($academicianId)
    {
        $recommendations = self::where('academician_id', $academicianId)->get();
        
        $counts = [
            'communication' => 0,
            'support' => 0,
            'expertise' => 0,
            'responsiveness' => 0,
            'total' => $recommendations->count()
        ];
        
        // Count non-empty comments for each category
        foreach ($recommendations as $recommendation) {
            if (!empty(trim($recommendation->communication_comment))) {
                $counts['communication']++;
            }
            
            if (!empty(trim($recommendation->support_comment))) {
                $counts['support']++;
            }
            
            if (!empty(trim($recommendation->expertise_comment))) {
                $counts['expertise']++;
            }
            
            if (!empty(trim($recommendation->responsiveness_comment))) {
                $counts['responsiveness']++;
            }
        }
        
        // For backward compatibility, we'll keep the 'averages' structure
        // but they'll represent percentage of recommendations with comments in each category
        $averages = [];
        foreach ($counts as $key => $count) {
            if ($key !== 'total') {
                $averages[$key] = $counts['total'] > 0 ? ($count / $counts['total']) * 5 : 0;
            }
        }
        
        return [
            'averages' => $averages,
            'counts' => $counts
        ];
    }
}
