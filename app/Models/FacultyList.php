<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FacultyList extends Model
{
    protected $table = 'faculty_list'; // Explicitly define the table name

    use HasFactory;

    protected $fillable = ['name', 'university_id'];

    public function university()
    {
        return $this->belongsTo(UniversityList::class, 'university_id');
    }

    public function academicians()
    {
        return $this->hasMany(Academician::class, 'faculty', 'id');
    }

    public function postgraduates()
    {
        return $this->hasMany(Postgraduate::class, 'faculty', 'id');
    }

    public function undergraduates()
    {
        return $this->hasMany(Undergraduate::class, 'faculty', 'id');
    }
}
