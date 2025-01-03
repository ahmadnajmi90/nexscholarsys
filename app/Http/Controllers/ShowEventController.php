<?php

namespace App\Http\Controllers;
use App\Models\PostEvent;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;

use Illuminate\Http\Request;

class ShowEventController extends Controller
{
    public function index()
    {
        return Inertia::render('Event/Event', [
            // Pass any data you want to the component here\
            'events' => PostEvent::where('event_status', 'published')->orderBy('start_date')->get(),
            // 'universities' => UniversityList::all(),
            'users' => User::all(),
        ]);
    }

}
