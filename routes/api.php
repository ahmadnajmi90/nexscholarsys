<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\WorkspaceController;
use App\Http\Controllers\Api\V1\BoardController;
use App\Http\Controllers\Api\V1\BoardListController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\TaskAttachmentController;

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
    // Workspace Routes
    Route::apiResource('workspaces', WorkspaceController::class);
    Route::post('workspaces/{workspace}/members', [WorkspaceController::class, 'addMember'])
        ->name('workspaces.members.add');
    Route::delete('workspaces/{workspace}/members/{member}', [WorkspaceController::class, 'removeMember'])
        ->name('workspaces.members.remove');
    
    // Board routes nested under workspaces
    Route::apiResource('workspaces.boards', BoardController::class)
        ->only(['store'])
        ->scoped();
    
    Route::apiResource('boards', BoardController::class)
        ->only(['show', 'update', 'destroy']);
    
    // Board List routes nested under boards
    Route::apiResource('boards.lists', BoardListController::class)
        ->only(['store'])
        ->scoped();
    
    Route::apiResource('lists', BoardListController::class)
        ->only(['update', 'destroy'])
        ->parameters(['lists' => 'boardList']);
    
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
        
    // Task attachment routes
    Route::post('tasks/{task}/attachments', [TaskAttachmentController::class, 'store'])
        ->name('tasks.attachments.store');
    Route::delete('attachments/{attachment}', [TaskAttachmentController::class, 'destroy'])
        ->name('attachments.destroy');
}); 