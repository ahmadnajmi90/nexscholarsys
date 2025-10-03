<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionDocumentVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id',
        'version_number',
        'uploaded_by',
        'file_path',
        'original_name',
        'mime_type',
        'size',
        'notes',
    ];

    protected $casts = [
        'version_number' => 'integer',
        'size' => 'integer',
    ];

    public function document()
    {
        return $this->belongsTo(SupervisionDocument::class, 'document_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function getSizeFormattedAttribute(): string
    {
        $bytes = $this->size;
        if ($bytes < 1024) {
            return $bytes . ' B';
        } elseif ($bytes < 1048576) {
            return round($bytes / 1024, 2) . ' KB';
        } else {
            return round($bytes / 1048576, 2) . ' MB';
        }
    }
}

