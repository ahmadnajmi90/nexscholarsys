<?php

namespace App\Http\Controllers;
use App\Models\PostGrant;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;

use Illuminate\Http\Request;

class ShowGrantController extends Controller
{
    public function index()
    {
        return Inertia::render('Grant/Grant', [
            // Pass any data you want to the component here
            'grants' => PostGrant::where('post_status', 'published')->where('grant_status', 'open')->orderBy('start_date')->get(),
            'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
            // 'universities' => UniversityList::all(),
            'users' => User::all(),
        ]);
    }

}
