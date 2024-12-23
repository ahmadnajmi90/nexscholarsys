<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacultyAdmin extends Model
{
    use HasFactory;
    protected $table = 'faculty_admins';

    protected $fillable = [
        'faculty_admin_id',
        'worker_id',
        'faculty_name',
        'university',
        'faculty',
        'profile_picture',
        'background_picture',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'faculty_admin_id', 'unique_id');
    }

    public function academicians()
    {
        return $this->hasMany(Academician::class, 'faculty_id', 'faculty');
    }

    public function universityDetails()
    {
        return $this->belongsTo(UniversityList::class, 'university', 'id');
    }

    public function faculty()
    {
        return $this->belongsTo(FacultyList::class, 'faculty');
    }
}
