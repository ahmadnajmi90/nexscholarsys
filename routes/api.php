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

    // Research Areas Taxonomy - Available to all authenticated users
    Route::get('fields-of-research', [\App\Http\Controllers\Api\V1\FieldOfResearchController::class, 'index'])
        ->name('api.app.fields-of-research.public.index');
    Route::get('fields-of-research/{field_of_research}', [\App\Http\Controllers\Api\V1\FieldOfResearchController::class, 'show'])
        ->name('api.app.fields-of-research.public.show');
    Route::get('research-areas', [\App\Http\Controllers\Api\V1\ResearchAreaController::class, 'index'])
        ->name('api.app.research-areas.public.index');
    Route::get('research-areas/{research_area}', [\App\Http\Controllers\Api\V1\ResearchAreaController::class, 'show'])
        ->name('api.app.research-areas.public.show');
    Route::get('niche-domains', [\App\Http\Controllers\Api\V1\NicheDomainController::class, 'index'])
        ->name('api.app.niche-domains.public.index');
    Route::get('niche-domains/{niche_domain}', [\App\Http\Controllers\Api\V1\NicheDomainController::class, 'show'])
        ->name('api.app.niche-domains.public.show');

    // Data Management API Routes (Admin Only) - Stateful for frontend
    Route::middleware(['admin'])->group(function () {
        // Universities - Admin management for frontend
        Route::get('universities', [\App\Http\Controllers\Api\V1\UniversityController::class, 'index'])
            ->name('api.app.universities.index');
        Route::get('universities/{university}', [\App\Http\Controllers\Api\V1\UniversityController::class, 'show'])
            ->name('api.app.universities.show');
            
        // Faculties - Admin management for frontend
        Route::get('faculties', [\App\Http\Controllers\Api\V1\FacultyController::class, 'index'])
            ->name('api.app.faculties.index');
        Route::get('faculties/{faculty}', [\App\Http\Controllers\Api\V1\FacultyController::class, 'show'])
            ->name('api.app.faculties.show');
            
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
    Route::get('/connections', [ConnectionController::class, 'index'])
        ->name('api.app.connections.index');
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
        
    // Messaging Routes - Stateful for frontend
    Route::prefix('messaging')->name('messaging.')->group(function () {
        // Conversations
        Route::get('/conversations', [\App\Http\Controllers\Api\V1\Messaging\ConversationController::class, 'index'])
            ->name('conversations.index');
        Route::post('/conversations', [\App\Http\Controllers\Api\V1\Messaging\ConversationController::class, 'store'])
            ->name('conversations.store');
        Route::get('/conversations/{conversation}', [\App\Http\Controllers\Api\V1\Messaging\ConversationController::class, 'show'])
            ->name('conversations.show');
        Route::post('/conversations/{conversation}/archive', [\App\Http\Controllers\Api\V1\Messaging\ConversationController::class, 'archive'])
            ->name('conversations.archive');
            
        // Messages
        Route::get('/conversations/{conversation}/messages', [\App\Http\Controllers\Api\V1\Messaging\MessageController::class, 'index'])
            ->name('messages.index');
        Route::post('/conversations/{conversation}/messages', [\App\Http\Controllers\Api\V1\Messaging\MessageController::class, 'store'])
            ->name('messages.store');
        Route::patch('/messages/{message}', [\App\Http\Controllers\Api\V1\Messaging\MessageController::class, 'update'])
            ->name('messages.update');
        Route::delete('/messages/{message}', [\App\Http\Controllers\Api\V1\Messaging\MessageController::class, 'destroy'])
            ->name('messages.destroy');
            
        // Read receipts
        Route::post('/conversations/{conversation}/read', [\App\Http\Controllers\Api\V1\Messaging\ReadController::class, 'update'])
            ->name('read.update');
            
        // Typing indicators
        Route::post('/conversations/{conversation}/typing', [\App\Http\Controllers\Api\V1\Messaging\TypingController::class, 'update'])
            ->name('typing.update');
            
        // Attachments
        Route::get('/attachments/{attachment}', [\App\Http\Controllers\Api\V1\Messaging\AttachmentController::class, 'show'])
            ->name('attachments.show');
        Route::get('/attachments/{attachment}/download', [\App\Http\Controllers\Api\V1\Messaging\AttachmentController::class, 'download'])
            ->name('attachments.download');
    });
    
    // User presence heartbeat
    Route::post('/me/heartbeat', function (Request $request) {
        $user = $request->user();
        $user->last_seen_at = now();
        $user->save();
        
        return response()->json(['success' => true]);
    })->name('me.heartbeat');

    Route::prefix('supervision')->name('supervision.')->group(function () {
        Route::get('/shortlist', [\App\Http\Controllers\Api\V1\Supervision\ShortlistController::class, 'index'])
            ->name('shortlist.index');
        Route::post('/shortlist', [\App\Http\Controllers\Api\V1\Supervision\ShortlistController::class, 'store'])
            ->name('shortlist.store');
        Route::delete('/shortlist/{academicianId}', [\App\Http\Controllers\Api\V1\Supervision\ShortlistController::class, 'destroy'])
            ->name('shortlist.destroy');

        Route::get('/requests', [\App\Http\Controllers\Api\V1\Supervision\RequestController::class, 'index'])
            ->name('requests.index');
        Route::post('/requests', [\App\Http\Controllers\Api\V1\Supervision\RequestController::class, 'store'])
            ->middleware('throttle:5,1440') // 5 requests per day (1440 minutes)
            ->name('requests.store');
        Route::post('/requests/{request}/cancel', [\App\Http\Controllers\Api\V1\Supervision\RequestController::class, 'cancel'])
            ->name('requests.cancel');

        Route::post('/requests/{supervisionRequest}/accept', [\App\Http\Controllers\Api\V1\Supervision\DecisionController::class, 'accept'])
            ->name('requests.accept');
        Route::post('/requests/{supervisionRequest}/reject', [\App\Http\Controllers\Api\V1\Supervision\DecisionController::class, 'reject'])
            ->name('requests.reject');
        Route::post('/requests/{supervisionRequest}/student-accept', [\App\Http\Controllers\Api\V1\Supervision\DecisionController::class, 'studentAccept'])
            ->name('requests.student-accept');
        Route::post('/requests/{supervisionRequest}/student-reject', [\App\Http\Controllers\Api\V1\Supervision\DecisionController::class, 'studentReject'])
            ->name('requests.student-reject');

        Route::get('/relationships', [\App\Http\Controllers\Api\V1\Supervision\RelationshipController::class, 'index'])
            ->name('relationships.index');
        Route::get('/relationships/{relationship}', [\App\Http\Controllers\Api\V1\Supervision\RelationshipController::class, 'show'])
            ->name('relationships.show');

        Route::post('/relationships/{relationship}/meetings', [\App\Http\Controllers\Api\V1\Supervision\MeetingController::class, 'store'])
            ->name('meetings.store');
        Route::post('/requests/{supervisionRequest}/meetings', [\App\Http\Controllers\Api\V1\Supervision\MeetingController::class, 'storeForRequest'])
            ->name('requests.meetings.store');
        Route::put('/meetings/{meeting}', [\App\Http\Controllers\Api\V1\Supervision\MeetingController::class, 'update'])
            ->name('meetings.update');
        Route::delete('/meetings/{meeting}', [\App\Http\Controllers\Api\V1\Supervision\MeetingController::class, 'destroy'])
            ->name('meetings.destroy');

        // Unbind Request Routes
        Route::get('/unbind-requests', [\App\Http\Controllers\Api\V1\Supervision\UnbindRequestController::class, 'index'])
            ->name('unbind-requests.index');
        Route::post('/relationships/{relationship}/unbind', [\App\Http\Controllers\Api\V1\Supervision\UnbindRequestController::class, 'initiate'])
            ->middleware('throttle:3,60') // 3 requests per hour
            ->name('relationships.unbind.initiate');
        // Student approves/rejects supervisor-initiated unbind
        Route::post('/unbind-requests/{unbindRequest}/approve', [\App\Http\Controllers\Api\V1\Supervision\UnbindRequestController::class, 'approve'])
            ->name('unbind-requests.approve');
        Route::post('/unbind-requests/{unbindRequest}/reject', [\App\Http\Controllers\Api\V1\Supervision\UnbindRequestController::class, 'reject'])
            ->name('unbind-requests.reject');
        // Supervisor approves/rejects student-initiated unbind
        Route::post('/unbind-requests/{unbindRequest}/supervisor-approve', [\App\Http\Controllers\Api\V1\Supervision\UnbindRequestController::class, 'supervisorApprove'])
            ->name('unbind-requests.supervisor-approve');
        Route::post('/unbind-requests/{unbindRequest}/supervisor-reject', [\App\Http\Controllers\Api\V1\Supervision\UnbindRequestController::class, 'supervisorReject'])
            ->name('unbind-requests.supervisor-reject');

        // Research Management Routes
        Route::get('/relationships/{relationship}/research', [\App\Http\Controllers\Api\V1\Supervision\ResearchController::class, 'show'])
            ->name('relationships.research.show');
        Route::put('/relationships/{relationship}/research', [\App\Http\Controllers\Api\V1\Supervision\ResearchController::class, 'update'])
            ->name('relationships.research.update');
        Route::post('/relationships/{relationship}/milestones', [\App\Http\Controllers\Api\V1\Supervision\ResearchController::class, 'storeMilestone'])
            ->name('relationships.milestones.store');
        Route::put('/milestones/{milestone}', [\App\Http\Controllers\Api\V1\Supervision\ResearchController::class, 'updateMilestone'])
            ->name('milestones.update');
        Route::delete('/milestones/{milestone}', [\App\Http\Controllers\Api\V1\Supervision\ResearchController::class, 'destroyMilestone'])
            ->name('milestones.destroy');

        // Document Management Routes
        Route::get('/relationships/{relationship}/documents', [\App\Http\Controllers\Api\V1\Supervision\DocumentController::class, 'index'])
            ->name('relationships.documents.index');
        Route::post('/relationships/{relationship}/documents', [\App\Http\Controllers\Api\V1\Supervision\DocumentController::class, 'upload'])
            ->middleware('throttle:20,60') // 20 uploads per hour
            ->name('relationships.documents.upload');
        Route::put('/documents/{document}', [\App\Http\Controllers\Api\V1\Supervision\DocumentController::class, 'update'])
            ->name('documents.update');
        Route::delete('/documents/{document}', [\App\Http\Controllers\Api\V1\Supervision\DocumentController::class, 'destroy'])
            ->name('documents.destroy');
        Route::post('/documents/{document}/versions/{version}/revert', [\App\Http\Controllers\Api\V1\Supervision\DocumentController::class, 'revertVersion'])
            ->name('documents.versions.revert');
        Route::get('/document-versions/{version}/preview', [\App\Http\Controllers\Api\V1\Supervision\DocumentController::class, 'preview'])
            ->name('document-versions.preview');
        Route::get('/document-versions/{version}/download', [\App\Http\Controllers\Api\V1\Supervision\DocumentController::class, 'download'])
            ->name('document-versions.download');

        // University Letter Routes
        Route::post('/relationships/{relationship}/university-letter', [\App\Http\Controllers\Api\V1\Supervision\UniversityLetterController::class, 'upload'])
            ->name('relationships.university-letter.upload');
        Route::get('/relationships/{relationship}/university-letter/download', [\App\Http\Controllers\Api\V1\Supervision\UniversityLetterController::class, 'download'])
            ->name('relationships.university-letter.download');
        Route::delete('/relationships/{relationship}/university-letter', [\App\Http\Controllers\Api\V1\Supervision\UniversityLetterController::class, 'delete'])
            ->name('relationships.university-letter.delete');

        Route::get('/requests/{request}/notes', [\App\Http\Controllers\Api\V1\Supervision\RequestNoteController::class, 'index'])
            ->name('requests.notes.index');
        Route::post('/requests/{request}/notes', [\App\Http\Controllers\Api\V1\Supervision\RequestNoteController::class, 'store'])
            ->name('requests.notes.store');
        Route::put('/requests/{request}/notes/{note}', [\App\Http\Controllers\Api\V1\Supervision\RequestNoteController::class, 'update'])
            ->name('requests.notes.update');
        Route::delete('/requests/{request}/notes/{note}', [\App\Http\Controllers\Api\V1\Supervision\RequestNoteController::class, 'destroy'])
            ->name('requests.notes.destroy');

        // Recommendation Routes
        Route::get('/recommendations/supervisor-connections', [\App\Http\Controllers\Api\V1\Supervision\RecommendationController::class, 'getSupervisorConnections'])
            ->name('recommendations.supervisor-connections');
        Route::get('/recommendations/search-academicians', [\App\Http\Controllers\Api\V1\Supervision\RecommendationController::class, 'searchAcademicians'])
            ->name('recommendations.search-academicians');
        Route::post('/recommendations/add-to-shortlist', [\App\Http\Controllers\Api\V1\Supervision\RecommendationController::class, 'addRecommendationsToShortlist'])
            ->name('recommendations.add-to-shortlist');
        Route::get('/requests/{supervisionRequest}/recommendations', [\App\Http\Controllers\Api\V1\Supervision\RecommendationController::class, 'getRecommendedSupervisors'])
            ->name('requests.recommendations');

        // Acknowledgment Routes
        Route::post('/acknowledge/rejections', [\App\Http\Controllers\Api\V1\Supervision\AcknowledgmentController::class, 'acknowledgeRejection'])
            ->name('acknowledge.rejections');
        Route::post('/acknowledge/offers', [\App\Http\Controllers\Api\V1\Supervision\AcknowledgmentController::class, 'acknowledgeOffer'])
            ->name('acknowledge.offers');
        Route::post('/acknowledge/student-responses', [\App\Http\Controllers\Api\V1\Supervision\AcknowledgmentController::class, 'acknowledgeStudentResponse'])
            ->name('acknowledge.student-responses');

        // Co-Supervisor Routes
        // Specific routes MUST come before parameterized routes
        Route::get('/cosupervisor-invitations/my-invitations', [\App\Http\Controllers\Api\V1\Supervision\CoSupervisorController::class, 'myInvitations'])
            ->name('cosupervisor.my-invitations');
        Route::post('/relationships/{relationship}/cosupervisor/invite', [\App\Http\Controllers\Api\V1\Supervision\CoSupervisorController::class, 'invite'])
            ->middleware('throttle:10,60') // 10 invitations per hour
            ->name('cosupervisor.invite');
        Route::post('/cosupervisor-invitations/{invitation}/respond', [\App\Http\Controllers\Api\V1\Supervision\CoSupervisorController::class, 'respond'])
            ->name('cosupervisor.respond');
        Route::post('/cosupervisor-invitations/{invitation}/approve', [\App\Http\Controllers\Api\V1\Supervision\CoSupervisorController::class, 'approve'])
            ->name('cosupervisor.approve');
        Route::delete('/cosupervisor-invitations/{invitation}/cancel', [\App\Http\Controllers\Api\V1\Supervision\CoSupervisorController::class, 'cancel'])
            ->name('cosupervisor.cancel');
        Route::delete('/relationships/{relationship}/cosupervisor/{cosupervisorId}', [\App\Http\Controllers\Api\V1\Supervision\CoSupervisorController::class, 'remove'])
            ->name('cosupervisor.remove');

        // Activity Feed Routes
        Route::get('/activity/recent', [\App\Http\Controllers\Api\V1\Supervision\ActivityFeedController::class, 'recentActivity'])
            ->name('activity.recent');
        Route::get('/activity/upcoming-meetings', [\App\Http\Controllers\Api\V1\Supervision\ActivityFeedController::class, 'upcomingMeetings'])
            ->name('activity.upcoming-meetings');
    });
});

// Content Management API Routes - Stateless for external tools
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::apiResource('posts', \App\Http\Controllers\Api\V1\ContentManagement\CreatePostController::class);
    Route::apiResource('events', \App\Http\Controllers\Api\V1\ContentManagement\PostEventController::class);
    Route::apiResource('grants', \App\Http\Controllers\Api\V1\ContentManagement\PostGrantController::class);
    Route::apiResource('scholarships', \App\Http\Controllers\Api\V1\ContentManagement\PostScholarshipController::class);
    Route::apiResource('projects', \App\Http\Controllers\Api\V1\ContentManagement\PostProjectController::class);
});