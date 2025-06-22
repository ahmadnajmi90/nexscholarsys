<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaperWritingTask extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'area_of_study',
        'paper_type',
        'publication_type',
        'scopus_info',
        'progress',
        'pdf_attachment_path',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'area_of_study' => 'array', // Cast area_of_study as an array
    ];

    /**
     * Get the task that this paper writing task belongs to.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
