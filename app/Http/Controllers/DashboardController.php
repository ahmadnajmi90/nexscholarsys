<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $postGrants = Auth::user()->postGrants; // Retrieve post grants for the current user
        dd($postGrants); // Debug to see if postGrants has data

        return Inertia::render('Dashboard', [
            'postGrants' => $postGrants,
            'user' => Auth::user()->only('name', 'email'),
            'isAdmin' => Auth::user()->isA('admin'),
            'isAcademician' => Auth::user()->isA('academician'),
        ]);

    }
}
