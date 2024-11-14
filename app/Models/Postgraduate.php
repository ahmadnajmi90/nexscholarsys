<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Postgraduate extends Model
{
    use HasFactory;
    protected $table = 'postgraduates';

    protected $fillable = [
        'postgraduate_id',
        'phone_number',
        'full_name',
        'profile_picture',
        'faculty',
        'university',
        'supervisorAvailability',
        'grantAvailability',
        'highest_degree',
        'field_of_study',
        'research_interests',
        'ongoing_research',
        'website',
        'linkedin',
        'google_scholar',
        'researchgate',
        'orcid',
        'bio',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'postgraduate_id', 'unique_id');
    }
}
