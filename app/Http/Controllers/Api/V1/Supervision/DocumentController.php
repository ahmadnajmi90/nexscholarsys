<?php

namespace App\Http\Controllers\Api\V1\Supervision;

use App\Http\Controllers\Controller;
use App\Models\SupervisionRelationship;
use App\Models\SupervisionDocument;
use App\Models\SupervisionDocumentVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Get all documents for a relationship
     */
    public function index(Request $request, SupervisionRelationship $relationship)
    {
        $user = $request->user();

        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        $documents = $relationship->documents()
            ->with(['currentVersion.uploader', 'versions.uploader'])
            ->get()
            ->groupBy('folder_category');

        return response()->json([
            'success' => true,
            'data' => [
                'documents_by_folder' => $documents,
                'available_folders' => SupervisionDocument::getAvailableFolders(),
            ],
        ]);
    }

    /**
     * Upload a new document or new version of existing document
     */
    public function upload(Request $request, SupervisionRelationship $relationship)
    {
        $user = $request->user();

        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        $data = $request->validate([
            'file' => ['required', 'file', 'max:51200'], // Max 50MB
            'document_id' => ['nullable', 'exists:supervision_documents,id'], // If provided, new version
            'document_name' => ['required_without:document_id', 'string', 'max:255'],
            'folder_category' => ['required', 'string', 'in:' . implode(',', SupervisionDocument::getAvailableFolders())],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        return DB::transaction(function () use ($request, $relationship, $data, $user) {
            $file = $request->file('file');
            
            // Store file
            $path = $file->store('supervision/documents', 'public');

            if ($data['document_id'] ?? null) {
                // New version of existing document
                $document = SupervisionDocument::findOrFail($data['document_id']);
                
                // Verify document belongs to this relationship
                if ($document->relationship_id !== $relationship->id) {
                    abort(403, 'This document does not belong to this relationship.');
                }

                $latestVersion = $document->versions()->max('version_number') ?? 0;
                $newVersionNumber = $latestVersion + 1;
            } else {
                // New document
                $document = SupervisionDocument::create([
                    'relationship_id' => $relationship->id,
                    'folder_category' => $data['folder_category'],
                    'name' => $data['document_name'],
                    'current_version_id' => null, // Will be set after creating version
                ]);

                $newVersionNumber = 1;
            }

            // Create document version
            $version = SupervisionDocumentVersion::create([
                'document_id' => $document->id,
                'version_number' => $newVersionNumber,
                'uploaded_by' => $user->id,
                'file_path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'notes' => $data['notes'] ?? null,
            ]);

            // Update document's current version
            $document->update(['current_version_id' => $version->id]);

            return response()->json([
                'success' => true,
                'message' => $newVersionNumber === 1 
                    ? __('Document uploaded successfully.')
                    : __('New version uploaded successfully (v:version).', ['version' => $newVersionNumber]),
                'data' => $document->fresh()->load(['currentVersion.uploader', 'versions.uploader']),
            ]);
        });
    }

    /**
     * Revert to a previous version
     */
    public function revertVersion(Request $request, SupervisionDocument $document, SupervisionDocumentVersion $version)
    {
        $user = $request->user();
        $relationship = $document->relationship;

        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        // Verify version belongs to this document
        if ($version->document_id !== $document->id) {
            abort(403, 'This version does not belong to this document.');
        }

        // Update current version
        $document->update(['current_version_id' => $version->id]);

        return response()->json([
            'success' => true,
            'message' => __('Reverted to version :version.', ['version' => $version->version_number]),
            'data' => $document->fresh()->load(['currentVersion.uploader', 'versions.uploader']),
        ]);
    }

    /**
     * Delete a document (and all its versions)
     */
    public function destroy(Request $request, SupervisionDocument $document)
    {
        $user = $request->user();
        $relationship = $document->relationship;

        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        return DB::transaction(function () use ($document) {
            // Delete all file versions from storage
            foreach ($document->versions as $version) {
                if (Storage::disk('public')->exists($version->file_path)) {
                    Storage::disk('public')->delete($version->file_path);
                }
            }

            // Delete document (cascade will delete versions from DB)
            $document->delete();

            return response()->json([
                'success' => true,
                'message' => __('Document deleted successfully.'),
            ]);
        });
    }

    /**
     * Preview a specific version (inline)
     */
    public function preview(Request $request, SupervisionDocumentVersion $version)
    {
        $user = $request->user();
        $relationship = $version->document->relationship;

        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        if (!Storage::disk('public')->exists($version->file_path)) {
            abort(404, 'File not found.');
        }

        // Return file with inline disposition for preview
        return response()->file(
            Storage::disk('public')->path($version->file_path),
            [
                'Content-Type' => $version->mime_type,
                'Content-Disposition' => 'inline; filename="' . $version->original_name . '"',
            ]
        );
    }

    /**
     * Download a specific version
     */
    public function download(Request $request, SupervisionDocumentVersion $version)
    {
        $user = $request->user();
        $relationship = $version->document->relationship;

        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        if (!Storage::disk('public')->exists($version->file_path)) {
            abort(404, 'File not found.');
        }

        return response()->download(
            Storage::disk('public')->path($version->file_path),
            $version->original_name
        );
    }

    /**
     * Update document metadata (name, folder)
     */
    public function update(Request $request, SupervisionDocument $document)
    {
        $user = $request->user();
        $relationship = $document->relationship;

        if (!$this->canAccessRelationship($user, $relationship)) {
            abort(403, 'You do not have access to this supervision relationship.');
        }

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'folder_category' => ['sometimes', 'string', 'in:' . implode(',', SupervisionDocument::getAvailableFolders())],
        ]);

        $document->update($data);

        return response()->json([
            'success' => true,
            'message' => __('Document updated successfully.'),
            'data' => $document->fresh(),
        ]);
    }

    /**
     * Helper to check if user can access relationship
     */
    protected function canAccessRelationship($user, SupervisionRelationship $relationship): bool
    {
        $isSupervisor = $user->academician && $user->academician->academician_id === $relationship->academician_id;
        $isStudent = $user->postgraduate && $user->postgraduate->postgraduate_id === $relationship->student_id;
        
        return $isSupervisor || $isStudent;
    }
}

