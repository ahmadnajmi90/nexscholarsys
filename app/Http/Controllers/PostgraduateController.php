<?php

namespace App\Http\Controllers;
use App\Models\Postgraduate;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;

use Illuminate\Http\Request;

class PostgraduateController extends Controller
{
    public function index()
    {
        return Inertia::render('Networking/Postgraduate', [
            // Pass any data you want to the component here
            'postgraduates' => Postgraduate::all(),
            'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
            'universities' => UniversityList::all(),
            'users' => User::all(),
        ]);
    }

}
