<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionRequestNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'supervision_request_id',
        'author_id',
        'note',
    ];

    public function request()
    {
        return $this->belongsTo(SupervisionRequest::class, 'supervision_request_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
