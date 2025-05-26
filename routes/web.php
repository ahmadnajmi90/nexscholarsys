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
use App\Http\Controllers\EmailController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\AcademicianRecommendationController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\UserMotivationController;
use App\Http\Controllers\AIGenerationController;
use App\Http\Controllers\AIMatchingController;

Route::middleware(['auth'])->group(function () {
    Route::get('/email/create/{receiver}', [EmailController::class, 'create'])->name('email.create');
    Route::post('/email/send', [EmailController::class, 'send'])->name('email.send');
    
    // Email routes
    Route::get('/email/compose', [EmailController::class, 'compose'])->name('email.compose');
    Route::post('/email/send', [EmailController::class, 'send'])->name('email.send');
    
    // Bookmark routes
    Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');
    Route::post('/bookmarks', [BookmarkController::class, 'store'])->name('bookmarks.store');
    Route::post('/bookmarks/toggle', [BookmarkController::class, 'toggle'])->name('bookmarks.toggle');
    Route::get('/bookmarks/check', [BookmarkController::class, 'check'])->name('bookmarks.check');
    Route::delete('/bookmarks/{id}', [BookmarkController::class, 'destroy'])->name('bookmarks.destroy');
});

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
Route::bind('academician', function ($value) {
    return Academician::where('url', $value)->firstOrFail();
});
Route::bind('postgraduate', function ($value) {
    return Postgraduate::where('url', $value)->firstOrFail();
});
Route::bind('undergraduate', function ($value) {
    return Undergraduate::where('url', $value)->firstOrFail();
});

Route::get('/admin/roles', [RolePermissionController::class, 'index'])->name('roles.index');
Route::get('/admin/roles/{role}/abilities', [RolePermissionController::class, 'edit'])->name('roles.abilities.edit');
Route::post('/admin/roles/{role}/abilities', [RolePermissionController::class, 'update'])->name('roles.abilities.update');

Route::post('/abilities', [AbilityController::class, 'store'])->name('abilities.store');
Route::delete('/abilities/{id}', [AbilityController::class, 'destroy'])->name('abilities.destroy');


Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

Route::get('welcome/posts/{post}', [WelcomeController::class, 'showPost'])->name('welcome.posts.show');
Route::get('welcome/events/{event}', [WelcomeController::class, 'showEvent'])->name('welcome.events.show');
Route::get('welcome/projects/{project}', [WelcomeController::class, 'showProject'])->name('welcome.projects.show');
Route::get('welcome/grants/{grant}', [WelcomeController::class, 'showGrant'])->name('welcome.grants.show');

Route::get('/universities', [UniversityController::class, 'index'])->name('universities.index'); // University list
Route::get('/universities/{university}/faculties', [UniversityController::class, 'faculties'])->name('universities.faculties'); // Faculty list
Route::get('/faculties/{faculty}/academicians', [UniversityController::class, 'academicians'])->name('faculties.academicians'); // Academician list
Route::get('/faculties/{faculty}/undergraduates', [UniversityController::class, 'undergraduates'])->name('faculties.undergraduates');
Route::get('/faculties/{faculty}/postgraduates', [UniversityController::class, 'postgraduates'])->name('faculties.postgraduates');

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
    Route::get('/faculty-admin/directory', [FacultyAdminController::class, 'listAllAcademicians'])->name('faculty-admin.directory');
    Route::post('/faculty-admin/verify-academician/{id}', [FacultyAdminController::class, 'verifyAcademician'])->name('faculty-admin.verify-academician');
    Route::post('/faculty-admin/verify-academicians-batch', [FacultyAdminController::class, 'verifyAcademiciansBatch'])->name('faculty-admin.verify-academicians-batch');
    Route::post('/faculty-admin/export/excel', [FacultyAdminController::class, 'exportExcel'])->name('faculty-admin.export.excel');
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
    Route::post('/role/updateCV', [RoleProfileController::class, 'updateCV'])->name('role.updateCV');
    Route::delete('/role', [RoleProfileController::class, 'destroy'])->name('role.destroy');
    Route::get('/role/publications', [RoleProfileController::class, 'showPublications'])->name('role.publications');
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

Route::middleware(['auth'])->group(function () {
    Route::resource('posts', ShowPostController::class)->only(['index']);
    Route::get('posts/{post}', [ShowPostController::class, 'show'])->name('posts.show');
    Route::post('posts/{url}/toggle-like', [ShowPostController::class, 'toggleLike'])->name('posts.toggleLike');
    Route::post('posts/{url}/share', [ShowPostController::class, 'share'])->name('posts.share');
});

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

