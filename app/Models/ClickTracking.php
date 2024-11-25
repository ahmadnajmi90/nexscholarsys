<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClickTracking extends Model
{
    protected $fillable = [
        'user_id', 'entity_type', 'entity_id', 'action', 'created_at',
    ];

    public $timestamps = false;

    // Dynamic relationship based on the entity_type
    public function entity()
    {
        // Dynamically resolve the related model
        switch ($this->entity_type) {
            case 'grant':
                return $this->belongsTo(PostGrant::class, 'entity_id');
            case 'project':
                return $this->belongsTo(PostProject::class, 'entity_id');
            case 'event':
                return $this->belongsTo(PostEvent::class, 'entity_id');
            default:
                return null; // Return null if the entity_type is invalid
        }
    }
}
