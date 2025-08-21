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
use App\Http\Controllers\ContentManagement\PostGrantController;
use Silber\Bouncer\BouncerFacade;
use App\Http\Controllers\RoleProfileController;
use App\Http\Controllers\ContentManagement\PostProjectController;
use App\Http\Controllers\ContentManagement\PostEventController;
use App\Http\Controllers\ShowProjectController;
use App\Http\Controllers\ShowEventController;
use App\Http\Controllers\ShowGrantController;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\FacultyAdminController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\AbilityController;
use App\Http\Controllers\ContentManagement\CreatePostController;
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
use App\Http\Controllers\ProjectHubController;
use App\Http\Controllers\ProjectHub\WorkspaceController;
use App\Http\Controllers\ProjectHub\BoardController;
use App\Http\Controllers\PostgraduateRecommendationController;
use App\Http\Controllers\ProjectHub\BoardListController;
use App\Http\Controllers\ProjectHub\TaskController;
use App\Http\Controllers\ProjectHub\TaskAttachmentController;
use App\Http\Controllers\ProjectHub\ProjectMemberController;
use App\Http\Controllers\ProjectHub\ProjectJoinRequestController;

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
Route::bind('academician', function ($value) {
    return Academician::where('url', $value)->firstOrFail();
});
Route::bind('postgraduate', function ($value) {
    return Postgraduate::where('url', $value)->firstOrFail();
});
Route::bind('undergraduate', function ($value) {
    return Undergraduate::where('url', $value)->firstOrFail();
});

// Add route binding for ScholarLab Project
Route::bind('scholar_project', function ($value) {
    return \App\Models\Project::findOrFail($value);
});

Route::get('/admin/roles', [RolePermissionController::class, 'index'])->name('roles.index');
Route::get('/admin/roles/{role}/abilities', [RolePermissionController::class, 'edit'])->name('roles.abilities.edit');
Route::post('/admin/roles/{role}/abilities', [RolePermissionController::class, 'update'])->name('roles.abilities.update');

Route::post('/abilities', [AbilityController::class, 'store'])->name('abilities.store');
Route::delete('/abilities/{id}', [AbilityController::class, 'destroy'])->name('abilities.destroy');

// Debug route for viewing all available routes
Route::get('/debug/routes', function() {
    return Inertia::render('Debug/RouteList');
})->name('debug.routes');


Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

Route::get('welcome/posts/{post}', [WelcomeController::class, 'showPost'])->name('welcome.posts.show');
Route::get('welcome/events/{event}', [WelcomeController::class, 'showEvent'])->name('welcome.events.show');
Route::get('welcome/projects/{project:url}', [WelcomeController::class, 'showProject'])->name('welcome.projects.show');
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

// Connection Management Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/connections', [App\Http\Controllers\ConnectionController::class, 'index'])->name('connections.index');
    
    // Connection Tag Routes
    Route::get('/connection-tags', [App\Http\Controllers\ConnectionTagController::class, 'index'])
        ->name('connection-tags.index');
    Route::post('/connection-tags', [App\Http\Controllers\ConnectionTagController::class, 'store'])
        ->name('connection-tags.store');
    Route::get('/connections/{connection}/tags', [App\Http\Controllers\ConnectionTagController::class, 'getTags'])
        ->name('connections.tags.get');
    Route::post('/connections/tags', [App\Http\Controllers\ConnectionTagController::class, 'assignTags'])
        ->name('connections.tags.assign');
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

Route::get('projects/{project:url}', [ShowProjectController::class, 'show'])->name('projects.show');
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
    // Clear any old session data that might be causing issues
    session()->regenerate(true);
    
    // Generate and return a fresh CSRF token
    $token = csrf_token();
    
    return response()->json([
        'csrfToken' => $token,
        'timestamp' => now()->timestamp
    ]);
})->name('csrf.refresh')->middleware('web');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/profiles', [App\Http\Controllers\Admin\ProfileReminderController::class, 'index'])->name('admin.profiles.index');
Route::post('/admin/profiles/reminder', [App\Http\Controllers\Admin\ProfileReminderController::class, 'sendReminder'])->name('admin.profiles.reminder');
Route::post('/admin/profiles/batch-reminder', [App\Http\Controllers\Admin\ProfileReminderController::class, 'sendBatchReminder'])->name('admin.profiles.batch-reminder');

// Data Management Routes
Route::get('/admin/data-management', function() {
    return Inertia::render('Admin/DataManagement/Index');
})->name('admin.data-management.index');

