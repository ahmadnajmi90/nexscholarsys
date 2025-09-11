<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ConnectionController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\PostgraduateProgramController;
use App\Http\Controllers\Api\V1\AuthController;

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

Route::post('/login', [AuthController::class, 'login'])->name('api.login');

// Legal Document Routes for Modal Display (Public Access)
Route::get('/legal/terms-content', [App\Http\Controllers\LegalController::class, 'getTermsContentForModal'])->name('api.legal.terms');
Route::get('/legal/privacy-content', [App\Http\Controllers\LegalController::class, 'getPrivacyContentForModal'])->name('api.legal.privacy');

// Group A: Stateless API for External Tools (Bearer Token Authentication)
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    
    // User route for external tools
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Data Management API Routes (Admin Only) - Stateless for external tools
    Route::middleware(['admin'])->group(function () {
        Route::delete('postgraduate-programs/{postgraduate_program}', [PostgraduateProgramController::class, 'destroy'])->name('api.postgraduate-programs.destroy');
        Route::apiResource('postgraduate-programs', PostgraduateProgramController::class)->except(['destroy']);
        // Allow POST to update for consistency with existing tabs
        Route::post('postgraduate-programs/{postgraduate_program}', [PostgraduateProgramController::class, 'update'])->name('api.postgraduate-programs.update');

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
            
        // Skills Taxonomy - Admin management
        Route::get('skills/domains', [\App\Http\Controllers\Api\V1\SkillsDomainController::class, 'index'])
            ->name('api.skills-domains.index');
        Route::post('skills/domains', [\App\Http\Controllers\Api\V1\SkillsDomainController::class, 'store'])
            ->name('api.skills-domains.store');
        Route::get('skills/domains/{skills_domain}', [\App\Http\Controllers\Api\V1\SkillsDomainController::class, 'show'])
            ->name('api.skills-domains.show');
        Route::post('skills/domains/{skills_domain}', [\App\Http\Controllers\Api\V1\SkillsDomainController::class, 'update'])
            ->name('api.skills-domains.update');
        Route::delete('skills/domains/{skills_domain}', [\App\Http\Controllers\Api\V1\SkillsDomainController::class, 'destroy'])
            ->name('api.skills-domains.destroy');
            
        Route::get('skills/subdomains', [\App\Http\Controllers\Api\V1\SkillsSubdomainController::class, 'index'])
            ->name('api.skills-subdomains.index');
        Route::post('skills/subdomains', [\App\Http\Controllers\Api\V1\SkillsSubdomainController::class, 'store'])
            ->name('api.skills-subdomains.store');
        Route::get('skills/subdomains/{skills_subdomain}', [\App\Http\Controllers\Api\V1\SkillsSubdomainController::class, 'show'])
            ->name('api.skills-subdomains.show');
        Route::post('skills/subdomains/{skills_subdomain}', [\App\Http\Controllers\Api\V1\SkillsSubdomainController::class, 'update'])
            ->name('api.skills-subdomains.update');
        Route::delete('skills/subdomains/{skills_subdomain}', [\App\Http\Controllers\Api\V1\SkillsSubdomainController::class, 'destroy'])
            ->name('api.skills-subdomains.destroy');
            
        Route::get('skills', [\App\Http\Controllers\Api\V1\SkillController::class, 'index'])
            ->name('api.skills.index');
        Route::post('skills', [\App\Http\Controllers\Api\V1\SkillController::class, 'store'])
            ->name('api.skills.store');
        Route::get('skills/{skill}', [\App\Http\Controllers\Api\V1\SkillController::class, 'show'])
            ->name('api.skills.show');
        Route::post('skills/{skill}', [\App\Http\Controllers\Api\V1\SkillController::class, 'update'])
            ->name('api.skills.update');
        Route::delete('skills/{skill}', [\App\Http\Controllers\Api\V1\SkillController::class, 'destroy'])
            ->name('api.skills.destroy');
            
        // Skills Taxonomy - Legacy endpoints for backward compatibility
        Route::get('skills/taxonomy', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getTaxonomy'])
            ->name('api.skills.taxonomy');
        Route::get('skills/search', [\App\Http\Controllers\Api\V1\SkillsController::class, 'search'])
            ->name('api.skills.search');
        Route::get('skills/domains', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getDomains'])
            ->name('api.skills.domains');
        Route::get('skills/domains/{domain}/subdomains', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getSubdomains'])
            ->name('api.skills.subdomains');
        Route::get('skills/subdomains/{subdomain}/skills', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getSkills'])
            ->name('api.skills.subdomain.skills');
        Route::post('skills/details', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getSkillDetails'])
            ->name('api.skills.details');
        Route::get('skills', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getAllSkills'])
            ->name('api.skills.all');
    });
});

// Group B: Stateful "App" API for the Inertia Frontend (Session-based Authentication)
Route::middleware(['web', 'auth:sanctum'])->prefix('v1/app')->group(function () {

    // Skills Taxonomy - Available to all authenticated users
    Route::get('skills/taxonomy', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getTaxonomy'])
        ->name('api.app.skills.taxonomy');
    Route::get('skills/search', [\App\Http\Controllers\Api\V1\SkillsController::class, 'search'])
        ->name('api.app.skills.search');
    Route::get('skills/domains', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getDomains'])
        ->name('api.app.skills.domains');
    Route::get('skills/domains/{domain}/subdomains', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getSubdomains'])
        ->name('api.app.skills.subdomains');
    Route::get('skills/subdomains/{subdomain}/skills', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getSkills'])
        ->name('api.app.skills.subdomain.skills');
    Route::post('skills/details', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getSkillDetails'])
        ->name('api.app.skills.details');
    Route::get('skills', [\App\Http\Controllers\Api\V1\SkillsController::class, 'getAllSkills'])
        ->name('api.app.skills.all');

    // Data Management API Routes (Admin Only) - Stateful for frontend
    Route::middleware(['admin'])->group(function () {
        // Universities - Read-only for frontend data fetching
        Route::get('universities', [\App\Http\Controllers\Api\V1\UniversityController::class, 'index'])
            ->name('api.app.universities.index');
        Route::get('universities/{university}', [\App\Http\Controllers\Api\V1\UniversityController::class, 'show'])
            ->name('api.app.universities.show');
            
        // Faculties - Read-only for frontend data fetching
        Route::get('faculties', [\App\Http\Controllers\Api\V1\FacultyController::class, 'index'])
            ->name('api.app.faculties.index');
        Route::get('faculties/{faculty}', [\App\Http\Controllers\Api\V1\FacultyController::class, 'show'])
            ->name('api.app.faculties.show');
            
        // Fields of Research - Read-only for frontend data fetching
        Route::get('fields-of-research', [\App\Http\Controllers\Api\V1\FieldOfResearchController::class, 'index'])
            ->name('api.app.fields-of-research.index');
        Route::get('fields-of-research/{field_of_research}', [\App\Http\Controllers\Api\V1\FieldOfResearchController::class, 'show'])
            ->name('api.app.fields-of-research.show');
            
        // Research Areas - Read-only for frontend data fetching
        Route::get('research-areas', [\App\Http\Controllers\Api\V1\ResearchAreaController::class, 'index'])
            ->name('api.app.research-areas.index');
        Route::get('research-areas/{research_area}', [\App\Http\Controllers\Api\V1\ResearchAreaController::class, 'show'])
            ->name('api.app.research-areas.show');
            
        // Niche Domains - Read-only for frontend data fetching
        Route::get('niche-domains', [\App\Http\Controllers\Api\V1\NicheDomainController::class, 'index'])
            ->name('api.app.niche-domains.index');
        Route::get('niche-domains/{niche_domain}', [\App\Http\Controllers\Api\V1\NicheDomainController::class, 'show'])
            ->name('api.app.niche-domains.show');
            
        // Skills Taxonomy - Read-only for frontend data fetching
        Route::get('skills-domains', [\App\Http\Controllers\Api\V1\SkillsDomainController::class, 'index'])
            ->name('api.app.skills-domains.index');
        Route::get('skills-domains/{skills_domain}', [\App\Http\Controllers\Api\V1\SkillsDomainController::class, 'show'])
            ->name('api.app.skills-domains.show');
            
        Route::get('skills-subdomains', [\App\Http\Controllers\Api\V1\SkillsSubdomainController::class, 'index'])
            ->name('api.app.skills-subdomains.index');
        Route::get('skills-subdomains/{skills_subdomain}', [\App\Http\Controllers\Api\V1\SkillsSubdomainController::class, 'show'])
            ->name('api.app.skills-subdomains.show');
            
        Route::get('skills', [\App\Http\Controllers\Api\V1\SkillController::class, 'index'])
            ->name('api.app.skills.index');
        Route::get('skills/{skill}', [\App\Http\Controllers\Api\V1\SkillController::class, 'show'])
            ->name('api.app.skills.show');
            
        // Skills Taxonomy - Admin management (Create/Update/Delete)
        // Note: Read-only skills endpoints are available to all users above

        // Postgraduate Programs - Read-only for frontend data fetching
        Route::get('postgraduate-programs', [PostgraduateProgramController::class, 'index'])
            ->name('api.app.postgraduate-programs.index');
        Route::get('postgraduate-programs/{postgraduate_program}', [PostgraduateProgramController::class, 'show'])
            ->name('api.app.postgraduate-programs.show');
            
        // Postgraduate Programs - Import functionality for frontend
        Route::post('postgraduate-programs/import/preview', [PostgraduateProgramController::class, 'previewImport'])->name('api.app.postgraduate-programs.import.preview');
        Route::post('postgraduate-programs/import', [PostgraduateProgramController::class, 'import'])->name('api.app.postgraduate-programs.import');
    });

    // Connection Routes - Stateful for frontend
    Route::post('/connections/{user}', [ConnectionController::class, 'store'])
        ->name('api.app.connections.store');
    Route::patch('/connections/{connection}/accept', [ConnectionController::class, 'accept'])
        ->name('api.app.connections.accept');
    Route::delete('/connections/{connection}/reject', [ConnectionController::class, 'reject'])
        ->name('api.app.connections.reject');
    Route::delete('/connections/{connection}', [ConnectionController::class, 'destroy'])
        ->name('api.app.connections.destroy');

    // Notification Routes - Stateful for frontend
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('api.app.notifications.index');
    Route::post('/notifications/mark-as-read', [NotificationController::class, 'markAsRead'])
        ->name('api.app.notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])
        ->name('api.app.notifications.mark-all-as-read');
});

// Content Management API Routes - Stateless for external tools
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::apiResource('posts', \App\Http\Controllers\Api\V1\ContentManagement\CreatePostController::class);
    Route::apiResource('events', \App\Http\Controllers\Api\V1\ContentManagement\PostEventController::class);
    Route::apiResource('grants', \App\Http\Controllers\Api\V1\ContentManagement\PostGrantController::class);
    Route::apiResource('scholarships', \App\Http\Controllers\Api\V1\ContentManagement\PostScholarshipController::class);
    Route::apiResource('projects', \App\Http\Controllers\Api\V1\ContentManagement\PostProjectController::class);
});