<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Industry extends Model
{
    use HasFactory;
    
    protected $table = 'industries';
    protected $fillable = [
        'industry_id',
        'phone_number',
        'full_name',
        'profile_picture',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'industry_id', 'unique_id');
    }
}
