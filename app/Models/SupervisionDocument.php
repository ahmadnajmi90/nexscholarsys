<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupervisionDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'relationship_id',
        'folder_category',
        'name',
        'current_version_id',
    ];

    public const FOLDER_DRAFTS = 'Drafts';
    public const FOLDER_FINAL_PAPERS = 'Final Papers';
    public const FOLDER_MEETING_NOTES = 'Meeting Notes';
    public const FOLDER_LITERATURE = 'Literature';
    public const FOLDER_DATA = 'Data';
    public const FOLDER_GENERAL = 'General';

    public static function getAvailableFolders(): array
    {
        return [
            self::FOLDER_DRAFTS,
            self::FOLDER_FINAL_PAPERS,
            self::FOLDER_MEETING_NOTES,
            self::FOLDER_LITERATURE,
            self::FOLDER_DATA,
            self::FOLDER_GENERAL,
        ];
    }

    public function student()
    {
        return $this->belongsTo(Postgraduate::class, 'student_id', 'postgraduate_id');
    }

    public function relationship()
    {
        return $this->belongsTo(SupervisionRelationship::class, 'relationship_id');
    }

    public function currentVersion()
    {
        return $this->belongsTo(SupervisionDocumentVersion::class, 'current_version_id');
    }

    public function versions()
    {
        return $this->hasMany(SupervisionDocumentVersion::class, 'document_id')->orderByDesc('version_number');
    }
}

