<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ConnectionController;
use App\Http\Controllers\Api\V1\NotificationController;
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
    
    // Data Management API Routes (Admin Only)
    Route::middleware(['admin'])->group(function () {
        // Universities
        Route::get('universities', [\App\Http\Controllers\Api\V1\UniversityController::class, 'index'])
            ->name('api.universities.index');
        Route::post('universities', [\App\Http\Controllers\Api\V1\UniversityController::class, 'store'])
            ->name('api.universities.store');
        Route::get('universities/{university}', [\App\Http\Controllers\Api\V1\UniversityController::class, 'show'])
            ->name('api.universities.show');
        Route::post('universities/{university}', [\App\Http\Controllers\Api\V1\UniversityController::class, 'update'])
            ->name('api.universities.update'); // Changed from PUT to POST
        Route::delete('universities/{university}', [\App\Http\Controllers\Api\V1\UniversityController::class, 'destroy'])
            ->name('api.universities.destroy');
            
        // Faculties
        Route::get('faculties', [\App\Http\Controllers\Api\V1\FacultyController::class, 'index'])
            ->name('api.faculties.index');
        Route::post('faculties', [\App\Http\Controllers\Api\V1\FacultyController::class, 'store'])
            ->name('api.faculties.store');
        Route::get('faculties/{faculty}', [\App\Http\Controllers\Api\V1\FacultyController::class, 'show'])
            ->name('api.faculties.show');
        Route::post('faculties/{faculty}', [\App\Http\Controllers\Api\V1\FacultyController::class, 'update'])
            ->name('api.faculties.update'); // Changed from PUT to POST
        Route::delete('faculties/{faculty}', [\App\Http\Controllers\Api\V1\FacultyController::class, 'destroy'])
            ->name('api.faculties.destroy');
            
        // Fields of Research
        Route::get('fields-of-research', [\App\Http\Controllers\Api\V1\FieldOfResearchController::class, 'index'])
            ->name('api.fields-of-research.index');
        Route::post('fields-of-research', [\App\Http\Controllers\Api\V1\FieldOfResearchController::class, 'store'])
            ->name('api.fields-of-research.store');
        Route::get('fields-of-research/{field_of_research}', [\App\Http\Controllers\Api\V1\FieldOfResearchController::class, 'show'])
            ->name('api.fields-of-research.show');
        Route::post('fields-of-research/{field_of_research}', [\App\Http\Controllers\Api\V1\FieldOfResearchController::class, 'update'])
            ->name('api.fields-of-research.update'); // Changed from PUT to POST
        Route::delete('fields-of-research/{field_of_research}', [\App\Http\Controllers\Api\V1\FieldOfResearchController::class, 'destroy'])
            ->name('api.fields-of-research.destroy');
            
        // Research Areas
        Route::get('research-areas', [\App\Http\Controllers\Api\V1\ResearchAreaController::class, 'index'])
            ->name('api.research-areas.index');
        Route::post('research-areas', [\App\Http\Controllers\Api\V1\ResearchAreaController::class, 'store'])
            ->name('api.research-areas.store');
        Route::get('research-areas/{research_area}', [\App\Http\Controllers\Api\V1\ResearchAreaController::class, 'show'])
            ->name('api.research-areas.show');
        Route::post('research-areas/{research_area}', [\App\Http\Controllers\Api\V1\ResearchAreaController::class, 'update'])
            ->name('api.research-areas.update'); // Changed from PUT to POST
        Route::delete('research-areas/{research_area}', [\App\Http\Controllers\Api\V1\ResearchAreaController::class, 'destroy'])
            ->name('api.research-areas.destroy');
            
        // Niche Domains
        Route::get('niche-domains', [\App\Http\Controllers\Api\V1\NicheDomainController::class, 'index'])
            ->name('api.niche-domains.index');
        Route::post('niche-domains', [\App\Http\Controllers\Api\V1\NicheDomainController::class, 'store'])
            ->name('api.niche-domains.store');
        Route::get('niche-domains/{niche_domain}', [\App\Http\Controllers\Api\V1\NicheDomainController::class, 'show'])
            ->name('api.niche-domains.show');
        Route::post('niche-domains/{niche_domain}', [\App\Http\Controllers\Api\V1\NicheDomainController::class, 'update'])
            ->name('api.niche-domains.update'); // Changed from PUT to POST
        Route::delete('niche-domains/{niche_domain}', [\App\Http\Controllers\Api\V1\NicheDomainController::class, 'destroy'])
            ->name('api.niche-domains.destroy');
    });

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
});