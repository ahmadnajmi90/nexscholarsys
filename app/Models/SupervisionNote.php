<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'supervision_relationship_id',
        'author_id',
        'note',
    ];

    public function relationship()
    {
        return $this->belongsTo(SupervisionRelationship::class, 'supervision_relationship_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}

