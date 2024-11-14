<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [// Pass user data to the frontend
            'user' => Auth::user()->only('name', 'email'),// Pass user role to the frontend
            'isAdmin' => Auth::user()->isA('admin'), // Pass admin role as boolean
            'isAcademician' => Auth::user()->isA('academician'), // Pass academician role as boolean
        ]);

    }
}
