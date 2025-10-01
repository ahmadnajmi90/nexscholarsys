<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionRequestAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'supervision_request_id',
        'type',
        'path',
        'original_name',
        'size',
        'mime_type',
    ];

    public function request()
    {
        return $this->belongsTo(SupervisionRequest::class, 'supervision_request_id');
    }
}

