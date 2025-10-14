<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionRequestAbstract extends Model
{
    use HasFactory;

    protected $fillable = [
        'supervision_request_id',
        'abstract',
        'extraction_status',
        'source_file',
        'extraction_error',
    ];

    protected $casts = [
        'extraction_status' => 'string',
    ];

    /**
     * Get the supervision request that owns the abstract
     */
    public function supervisionRequest()
    {
        return $this->belongsTo(SupervisionRequest::class, 'supervision_request_id');
    }
}