// Admin Data Management CRUD Routes
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    // Universities
    Route::post('/admin/data-management/universities', [App\Http\Controllers\Admin\DataManagement\UniversityController::class, 'store'])->name('admin.data-management.universities.store');
    Route::post('/admin/data-management/universities/{university}', [App\Http\Controllers\Admin\DataManagement\UniversityController::class, 'update'])->name('admin.data-management.universities.update');
    Route::delete('/admin/data-management/universities/{university}', [App\Http\Controllers\Admin\DataManagement\UniversityController::class, 'destroy'])->name('admin.data-management.universities.destroy');
    
    // Faculties
    Route::post('/admin/data-management/faculties', [App\Http\Controllers\Admin\DataManagement\FacultyController::class, 'store'])->name('admin.data-management.faculties.store');
    Route::post('/admin/data-management/faculties/{faculty}', [App\Http\Controllers\Admin\DataManagement\FacultyController::class, 'update'])->name('admin.data-management.faculties.update');
    Route::delete('/admin/data-management/faculties/{faculty}', [App\Http\Controllers\Admin\DataManagement\FacultyController::class, 'destroy'])->name('admin.data-management.faculties.destroy');
    
    // Fields of Research
    Route::post('/admin/data-management/fields-of-research', [App\Http\Controllers\Admin\DataManagement\FieldOfResearchController::class, 'store'])->name('admin.data-management.fields-of-research.store');
    Route::post('/admin/data-management/fields-of-research/{fieldOfResearch}', [App\Http\Controllers\Admin\DataManagement\FieldOfResearchController::class, 'update'])->name('admin.data-management.fields-of-research.update');
    Route::delete('/admin/data-management/fields-of-research/{fieldOfResearch}', [App\Http\Controllers\Admin\DataManagement\FieldOfResearchController::class, 'destroy'])->name('admin.data-management.fields-of-research.destroy');
    
    // Research Areas
    Route::post('/admin/data-management/research-areas', [App\Http\Controllers\Admin\DataManagement\ResearchAreaController::class, 'store'])->name('admin.data-management.research-areas.store');
    Route::post('/admin/data-management/research-areas/{researchArea}', [App\Http\Controllers\Admin\DataManagement\ResearchAreaController::class, 'update'])->name('admin.data-management.research-areas.update');
    Route::delete('/admin/data-management/research-areas/{researchArea}', [App\Http\Controllers\Admin\DataManagement\ResearchAreaController::class, 'destroy'])->name('admin.data-management.research-areas.destroy');
    
    // Niche Domains
    Route::post('/admin/data-management/niche-domains', [App\Http\Controllers\Admin\DataManagement\NicheDomainController::class, 'store'])->name('admin.data-management.niche-domains.store');
    Route::post('/admin/data-management/niche-domains/{nicheDomain}', [App\Http\Controllers\Admin\DataManagement\NicheDomainController::class, 'update'])->name('admin.data-management.niche-domains.update');
    Route::delete('/admin/data-management/niche-domains/{nicheDomain}', [App\Http\Controllers\Admin\DataManagement\NicheDomainController::class, 'destroy'])->name('admin.data-management.niche-domains.destroy');
    
    // Postgraduate Programs
    Route::post('/admin/data-management/postgraduate-programs', [App\Http\Controllers\Admin\DataManagement\PostgraduateProgramController::class, 'store'])->name('admin.data-management.postgraduate-programs.store');
    Route::post('/admin/data-management/postgraduate-programs/{postgraduateProgram}', [App\Http\Controllers\Admin\DataManagement\PostgraduateProgramController::class, 'update'])->name('admin.data-management.postgraduate-programs.update');
    Route::delete('/admin/data-management/postgraduate-programs/{postgraduateProgram}', [App\Http\Controllers\Admin\DataManagement\PostgraduateProgramController::class, 'destroy'])->name('admin.data-management.postgraduate-programs.destroy');
});
});

// Postgraduate Program Recommendations
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/postgraduate-recommendations', [PostgraduateRecommendationController::class, 'index'])->name('postgraduate-recommendations.index');
    Route::post('/postgraduate-recommendations/analyze', [PostgraduateRecommendationController::class, 'analyze'])->name('postgraduate-recommendations.analyze');
    Route::get('/postgraduate-recommendations/status/{jobId}', [PostgraduateRecommendationController::class, 'status'])->name('postgraduate-recommendations.status');
    Route::get('/postgraduate-recommendations/results', [PostgraduateRecommendationController::class, 'results'])->name('postgraduate-recommendations.results');
    Route::get('/postgraduate-recommendations/programs/{program}/supervisors', [PostgraduateRecommendationController::class, 'showSupervisors'])
        ->name('postgraduate-recommendations.supervisors');
});

