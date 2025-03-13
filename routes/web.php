<?php

use App\Http\Controllers\AcademicianController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Auth\ProfileCompletionController;
use App\Http\Controllers\PostgraduateController;
use App\Http\Controllers\UndergraduateController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\PostGrantController;
use Silber\Bouncer\BouncerFacade;
use App\Http\Controllers\RoleProfileController;
use App\Http\Controllers\PostProjectController;
use App\Http\Controllers\PostEventController;
use App\Http\Controllers\ShowProjectController;
use App\Http\Controllers\ShowEventController;
use App\Http\Controllers\ShowGrantController;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\ClickTrackingController;
use App\Http\Controllers\FacultyAdminController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\AbilityController;
use App\Http\Controllers\CreatePostController;
use App\Http\Controllers\ShowPostController;
use App\Models\CreatePost;
use App\Models\PostEvent;
use App\Models\PostProject;
use App\Models\PostGrant;
use Carbon\Carbon;
use App\Http\Controllers\Auth\GoogleController;
use App\Models\Academician;
use App\Models\Postgraduate;
use App\Models\Undergraduate;
use App\Models\FieldOfResearch;
use App\Models\UniversityList;

Route::get('auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

Route::bind('post', function ($value) {
    return CreatePost::where('url', $value)->firstOrFail();
});
Route::bind('grant', function ($value) {
    return PostGrant::where('url', $value)->firstOrFail();
});
Route::bind('event', function ($value) {
    return PostEvent::where('url', $value)->firstOrFail();
});
Route::bind('project', function ($value) {
    return PostProject::where('url', $value)->firstOrFail();
});

Route::get('/admin/roles', [RolePermissionController::class, 'index'])->name('roles.index');
Route::get('/admin/roles/{role}/abilities', [RolePermissionController::class, 'edit'])->name('roles.abilities.edit');
Route::post('/admin/roles/{role}/abilities', [RolePermissionController::class, 'update'])->name('roles.abilities.update');

Route::post('/abilities', [AbilityController::class, 'store'])->name('abilities.store');
Route::delete('/abilities/{id}', [AbilityController::class, 'destroy'])->name('abilities.destroy');


Route::get('/', function () {
    $posts = CreatePost::where('status', 'published')
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get();

    $today = Carbon::today();

    $events = PostEvent::where('event_status', 'published')
        ->where('start_date', '>=', $today)
        ->orderBy('start_date', 'asc')
        ->take(5)
        ->get();
    
    $projects = PostProject::where('project_status', 'published')
        ->where('application_deadline', '>=', $today)
        ->orderBy('application_deadline', 'asc')
        ->take(5)
        ->get();
    
    $grants = PostGrant::where('status', 'published')
        ->where('start_date', '>=', $today)
        ->orderBy('start_date', 'asc')
        ->take(5)
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'posts' => $posts,
        'events' => $events,
        'projects' => $projects,
        'grants' => $grants,
    ]);
})->name('welcome');

Route::get('/welcome/posts/{post}', function (CreatePost $post) {
    $post->increment('total_views'); // Increment view count
    $user = auth()->user();
    // Check if the authenticated user has liked the post
    $post->liked = $user ? $post->likedUsers->contains($user->id) : false;

    return Inertia::render('Post/WelcomePostShow', [
        'post' => $post,
        'academicians' => Academician::all(),
        'postgraduates' => Postgraduate::all(),
        'undergraduates' => Undergraduate::all()
    ]);
})->name('welcome.posts.show');

