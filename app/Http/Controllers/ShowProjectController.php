<?php

namespace App\Http\Controllers;
use App\Models\PostProject;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;
use Carbon\Carbon;

use Illuminate\Http\Request;

class ShowProjectController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        
        $projects = PostProject::where('project_status', 'published')
            ->orderByRaw("CASE WHEN start_date >= ? THEN 0 ELSE 1 END", [$today])
            ->orderBy('start_date', 'asc')
            ->get();

        return Inertia::render('ResearchTool/Project', [
            // Pass any data you want to the component here
            'projects' => $projects,
            // 'universities' => UniversityList::all(),
            'users' => User::all(),
        ]);
    }

}
