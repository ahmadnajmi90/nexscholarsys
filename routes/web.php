<?php

use App\Http\Controllers\AcademicianController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\ProfileCompletionController;
use App\Http\Controllers\PostgraduateController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\PostGrantController;
use Silber\Bouncer\BouncerFacade;
use App\Http\Controllers\RoleProfileController;
use App\Http\Controllers\PostProjectController;
use App\Http\Controllers\PostEventController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/complete-profile', [ProfileCompletionController::class, 'show'])->name('profile.complete');
    Route::post('/complete-profile', [ProfileCompletionController::class, 'update']);
    Route::get('/dashboard/post-grants', [PostGrantController::class, 'index'])->name('post-grants.index');
    Route::get('/dashboard/post-grants/create', [PostGrantController::class, 'create'])->name('post-grants.create');
    Route::post('/dashboard/post-grants', [PostGrantController::class, 'store'])->name('post-grants.store');
    Route::get('/dashboard/post-grants/{id}/edit', [PostGrantController::class, 'edit'])->name('post-grants.edit');
    Route::post('/dashboard/post-grants/{id}', [PostGrantController::class, 'update'])->name('post-grants.update');
    Route::delete('/dashboard/post-grants/{id}', [PostGrantController::class, 'destroy'])->name('post-grants.destroy');

    Route::get('/dashboard', function (Request $request) {
        if (!Auth::user()->is_profile_complete) {
            return redirect()->route('profile.complete');
        }

        $postGrants = auth()->user()->postGrants;

        return Inertia::render('Dashboard', [
            'postGrants' => $postGrants,
            'isPostgraduate' => BouncerFacade::is(Auth::user())->an('postgraduate'),
        ]);

    })->name('dashboard');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/role', [RoleProfileController::class, 'edit'])->name('role.edit');
    Route::patch('/role', [RoleProfileController::class, 'update'])->name('role.update');
    Route::delete('/role', [RoleProfileController::class, 'destroy'])->name('role.destroy');
});

Route::resource('academicians', AcademicianController::class)
->only(['index'])
->middleware(['auth', 'verified']); 

Route::resource('postgraduates', PostgraduateController::class)
->only(['index'])
->middleware(['auth', 'verified']); 

Route::middleware(['auth'])->group(function () {
    Route::get('/post-projects', [PostProjectController::class, 'index'])->name('post-projects.index');
    Route::get('/post-projects/create', [PostProjectController::class, 'create'])->name('post-projects.create');
    Route::post('/post-projects', [PostProjectController::class, 'store'])->name('post-projects.store');
    Route::get('/post-projects/{id}/edit', [PostProjectController::class, 'edit'])->name('post-projects.edit');
    Route::post('/post-projects/{id}', [PostProjectController::class, 'update'])->name('post-projects.update');
    Route::delete('/post-projects/{id}', [PostProjectController::class, 'destroy'])->name('post-projects.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/post-events', [PostEventController::class, 'index'])->name('post-events.index');
    Route::get('/post-events/create', [PostEventController::class, 'create'])->name('post-events.create');
    Route::post('/post-events', [PostEventController::class, 'store'])->name('post-events.store');
    Route::get('/post-events/{id}/edit', [PostEventController::class, 'edit'])->name('post-events.edit');
    Route::post('/post-events/{id}', [PostEventController::class, 'update'])->name('post-events.update');
    Route::delete('/post-events/{id}', [PostEventController::class, 'destroy'])->name('post-events.destroy');
});


require __DIR__.'/auth.php';
