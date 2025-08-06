<?php

namespace App\Http\Controllers\ProjectHub;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;

class TaskAttachmentController extends Controller
{
    /**
     * Store a newly created attachment in storage.
     */
    public function store(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $request->validate([
            'attachment' => 'required|file|max:10240', // 10MB max file size
        ]);
        
        $file = $request->file('attachment');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('attachments', $fileName, 'public');
        
        // Create attachment record
        $attachment = $task->attachments()->create([
            'original_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'user_id' => $request->user()->id,
        ]);
        
        return Redirect::back()->with('success', 'Attachment uploaded successfully.');
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
        
        return Redirect::back()->with('success', 'Attachment deleted successfully.');
    }
}