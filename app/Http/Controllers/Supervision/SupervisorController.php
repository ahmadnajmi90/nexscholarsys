<?php

namespace App\Http\Controllers\Supervision;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupervisorController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index(Request $request)
    {
        return Inertia::render('Supervision/SupervisorDashboard');
    }
}


