<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\ProfileCompletionController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\PostGrantForStudentController;

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
    Route::get('/dashboard/post-grants', [PostGrantForStudentController::class, 'index'])->name('post-grants.index');
    Route::get('/dashboard/post-grants/create', [PostGrantForStudentController::class, 'create'])->name('post-grants.create');
    Route::post('/dashboard/post-grants', [PostGrantForStudentController::class, 'store'])->name('post-grants.store');
    Route::get('/dashboard/post-grants/{id}/edit', [PostGrantForStudentController::class, 'edit'])->name('post-grants.edit');
    Route::put('/dashboard/post-grants/{id}', [PostGrantForStudentController::class, 'update'])->name('post-grants.update');
    Route::delete('/dashboard/post-grants/{id}', [PostGrantForStudentController::class, 'destroy'])->name('post-grants.destroy');

    Route::get('/dashboard', function (Request $request) {
        if (!Auth::user()->is_profile_complete) {
            return redirect()->route('profile.complete');
        }

        $postGrants = auth()->user()->postGrants;

        return Inertia::render('Dashboard', [
            'postGrants' => $postGrants,
        ]);

    })->name('dashboard');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
