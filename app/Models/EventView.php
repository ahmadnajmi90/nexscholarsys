<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventView extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'event_id',
        'user_id',
        'ip_address',
    ];
    
    /**
     * Get the event that this view belongs to.
     */
    public function event()
    {
        return $this->belongsTo(PostEvent::class, 'event_id');
    }
    
    /**
     * Get the user that created this view (if any).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
