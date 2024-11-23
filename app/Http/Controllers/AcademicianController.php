<?php

namespace App\Http\Controllers;
use App\Models\Academician;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;

use Illuminate\Http\Request;

class AcademicianController extends Controller
{
    public function index()
    {
        return Inertia::render('Networking/Academician', [
            // Pass any data you want to the component here
            'academicians' => Academician::all(),
            'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
            'universities' => UniversityList::all(),
            'users' => User::all(),
        ]);
    }

}
