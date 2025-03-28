<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GrantView extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'grant_id',
        'user_id',
        'ip_address',
    ];
    
    /**
     * Get the grant that this view belongs to.
     */
    public function grant()
    {
        return $this->belongsTo(PostGrant::class, 'grant_id');
    }
    
    /**
     * Get the user that created this view (if any).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
