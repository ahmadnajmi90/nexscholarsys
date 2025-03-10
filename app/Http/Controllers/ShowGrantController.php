<?php

namespace App\Http\Controllers;
use App\Models\PostGrant;
use Inertia\Inertia;
use Silber\Bouncer\BouncerFacade;
use Illuminate\Support\Facades\Auth;
use App\Models\UniversityList;
use App\Models\User;
use Carbon\Carbon;
use App\Models\Academician;

use Illuminate\Http\Request;

class ShowGrantController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
    
        $grants = PostGrant::where('status', 'published')
            ->orderByRaw("CASE WHEN start_date >= ? THEN 0 ELSE 1 END", [$today])
            ->orderBy('start_date', 'asc')
            ->get();

        return Inertia::render('Grant/Grant', [
            // Pass any data you want to the component here
            'grants' => $grants,
            // 'universities' => UniversityList::all(),
            'users' => User::all(),
        ]);
    }

    public function show(PostGrant $grant)
    {
        // Using created_at for ordering, matching the index order (newest first)

        // For descending order, the "previous" post is the one with a created_at value greater than the current post.
        // If the current post is the latest, no such post exists.
        $previous = PostGrant::where('created_at', '>', $grant->created_at)
                            ->orderBy('created_at', 'desc')
                            ->first();

        // The "next" post is the one with a created_at value less than the current post.
        $next = PostGrant::where('created_at', '<', $grant->created_at)
                        ->orderBy('created_at', 'desc')
                        ->first();

        return Inertia::render('Grant/Show', [
            'grant'     => $grant,
            'previous' => $previous,
            'next'     => $next,
            'users'     => User::all(),
            'academicians' => Academician::all()
        ]);
    }

}
