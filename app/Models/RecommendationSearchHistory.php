<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecommendationSearchHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'search_text',
        'profile_hash',
    ];
}

