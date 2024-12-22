<?php

namespace App\Http\Controllers;
use App\Models\PostProject;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;

use Illuminate\Http\Request;

class ShowProjectController extends Controller
{
    public function index()
    {
        return Inertia::render('ResearchTool/Project', [
            // Pass any data you want to the component here
            'projects' => PostProject::orderBy('start_date')->get(),
            'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
            'isUndergraduate' => BouncerFacade::is(Auth::user())->an('undergraduate'),
            // 'universities' => UniversityList::all(),
            'users' => User::all(),
        ]);
    }

}
