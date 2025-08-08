<?php

namespace App\Http\Controllers\ProjectHub;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskAttachment;
use App\Http\Resources\TaskAttachmentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class TaskAttachmentController extends Controller
{
    /**
     * Store a newly created attachment in storage.
     */
    public function store(Request $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);
        
        $validated = $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:10240', // 10MB max per file
        ]);
        
        $newAttachments = [];
        
        foreach ($validated['files'] as $file) {
            $filePath = $file->store("tasks/{$task->id}/attachments", 'public');
            
            $attachment = $task->attachments()->create([
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $filePath, // This is correct based on your resource
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'user_id' => $request->user()->id,
            ]);
            
            $newAttachments[] = $attachment;
        }
        
        // Transform the new attachments using the resource
        $formattedAttachments = TaskAttachmentResource::collection($newAttachments);
        
        $successMessage = count($newAttachments) > 1 
            ? 'Attachments uploaded successfully.' 
            : 'Attachment uploaded successfully.';
        
        // **THE KEY CHANGE:** Always return a direct JSON response.
        return response()->json([
            'message' => $successMessage,
            'attachments' => $formattedAttachments,
        ]);
    }
    
    /**
     * Format bytes to human-readable format
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= (1 << (10 * $pow));
        
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
    
    /**
     * Remove the specified attachment from storage.
     */
    public function destroy(TaskAttachment $attachment)
    {
        $this->authorize('delete', $attachment->task);
        
        // Delete the file from storage
        if (Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }
        
        // Delete the attachment record
        $attachment->delete();
        
        // Handle Inertia requests specifically
        if (request()->header('X-Inertia')) {
            return back()->with('success', 'Attachment deleted successfully.');
        }
        
        // For regular AJAX requests
        if (request()->wantsJson() || request()->ajax()) {
            return response()->json(['message' => 'Attachment deleted successfully.']);
        }
        
        // For regular requests
        return Redirect::back()->with('success', 'Attachment deleted successfully.');
    }
}