Route::get('/welcome/events/{event}', function (PostEvent $event) {
    $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
    $researchOptions = [];
    foreach ($fieldOfResearches as $field) {
        foreach ($field->researchAreas as $area) {
            foreach ($area->nicheDomains as $domain) {
                $researchOptions[] = [
                    'field_of_research_id' => $field->id,
                    'field_of_research_name' => $field->name,
                    'research_area_id' => $area->id,
                    'research_area_name' => $area->name,
                    'niche_domain_id' => $domain->id,
                    'niche_domain_name' => $domain->name,
                ];
            }
        }
    }

    $event->increment('total_views'); // Increment view count
    $user = auth()->user();
    // Check if the authenticated user has liked the post
    $event->liked = $user ? $event->likedUsers->contains($user->id) : false;

    return Inertia::render('Event/WelcomeEventShow', [
        'event' => $event,
        'academicians' => Academician::all(),
        'researchOptions' => $researchOptions
    ]);
})->name('welcome.events.show');

Route::get('/welcome/projects/{project}', function (PostProject $project) {
    $fieldOfResearches = FieldOfResearch::with('researchAreas.nicheDomains')->get();
    $researchOptions = [];
    foreach ($fieldOfResearches as $field) {
        foreach ($field->researchAreas as $area) {
            foreach ($area->nicheDomains as $domain) {
                $researchOptions[] = [
                    'field_of_research_id' => $field->id,
                    'field_of_research_name' => $field->name,
                    'research_area_id' => $area->id,
                    'research_area_name' => $area->name,
                    'niche_domain_id' => $domain->id,
                    'niche_domain_name' => $domain->name,
                ];
            }
        }
    }

    $project->increment('total_views'); // Increment view count
    $user = auth()->user();
    // Check if the authenticated user has liked the post
    $project->liked = $user ? $project->likedUsers->contains($user->id) : false;

    return Inertia::render('Project/WelcomeProjectShow', [
        'project' => $project,
        'academicians' => Academician::all(),
        'researchOptions' => $researchOptions,
        'universities' => UniversityList::all()
    ]);
})->name('welcome.projects.show');

Route::get('/welcome/grants/{grant}', function (PostGrant $grant) {
    $grant->increment('total_views'); // Increment view count
    $user = auth()->user();
    // Check if the authenticated user has liked the post
    $grant->liked = $user ? $grant->likedUsers->contains($user->id) : false;

    return Inertia::render('Grant/WelcomeGrantShow', [
        'grant' => $grant,
        'academicians' => Academician::all(),
    ]);
})->name('welcome.grants.show');

Route::get('/universities', [UniversityController::class, 'index'])->name('universities.index'); // University list
Route::get('/universities/{university}/faculties', [UniversityController::class, 'faculties'])->name('universities.faculties'); // Faculty list
Route::get('/faculties/{faculty}/academicians', [UniversityController::class, 'academicians'])->name('faculties.academicians'); // Academician list
Route::get('/faculties/{faculty}/undergraduates', [UniversityController::class, 'undergraduates'])->name('faculties.undergraduates');
Route::get('/faculties/{faculty}/postgraduates', [UniversityController::class, 'postgraduates'])->name('faculties.postgraduates');

Route::post('/click-tracking', [ClickTrackingController::class, 'store'])->name('click-tracking.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/complete-profile', [ProfileCompletionController::class, 'show'])->name('profile.complete');
    Route::post('/complete-profile', [ProfileCompletionController::class, 'update']);
    Route::get('/dashboard/post-grants', [PostGrantController::class, 'index'])->name('post-grants.index');
    Route::get('/dashboard/post-grants/create', [PostGrantController::class, 'create'])->name('post-grants.create');
    Route::post('/dashboard/post-grants', [PostGrantController::class, 'store'])->name('post-grants.store');
    Route::get('/dashboard/post-grants/{id}/edit', [PostGrantController::class, 'edit'])->name('post-grants.edit');
    Route::post('/dashboard/post-grants/{id}', [PostGrantController::class, 'update'])->name('post-grants.update');
    Route::delete('/dashboard/post-grants/{id}', [PostGrantController::class, 'destroy'])->name('post-grants.destroy');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/faculty-admins', [FacultyAdminController::class, 'index'])->name('faculty-admins.index');
    Route::post('/admin/faculty-admins', [FacultyAdminController::class, 'store'])->name('faculty-admins.store');
});
Route::get('/confirm-faculty-admin/{id}', [FacultyAdminController::class, 'confirm'])->name('faculty-admins.confirm');

// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/faculty-admin/academicians', [FacultyAdminController::class, 'listAcademicians'])->name('faculty-admin.academicians');
    Route::post('/faculty-admin/verify-academician/{id}', [FacultyAdminController::class, 'verifyAcademician'])->name('faculty-admin.verify-academician');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/role', [RoleProfileController::class, 'edit'])->name('role.edit');
    Route::post('/role', [RoleProfileController::class, 'update'])->name('role.update');
    Route::post('/role/updateProfilePicture', [RoleProfileController::class, 'updateProfilePicture'])->name('role.updateProfilePicture');
    Route::post('/role/updateBackgroundImage', [RoleProfileController::class, 'updateBackgroundImage'])->name('role.updateBackgroundImage');
    Route::delete('/role', [RoleProfileController::class, 'destroy'])->name('role.destroy');
});

Route::post('/academician/generate-profile', [RoleProfileController::class, 'generateProfile'])
    ->name('academician.generateProfile');

Route::match(['get', 'post'], '/role/cv/generate', [RoleProfileController::class, 'generateCV'])
    ->name('role.generateCV')
    ->middleware('auth');


Route::resource('academicians', AcademicianController::class)
->only(['index'])
->middleware(['auth', 'verified']);

Route::resource('postgraduates', PostgraduateController::class)
->only(['index'])
->middleware(['auth', 'verified']);

Route::resource('undergraduates', UndergraduateController::class)
->only(['index'])
->middleware(['auth', 'verified']);

Route::resource('projects', ShowProjectController::class)
->only(['index'])
->middleware(['auth', 'verified']);

Route::get('projects/{project}', [ShowProjectController::class, 'show'])->name('projects.show');
Route::post('projects/{url}/toggle-like', [ShowProjectController::class, 'toggleLike'])->name('projects.toggleLike');
Route::post('projects/{url}/share', [ShowProjectController::class, 'share'])->name('projects.share');

Route::resource('events', ShowEventController::class)
->only(['index'])
->middleware(['auth', 'verified']);

Route::get('events/{event}', [ShowEventController::class, 'show'])->name('events.show');
Route::post('events/{url}/toggle-like', [ShowEventController::class, 'toggleLike'])->name('events.toggleLike');
Route::post('events/{url}/share', [ShowEventController::class, 'share'])->name('events.share');

Route::resource('posts', ShowPostController::class)
    ->only(['index'])
    ->middleware(['auth', 'verified']);

Route::get('posts/{post}', [ShowPostController::class, 'show'])->name('posts.show');
Route::post('posts/{url}/toggle-like', [ShowPostController::class, 'toggleLike'])->name('posts.toggleLike');
Route::post('posts/{url}/share', [ShowPostController::class, 'share'])->name('posts.share');

Route::resource('grants', ShowGrantController::class)
->only(['index'])
->middleware(['auth', 'verified']);

Route::get('grants/{grant}', [ShowGrantController::class, 'show'])->name('grants.show');
Route::post('grants/{url}/toggle-like', [ShowGrantController::class, 'toggleLike'])->name('grants.toggleLike');
Route::post('grants/{url}/share', [ShowGrantController::class, 'share'])->name('grants.share');

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

Route::middleware(['auth'])->group(function () {
    Route::get('/create-posts', [CreatePostController::class, 'index'])->name('create-posts.index');
    Route::get('/create-posts/create', [CreatePostController::class, 'create'])->name('create-posts.create');
    Route::post('/create-posts', [CreatePostController::class, 'store'])->name('create-posts.store');
    Route::get('/create-posts/{id}/edit', [CreatePostController::class, 'edit'])->name('create-posts.edit');
    Route::post('/create-posts/{id}', [CreatePostController::class, 'update'])->name('create-posts.update');
    Route::delete('/create-posts/{id}', [CreatePostController::class, 'destroy'])->name('create-posts.destroy');
});


require __DIR__.'/auth.php';
