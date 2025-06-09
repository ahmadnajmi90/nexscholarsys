<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskAttachmentResource;
use App\Models\Task;
use App\Models\TaskAttachment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class TaskAttachmentController extends Controller
{
    /**
     * Store a newly created attachment in storage.
     */
    public function store(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $request->validate([
            'attachment' => 'required|file|max:10240', // 10MB max
        ]);
        
        $file = $request->file('attachment');
        $path = $file->store('task-attachments', 'public');
        
        $attachment = $task->attachments()->create([
            'user_id' => $request->user()->id,
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);
        
        return back()->with('success', 'Attachment uploaded successfully.');
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
        
        // Delete the record
        $attachment->delete();
        
        return back()->with('success', 'Attachment deleted successfully.');
    }
}
