<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TutorialController extends Controller
{
    /**
     * Display the tutorial page
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Tutorial/Index');
    }
}
