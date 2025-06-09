<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TaskCommentResource;
use App\Models\BoardList;
use App\Models\Task;
use App\Models\TaskComment;
use App\Events\TaskMoved;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * Store a newly created task in storage.
     */
    public function store(Request $request, BoardList $list)
    {
        $this->authorize('create', [Task::class, $list]);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'sometimes|string|in:Low,Medium,High,Urgent',
        ]);
        
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
        
        return back()->with('success', 'Task created successfully.');
    }
    
    /**
     * Display the specified task.
     */
    public function show(Task $task)
    {
        $this->authorize('view', $task);
        
        // Eager load relationships
        $task->load(['assignees', 'comments.user', 'creator', 'attachments.user']);
        
        return new TaskResource($task);
    }
    
    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => 'sometimes|string|in:Low,Medium,High,Urgent',
            'assignees' => 'sometimes|array',
            'assignees.*' => 'exists:users,id',
        ]);
        
        $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date'] ?? null,
            'priority' => $validated['priority'] ?? $task->priority,
        ]);
        
        // Handle assignees if provided
        if ($request->has('assignees')) {
            $task->assignees()->sync($request->input('assignees'));
        }
        
        // Load relationships for the response
        $task->load(['assignees', 'comments.user', 'creator', 'attachments.user']);
        
        return back()->with('success', 'Task updated successfully.');
    }
    
    /**
     * Remove the specified task.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);
        
        $task->delete();
        
        return back()->with('success', 'Task deleted successfully.');
    }
    
    /**
     * Move a task to a new list and/or position.
     */
    public function move(Request $request, Task $task)
    {
        $this->authorize('update', $task);
        
        $validated = $request->validate([
            'new_list_id' => 'required|exists:board_lists,id',
            'order' => 'required|integer|min:0',
        ]);
        
        // Get current list and order
        $oldListId = $task->board_list_id;
        $oldOrder = $task->order;
        $newListId = $validated['new_list_id'];
        $newOrder = $validated['order'];
        
        // Use a transaction to ensure data integrity
        DB::transaction(function () use ($task, $oldListId, $oldOrder, $newListId, $newOrder) {
            // If moving to a different list
            if ($oldListId != $newListId) {
                // Decrement order of tasks in the old list that were below the moved task
                DB::table('tasks')
                    ->where('board_list_id', $oldListId)
                    ->where('order', '>', $oldOrder)
                    ->decrement('order');
                
                // Increment order of tasks in the new list that are at or above the new position
                DB::table('tasks')
                    ->where('board_list_id', $newListId)
                    ->where('order', '>=', $newOrder)
                    ->increment('order');
            } else {
                // Moving within the same list
                if ($oldOrder < $newOrder) {
                    // Moving down - decrement tasks between old and new positions
                    DB::table('tasks')
                        ->where('board_list_id', $oldListId)
                        ->whereBetween('order', [$oldOrder + 1, $newOrder])
                        ->decrement('order');
                } else if ($oldOrder > $newOrder) {
                    // Moving up - increment tasks between new and old positions
                    DB::table('tasks')
                        ->where('board_list_id', $oldListId)
                        ->whereBetween('order', [$newOrder, $oldOrder - 1])
                        ->increment('order');
                }
            }
            
            // Update the task's position
            $task->update([
                'board_list_id' => $newListId,
                'order' => $newOrder,
            ]);
        });
        
        // Reload the task with its list and board for broadcasting
        $task->load('list.board');
        
        // Broadcast the task moved event to others
        broadcast(new TaskMoved($task, $request->user()))->toOthers();
        
        return back()->with('success', 'Task moved.');
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
        
        return back()->with('success', 'Comment added successfully.');
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
        
        // Sync the assignees
        $task->assignees()->sync($validated['user_ids']);
        
        // Load the assignees for the response
        $task->load('assignees');
        
        return new TaskResource($task);
    }
} 