<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Silber\Bouncer\Database\HasRolesAndAbilities;
use App\Models\Academician;
use App\Models\Industry;
use App\Models\Postgraduate;
use App\Models\PostGrantForStudent;


class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;
    use HasRolesAndAbilities;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'unique_id',
        'is_profile_complete',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function academician()
    {
        return $this->hasOne(Academician::class, 'academician_id', 'unique_id');
    }

    public function industry()
    {
        return $this->hasOne(Industry::class, 'industry_id', 'unique_id');
    }

    public function postgraduate()
    {
        return $this->hasOne(Postgraduate::class, 'postgraduate_id', 'unique_id');
    }

    public function postGrants()
    {
        return $this->hasMany(PostGrantForStudent::class, 'academician_id', 'unique_id');
    }
}
