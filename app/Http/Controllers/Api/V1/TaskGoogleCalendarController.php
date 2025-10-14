<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Services\GoogleCalendarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TaskGoogleCalendarController extends Controller
{
    protected GoogleCalendarService $googleCalendarService;

    public function __construct(GoogleCalendarService $googleCalendarService)
    {
        $this->googleCalendarService = $googleCalendarService;
    }

    /**
     * Add a task to Google Calendar
     */
    public function addTask(Request $request, Task $task): JsonResponse
    {
        try {
            // Check if user can view the task
            $this->authorize('view', $task);

            // Check if task has a due date
            if (!$task->due_date) {
                return response()->json([
                    'success' => false,
                    'message' => 'Task must have a due date to be added to calendar',
                ], 400);
            }

            // Check if user has Google Calendar connected
            $user = $request->user();
            if (!$user->hasGoogleCalendarConnected()) {
                return response()->json([
                    'success' => false,
                    'needs_connection' => true,
                    'message' => 'Please connect your Google Calendar first',
                ], 400);
            }

            // Check if task already has a calendar event
            if ($task->hasGoogleCalendarEvent()) {
                return response()->json([
                    'success' => false,
                    'already_exists' => true,
                    'message' => 'This task is already in your Google Calendar',
                    'task' => $task,
                ], 400);
            }

            // Create the calendar event
            $eventId = $this->googleCalendarService->createTaskEvent($task, $user);

            if ($eventId) {
                // Update task with calendar event info
                $task->update([
                    'external_event_id' => $eventId,
                    'external_provider' => 'google',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Task added to Google Calendar successfully',
                    'task' => $task->fresh(),
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to add task to Google Calendar',
            ], 500);

        } catch (\Exception $e) {
            Log::error('Failed to add task to Google Calendar', [
                'task_id' => $task->id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while adding task to calendar',
            ], 500);
        }
    }

    /**
     * Remove a task from Google Calendar
     */
    public function removeTask(Request $request, Task $task): JsonResponse
    {
        try {
            // Check if user can view the task
            $this->authorize('view', $task);

            // Check if task has a Google Calendar event
            if (!$task->hasGoogleCalendarEvent()) {
                return response()->json([
                    'success' => false,
                    'message' => 'This task is not in your Google Calendar',
                ], 400);
            }

            // Delete the calendar event
            $this->googleCalendarService->deleteTaskEvent($task);

            // Remove calendar event info from task
            $task->update([
                'external_event_id' => null,
                'external_provider' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Task removed from Google Calendar successfully',
                'task' => $task->fresh(),
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to remove task from Google Calendar', [
                'task_id' => $task->id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while removing task from calendar',
            ], 500);
        }
    }

    /**
     * Get Google Calendar status for tasks
     */
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'connected' => $user->hasGoogleCalendarConnected(),
            'enabled' => $user->google_calendar_enabled ?? false,
            'token_expires_at' => $user->google_token_expires_at,
        ]);
    }
}