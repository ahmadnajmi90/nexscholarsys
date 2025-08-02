<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\WorkspaceController;
use App\Http\Controllers\Api\V1\BoardController;
use App\Http\Controllers\Api\V1\BoardListController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\TaskAttachmentController;
use App\Http\Controllers\Api\V1\ConnectionController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\ProjectMemberController;
use App\Http\Controllers\Api\V1\ProjectJoinRequestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// V1 API Routes
Route::middleware(['web', 'auth:sanctum'])->prefix('v1')->group(function () {
    
    // Data Management API Routes (Admin Only)
    Route::middleware(['admin'])->group(function () {
        Route::apiResource('universities', \App\Http\Controllers\Api\V1\UniversityController::class)
            ->names([
                'index' => 'api.universities.index',
                'store' => 'api.universities.store',
                'show' => 'api.universities.show',
                'update' => 'api.universities.update',
                'destroy' => 'api.universities.destroy',
            ]);
        Route::apiResource('faculties', \App\Http\Controllers\Api\V1\FacultyController::class)
            ->names([
                'index' => 'api.faculties.index',
                'store' => 'api.faculties.store',
                'show' => 'api.faculties.show',
                'update' => 'api.faculties.update',
                'destroy' => 'api.faculties.destroy',
            ]);
        Route::apiResource('fields-of-research', \App\Http\Controllers\Api\V1\FieldOfResearchController::class)
            ->names([
                'index' => 'api.fields-of-research.index',
                'store' => 'api.fields-of-research.store',
                'show' => 'api.fields-of-research.show',
                'update' => 'api.fields-of-research.update',
                'destroy' => 'api.fields-of-research.destroy',
            ]);
        Route::apiResource('research-areas', \App\Http\Controllers\Api\V1\ResearchAreaController::class)
            ->names([
                'index' => 'api.research-areas.index',
                'store' => 'api.research-areas.store',
                'show' => 'api.research-areas.show',
                'update' => 'api.research-areas.update',
                'destroy' => 'api.research-areas.destroy',
            ]);
        Route::apiResource('niche-domains', \App\Http\Controllers\Api\V1\NicheDomainController::class)
            ->names([
                'index' => 'api.niche-domains.index',
                'store' => 'api.niche-domains.store',
                'show' => 'api.niche-domains.show',
                'update' => 'api.niche-domains.update',
                'destroy' => 'api.niche-domains.destroy',
            ]);
    });
    // Workspace Routes
    Route::apiResource('workspaces', WorkspaceController::class);
    Route::post('workspaces/{workspace}/members', [WorkspaceController::class, 'addMember'])
        ->name('workspaces.members.add');
    Route::delete('workspaces/{workspace}/members/{member}', [WorkspaceController::class, 'removeMember'])
        ->name('workspaces.members.remove');
    Route::put('workspaces/{workspace}/members/{member}', [WorkspaceController::class, 'updateMemberRole'])
        ->name('workspaces.members.update-role');
    
    // Board routes nested under workspaces
    Route::post('workspaces/{workspace}/boards', [BoardController::class, 'storeForWorkspace'])
        ->name('workspaces.boards.store');
    
    // Board routes nested under projects
    Route::post('projects/{project}/boards', [BoardController::class, 'storeForProject'])
        ->name('projects.boards.store');
    
    Route::apiResource('boards', BoardController::class)
        ->only(['show', 'update', 'destroy']);
    
    // Board members management
    Route::post('/boards/{board}/sync-members', [BoardController::class, 'syncMembers'])
        ->name('api.boards.syncMembers');
    
    // Board List routes nested under boards
    Route::apiResource('boards.lists', BoardListController::class)
        ->only(['store'])
        ->scoped();
    
    Route::apiResource('lists', BoardListController::class)
        ->only(['update', 'destroy'])
        ->parameters(['lists' => 'boardList']);
    
    // New route for updating list order
    Route::post('/lists/update-order', [BoardListController::class, 'updateOrder'])
        ->name('api.lists.reorder');
    
    // Task routes nested under lists
    Route::apiResource('lists.tasks', TaskController::class)
        ->only(['store'])
        ->scoped()
        ->parameters(['lists' => 'list']);
    
    Route::apiResource('tasks', TaskController::class)
        ->only(['show', 'update', 'destroy']);
    
    // Custom task action routes
    Route::post('tasks/{task}/move', [TaskController::class, 'move'])
        ->name('tasks.move');
    Route::post('tasks/{task}/comments', [TaskController::class, 'addComment'])
        ->name('tasks.comments.add');
    Route::post('tasks/{task}/assignees', [TaskController::class, 'assignUsers'])
        ->name('tasks.assignees');
    Route::post('tasks/{task}/toggle-completion', [TaskController::class, 'toggleCompletion'])
        ->name('api.tasks.toggleCompletion');
        
    // Task attachment routes
    Route::post('tasks/{task}/attachments', [TaskAttachmentController::class, 'store'])
        ->name('tasks.attachments.store');
    Route::delete('attachments/{attachment}', [TaskAttachmentController::class, 'destroy'])
        ->name('attachments.destroy');
    
    // Connection Routes
    Route::post('/connections/{user}', [ConnectionController::class, 'store'])
        ->name('connections.store');
    Route::patch('/connections/{connection}/accept', [ConnectionController::class, 'accept'])
        ->name('connections.accept');
    Route::delete('/connections/{connection}/reject', [ConnectionController::class, 'reject'])
        ->name('connections.reject');
    Route::delete('/connections/{connection}', [ConnectionController::class, 'destroy'])
        ->name('connections.destroy');
    
    // Notification Routes
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');
    Route::post('/notifications/mark-as-read', [NotificationController::class, 'markAsRead'])
        ->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])
        ->name('notifications.mark-all-as-read');
        
    // Project Member Routes
    Route::post('/projects/{project}/members', [ProjectMemberController::class, 'store'])
        ->name('projects.members.store');
    Route::delete('/projects/{project}/members/{member}', [ProjectMemberController::class, 'destroy'])
        ->name('projects.members.destroy');
    Route::put('/projects/{project}/members/{member}', [ProjectMemberController::class, 'updateRole'])
        ->name('projects.members.update-role');
    
    // Project Join Request Routes
    Route::post('/projects/{project}/join-request', [ProjectJoinRequestController::class, 'store'])
        ->name('projects.join.request');
    Route::patch('/project-join-requests/{projectJoinRequest}/accept', [ProjectJoinRequestController::class, 'accept'])
        ->name('projects.join.accept');
    Route::patch('/project-join-requests/{projectJoinRequest}/reject', [ProjectJoinRequestController::class, 'reject'])
        ->name('projects.join.reject');
}); 