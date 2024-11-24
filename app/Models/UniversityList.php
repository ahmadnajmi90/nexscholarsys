<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UniversityList extends Model
{
    protected $table = 'university_list'; // Explicitly define the table name
    public function academicians()
    {
        return $this->hasMany(Academician::class, 'university', 'id');
    }

    public function postgraduates()
    {
        return $this->hasMany(Postgraduate::class, 'university', 'id');
    }

    public function faculties()
    {
        return $this->hasMany(FacultyList::class, 'university_id');
    }
}
