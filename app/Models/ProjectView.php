<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectView extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'project_id',
        'user_id',
        'ip_address',
    ];
    
    /**
     * Get the project that this view belongs to.
     */
    public function project()
    {
        return $this->belongsTo(PostProject::class, 'project_id');
    }
    
    /**
     * Get the user that created this view (if any).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