// Project Hub Routes
Route::middleware(['auth'])->prefix('project-hub')->name('project-hub.')->group(function () {
    // Main Project Hub routes
    Route::get('/', [ProjectHubController::class, 'index'])->name('index');
    
    // Workspace routes
    Route::get('/workspaces', [WorkspaceController::class, 'index'])->name('workspaces.index');
    Route::post('/workspaces', [WorkspaceController::class, 'store'])->name('workspaces.store');
    Route::get('/workspaces/{workspace}', [WorkspaceController::class, 'show'])->name('workspaces.show');
    Route::put('/workspaces/{workspace}', [WorkspaceController::class, 'update'])->name('workspaces.update');
    Route::delete('/workspaces/{workspace}', [WorkspaceController::class, 'destroy'])->name('workspaces.destroy');
    Route::post('/workspaces/{workspace}/members', [WorkspaceController::class, 'addMember'])->name('workspaces.members.add');
    Route::delete('/workspaces/{workspace}/members/{member}', [WorkspaceController::class, 'removeMember'])->name('workspaces.members.remove');
    Route::put('/workspaces/{workspace}/members/{member}', [WorkspaceController::class, 'updateMemberRole'])->name('workspaces.members.update-role');
    
    // Project routes
    Route::post('/projects', [ProjectHubController::class, 'storeProject'])->name('projects.store');
    Route::get('/projects/{scholar_project}', [ProjectHubController::class, 'showProject'])->name('projects.show');
    Route::delete('/projects/{scholar_project}', [ProjectHubController::class, 'destroyProject'])->name('projects.destroy');
    
    // Board routes
    Route::post('/workspaces/{workspace}/boards', [BoardController::class, 'storeForWorkspace'])->name('workspaces.boards.store');
    Route::post('/projects/{project}/boards', [BoardController::class, 'storeForProject'])->name('projects.boards.store');
    Route::get('/boards/{board}', [BoardController::class, 'show'])->name('boards.show');
    Route::get('/boards/{board}/archived-tasks', [BoardController::class, 'showArchived'])->name('boards.archived');
    Route::put('/boards/{board}', [BoardController::class, 'update'])->name('boards.update');
    Route::delete('/boards/{board}', [BoardController::class, 'destroy'])->name('boards.destroy');
    Route::post('/boards/{board}/sync-members', [BoardController::class, 'syncMembers'])->name('boards.sync-members');
    
    // Board List routes
    Route::post('/boards/{board}/lists', [BoardListController::class, 'store'])->name('boards.lists.store');
    Route::put('/lists/{boardList}', [BoardListController::class, 'update'])->name('lists.update');
    Route::delete('/lists/{boardList}', [BoardListController::class, 'destroy'])->name('lists.destroy');
    Route::post('/lists/update-order', [BoardListController::class, 'updateOrder'])->name('lists.reorder');
    
    // Task routes
    Route::post('/lists/{list}/tasks', [TaskController::class, 'store'])->name('lists.tasks.store');
    Route::get('/tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    Route::post('/tasks/{task}/move', [TaskController::class, 'move'])->name('tasks.move');
    Route::post('/tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
    Route::post('/tasks/{task}/archive', [TaskController::class, 'toggleArchive'])->name('tasks.archive');
    Route::post('/tasks/{task}/comments', [TaskController::class, 'addComment'])->name('tasks.comments.add');
    Route::post('/tasks/{task}/assignees', [TaskController::class, 'assignUsers'])->name('tasks.assignees');
    Route::post('/tasks/{task}/toggle-completion', [TaskController::class, 'toggleCompletion'])->name('tasks.toggle-completion');
    
    // Task Attachment routes
    Route::post('/tasks/{task}/attachments', [TaskAttachmentController::class, 'store'])->name('tasks.attachments.store');
    Route::delete('/attachments/{attachment}', [TaskAttachmentController::class, 'destroy'])->name('attachments.destroy');
    
    // Project Member routes
    Route::post('/projects/{project}/members', [ProjectMemberController::class, 'store'])->name('projects.members.store');
    Route::delete('/projects/{project}/members/{member}', [ProjectMemberController::class, 'destroy'])->name('projects.members.destroy');
    Route::put('/projects/{project}/members/{member}', [ProjectMemberController::class, 'updateRole'])->name('projects.members.update-role');
    
    // Project Join Request routes
    Route::post('/projects/{project}/join-request', [ProjectJoinRequestController::class, 'store'])->name('projects.join.request');
    Route::patch('/project-join-requests/{projectJoinRequest}/accept', [ProjectJoinRequestController::class, 'accept'])->name('projects.join.accept');
    Route::patch('/project-join-requests/{projectJoinRequest}/reject', [ProjectJoinRequestController::class, 'reject'])->name('projects.join.reject');
});

require __DIR__.'/auth.php';