// Profile pages with SEO URLs
Route::get('academicians/{academician}', [AcademicianController::class, 'show'])->name('academicians.show');
Route::get('academicians/{academician}/projects', [AcademicianController::class, 'showProjects'])->name('academicians.projects');
Route::get('academicians/{academician}/publications', [AcademicianController::class, 'showPublications'])->name('academicians.publications');
Route::get('academicians/{academicianId}/quick-info', [AcademicianController::class, 'getQuickInfo'])->name('academicians.quick-info');
Route::get('postgraduates/{postgraduate}', [PostgraduateController::class, 'show'])->name('postgraduates.show');
Route::get('undergraduates/{undergraduate}', [UndergraduateController::class, 'show'])->name('undergraduates.show');

// Recommendation routes
Route::get('academicians/{academicianId}/recommend', [AcademicianRecommendationController::class, 'showForm'])->name('academicians.recommend');
Route::post('academicians/recommendations', [AcademicianRecommendationController::class, 'store'])->name('academicians.recommendations.store');
Route::get('academicians/{academicianId}/recommendations', [AcademicianRecommendationController::class, 'getRecommendations'])->name('academicians.recommendations.get');

// Google Scholar endpoints for academician-initiated scraping
Route::middleware(['auth'])->group(function () {
    Route::get('/api/scholar/status', [App\Http\Controllers\GoogleScholarController::class, 'getScrapingStatus']);
    Route::post('/api/scholar/scrape', [App\Http\Controllers\GoogleScholarController::class, 'scrapeOwnProfile']);
});

// User motivation routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/why-nexscholar', [UserMotivationController::class, 'showForm'])
        ->name('why-nexscholar.show');
    Route::post('/why-nexscholar', [UserMotivationController::class, 'storeReason'])
        ->name('why-nexscholar.store');
});

// AI Profile Generation Routes for Academicians
Route::middleware(['auth'])->group(function () {
    Route::get('/ai/profile', [App\Http\Controllers\RoleProfileController::class, 'showAIProfileGeneration'])
        ->name('ai.profile.show');
    Route::post('/ai/generate/automatic', [App\Http\Controllers\RoleProfileController::class, 'triggerAutomaticGeneration'])
        ->name('ai.generate.automatic');
    Route::post('/ai/urls/save', [App\Http\Controllers\RoleProfileController::class, 'saveProfileURLs'])
        ->name('ai.urls.save');
    Route::post('/ai/generate/cv', [App\Http\Controllers\RoleProfileController::class, 'generateProfileFromCV'])
        ->name('ai.generate.cv');
    Route::get('/ai/status', [App\Http\Controllers\RoleProfileController::class, 'checkGenerationStatus'])
        ->name('ai.status');
});

// AI Matching Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/ai-matching', [\App\Http\Controllers\AIMatchingController::class, 'index'])
        ->name('ai.matching.index');
    
    Route::post('/ai-matching/search', [\App\Http\Controllers\AIMatchingController::class, 'search'])
        ->name('ai.matching.search');
    
    Route::post('/ai-matching/insights', [\App\Http\Controllers\AIMatchingController::class, 'getInsights'])
        ->name('ai.matching.insights');
    
    Route::get('/ai-matching/clear-cache', [\App\Http\Controllers\AIMatchingController::class, 'clearInsightsCache'])
        ->name('ai.matching.clear-cache');
    
    Route::get('/ai-matching/diagnostics', [\App\Http\Controllers\AIMatchingController::class, 'diagnostics'])
        ->name('ai.matching.diagnostics');
});

// CSRF Token Refresh Route
Route::get('/csrf/refresh', function () {
    return response()->json([
        'csrfToken' => csrf_token(),
    ]);
})->name('csrf.refresh');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/profiles', [App\Http\Controllers\Admin\ProfileReminderController::class, 'index'])->name('admin.profiles.index');
    Route::post('/admin/profiles/reminder', [App\Http\Controllers\Admin\ProfileReminderController::class, 'sendReminder'])->name('admin.profiles.reminder');
    Route::post('/admin/profiles/batch-reminder', [App\Http\Controllers\Admin\ProfileReminderController::class, 'sendBatchReminder'])->name('admin.profiles.batch-reminder');
});

require __DIR__.'/auth.php';
