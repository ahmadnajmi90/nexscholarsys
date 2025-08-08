<?php

namespace App\Http\Controllers\ProjectHub;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TaskCommentResource;
use App\Models\BoardList;
use App\Models\Task;
use App\Models\PaperWritingTask;
use App\Models\TaskComment;
use App\Events\TaskMoved;
use App\Notifications\TaskAssignedNotification;
use App\Notifications\TaskDueDateChangedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Store a newly created task in storage.
     */
    public function store(Request $request, BoardList $list)
    {
        $this->authorize('create', [Task::class, $list]);
        
        // Validate common fields and task type
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'sometimes|string|in:Low,Medium,High,Urgent',
            'task_type' => ['required', 'string', Rule::in(['normal', 'paper'])],
            'attachment' => 'nullable|file|max:10240', // 10MB max file size - single file legacy support
            'files' => 'nullable|array', // Support for multiple files
            'files.*' => 'file|max:10240', // 10MB max file size per file
            'assignees' => 'sometimes|array',
            'assignees.*' => 'exists:users,id',
        ]);
        
        // Wrap everything in a transaction to ensure data integrity
        $task = DB::transaction(function () use ($request, $list, $validated) {
            // Calculate the next order value
            $order = $list->tasks()->max('order') + 1;
            
            // Create the task
            $task = $list->tasks()->create([
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'due_date' => $validated['due_date'] ?? null,
                'priority' => $validated['priority'] ?? 'Medium',
                'creator_id' => $request->user()->id,
                'order' => $order,
            ]);
            
            // If this is a paper writing task, create the associated record
            if ($validated['task_type'] === 'paper') {
                // Validate paper-specific fields
                $paperValidated = $request->validate([
                    'area_of_study' => 'nullable|array',
                    'area_of_study.*' => 'string',
                    'paper_type' => 'nullable|string|max:255',
                    'publication_type' => 'nullable|string|max:255',
                    'scopus_info' => 'nullable|string|max:255',
                    'progress' => 'nullable|string|max:255',
                    'pdf_attachment_path' => 'nullable|string|max:255',
                ]);
                
                // Create the paper writing task record
                $task->paperWritingTask()->create([
                    'area_of_study' => $paperValidated['area_of_study'] ?? null,
                    'paper_type' => $paperValidated['paper_type'] ?? null,
                    'publication_type' => $paperValidated['publication_type'] ?? null,
                    'scopus_info' => $paperValidated['scopus_info'] ?? null,
                    'progress' => $paperValidated['progress'] ?? null,
                    'pdf_attachment_path' => $paperValidated['pdf_attachment_path'] ?? null,
                ]);
            }
            
            // Handle single file attachment (legacy support)
            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('attachments', $fileName, 'public');
                
                // Create attachment record
                $task->attachments()->create([
                    'original_name' => $file->getClientOriginalName(),
                    'file_path' => $filePath,
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'user_id' => $request->user()->id,
                ]);
            }
            
            // Handle multiple file attachments (new approach)
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $filePath = $file->storeAs('attachments', $fileName, 'public');
                    
                    // Create attachment record
                    $task->attachments()->create([
                        'original_name' => $file->getClientOriginalName(),
                        'file_path' => $filePath,
                        'size' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                        'user_id' => $request->user()->id,
                    ]);
                }
            }
            
            return $task;
        });

        // Handle assignees if provided
        if ($request->has('assignees')) {
            // Sync assignees
            $task->assignees()->sync($request->input('assignees'));
            
            // Load board relationship for notification URL
            $task->load('list.board');
            
            // Notify all assignees since this is a new task
            foreach ($task->assignees as $assignee) {
                $assignee->notify(new TaskAssignedNotification($task, $request->user()));
            }
        }
        
        return Redirect::back()->with('success', 'Task created successfully.');
    }
    
    /**
     * Display the specified task.
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);
        
        // Eager load relationships including paperWritingTask if it exists
        $task->load(['assignees.academician', 'assignees.postgraduate', 'assignees.undergraduate', 'comments.user', 'creator', 'attachments.user', 'paperWritingTask']);
        
        return Inertia::render('ProjectHub/Tasks/Show', [
            'task' => new TaskResource($task)
        ]);
    }
    
    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        // Validate common task fields
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'sometimes|string|in:Low,Medium,High,Urgent',
            'assignees' => 'sometimes|array',
            'assignees.*' => 'exists:users,id',
            'attachment' => 'nullable|file|max:10240', // 10MB max file size
        ]);
        
        // Check if due date is being changed
        $oldDueDate = $task->due_date ? $task->due_date->format('Y-m-d') : null;
        $newDueDate = $validated['due_date'] ?? null;
        $dueDateChanged = $oldDueDate !== $newDueDate && ($oldDueDate !== null || $newDueDate !== null);
        
        // Update the base task
        $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'priority' => $validated['priority'] ?? $task->priority,
        ]);
        
        // Handle assignees if provided
        if ($request->has('assignees')) {
            // Get current assignees before syncing
            $currentAssignees = $task->assignees->pluck('id')->toArray();
            $newAssignees = collect($request->input('assignees'));
            
            // Sync assignees
            $task->assignees()->sync($request->input('assignees'));
            
            // Find newly added assignees
            $addedAssignees = $newAssignees->diff($currentAssignees);
            
            // Notify newly added assignees
            if ($addedAssignees->count() > 0) {
                $task->load('list.board'); // Make sure board is loaded for the URL
                foreach ($task->assignees()->whereIn('users.id', $addedAssignees)->get() as $assignee) {
                    $assignee->notify(new TaskAssignedNotification($task, $request->user()));
                }
            }
        }
        
        // Notify about due date change if it changed and there are assignees
        if ($dueDateChanged && $task->assignees()->count() > 0) {
            $task->load('list.board'); // Make sure board is loaded for the URL
            foreach ($task->assignees as $assignee) {
                $assignee->notify(new TaskDueDateChangedNotification($task, $oldDueDate));
            }
        }
        
        // If this is a paper writing task, update the associated record
        if ($task->paperWritingTask) {
            // Validate paper-specific fields
            $paperValidated = $request->validate([
                'area_of_study' => 'nullable|array',
                'area_of_study.*' => 'string',
                'paper_type' => 'nullable|string|max:255',
                'publication_type' => 'nullable|string|max:255',
                'scopus_info' => 'nullable|string|max:255',
                'progress' => 'nullable|string|max:255',
                'pdf_attachment_path' => 'nullable|string|max:255',
            ]);
            
            // Update the paper writing task record
            $task->paperWritingTask->update([
                'area_of_study' => $paperValidated['area_of_study'] ?? $task->paperWritingTask->area_of_study,
                'paper_type' => $paperValidated['paper_type'] ?? $task->paperWritingTask->paper_type,
                'publication_type' => $paperValidated['publication_type'] ?? $task->paperWritingTask->publication_type,
                'scopus_info' => $paperValidated['scopus_info'] ?? $task->paperWritingTask->scopus_info,
                'progress' => $paperValidated['progress'] ?? $task->paperWritingTask->progress,
                'pdf_attachment_path' => $paperValidated['pdf_attachment_path'] ?? $task->paperWritingTask->pdf_attachment_path,
            ]);
        }
        
        // Handle file attachment if provided
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('attachments', $fileName, 'public');
            
            // Create attachment record
            $task->attachments()->create([
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'user_id' => $request->user()->id,
            ]);
        }
        
        // Load relationships for the response including paperWritingTask if it exists
        $task->load(['assignees.academician', 'assignees.postgraduate', 'assignees.undergraduate', 'comments.user', 'creator', 'attachments.user', 'paperWritingTask']);
        
        return Redirect::back()->with('success', 'Task updated successfully.');
    }
    
    /**
     * Remove the specified task.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        
        $task->delete();
        
        return Redirect::back()->with('success', 'Task deleted successfully.');
    }
    
    /**
     * Move a task to a new list and/or position.
     */
    public function move(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $validated = $request->validate([
            'new_list_id' => 'required|integer|exists:board_lists,id',
            'order_in_new_list' => 'required|array',
            'order_in_new_list.*' => 'integer|exists:tasks,id',
        ]);
        
        $newList = BoardList::findOrFail($validated['new_list_id']);
        $this->authorize('update', $newList);
        
        DB::transaction(function () use ($task, $validated) {
            // Move task to new list
            $task->board_list_id = $validated['new_list_id'];
            $task->save();
            
            // Reorder tasks in destination list
            foreach ($validated['order_in_new_list'] as $index => $taskId) {
                Task::where('id', $taskId)
                    ->where('board_list_id', $validated['new_list_id'])
                    ->update(['order' => $index]);
            }
        });
        
        // Reload the task with its list and board for broadcasting
        $task->refresh()->load('list.board');
        
        // Broadcast the task moved event to others
        broadcast(new TaskMoved($task, $request->user()))->toOthers();
        
        return Redirect::back()->with('success', 'Task moved.');
    }

    /**
     * Update the order of tasks within a specific list.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'list_id' => 'required|integer|exists:board_lists,id',
            'task_ids' => 'required|array',
            'task_ids.*' => 'required|integer|exists:tasks,id',
        ]);

        $list = BoardList::findOrFail($validated['list_id']);
        $this->authorize('update', $list);

        DB::transaction(function () use ($validated) {
            foreach ($validated['task_ids'] as $index => $taskId) {
                Task::where('id', $taskId)
                    ->where('board_list_id', $validated['list_id'])
                    ->update(['order' => $index]);
            }
        });

        return Redirect::back()->with('success', 'Task order updated.');
    }
    
    /**
     * Add a comment to a task.
     */
    public function addComment(Request $request, Task $task)
    {
        $this->authorize('addComment', $task);
        
        $validated = $request->validate([
            'content' => 'required|string',
        ]);
        
        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);
        
        // Load the user relationship for the resource
        $comment->load('user');
        
        return Redirect::back()->with('success', 'Comment added successfully.');
    }
    
    /**
     * Assign users to a task.
     */
    public function assignUsers(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);
        
        // Get current assignees before syncing
        $currentAssignees = $task->assignees->pluck('id')->toArray();
        $newAssigneeIds = collect($validated['user_ids']);
        
        // Sync the assignees
        $task->assignees()->sync($validated['user_ids']);
        
        // Find newly added assignees
        $addedAssigneeIds = $newAssigneeIds->diff($currentAssignees);
        
        // Notify newly added assignees
        if ($addedAssigneeIds->count() > 0) {
            $task->load('list.board'); // Make sure board is loaded for the URL
            foreach ($task->assignees()->whereIn('users.id', $addedAssigneeIds)->get() as $assignee) {
                $assignee->notify(new TaskAssignedNotification($task, $request->user()));
            }
        }
        
        // Load the assignees for the response
        $task->load('assignees');
        
        return Redirect::back()->with('success', 'Users assigned successfully.');
    }

    /**
     * Toggle the completion status of a task.
     */
    public function toggleCompletion(Request $request, Task $task)
    {
        // Optional: You can add an authorization check here
        $this->authorize('update', $task);

        $task->completed_at = $task->completed_at ? null : now();
        $task->save();

        return Redirect::back()->with('success', $task->completed_at ? 'Task marked as completed.' : 'Task marked as incomplete.');
    }

    /**
     * Toggle archive status of a task.
     */
    public function toggleArchive(Task $task)
    {
        $this->authorize('update', $task);

        // Only completed tasks can be archived if currently not archived
        if (!$task->completed_at && !$task->archived_at) {
            return Redirect::back()->with('error', 'Only completed tasks can be archived.');
        }

        $task->archived_at = $task->archived_at ? null : now();
        $task->save();

        $message = $task->archived_at ? 'Task archived successfully.' : 'Task restored successfully.';
        return Redirect::back()->with('success', $message);
    }
}