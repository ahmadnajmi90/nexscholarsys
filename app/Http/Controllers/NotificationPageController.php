<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\DatabaseNotification;

class NotificationPageController extends Controller
{
    /**
     * Display the notifications page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $perPage = $request->input('per_page', 20);
        
        $query = DatabaseNotification::where('notifiable_type', 'App\Models\User')
            ->where('notifiable_id', $user->id)
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc');
        
        // Filter by read status if specified
        if ($request->has('status')) {
            if ($request->status === 'unread') {
                $query->whereNull('read_at');
            } elseif ($request->status === 'read') {
                $query->whereNotNull('read_at');
            }
        }
        
        // Filter by notification type if specified
        if ($request->has('type') && !empty($request->type)) {
            $query->whereJsonContains('data->type', $request->type);
        }
        
        $notifications = $query->paginate($perPage);
        
        // Get available notification types for filter dropdown
        $availableTypes = [
            ['value' => 'connection_request', 'label' => 'Connection Request'],
            ['value' => 'connection_accepted', 'label' => 'Connection Accepted'],
            ['value' => 'task_assigned', 'label' => 'Task Assigned'],
            ['value' => 'task_due_date_changed', 'label' => 'Task Due Date Changed'],
            ['value' => 'workspace_invitation', 'label' => 'Workspace Invitation'],
            ['value' => 'project_invitation', 'label' => 'Project Invitation'],
            ['value' => 'meeting_scheduled', 'label' => 'Meeting Scheduled'],
            ['value' => 'meeting_reminder', 'label' => 'Meeting Reminder'],
            ['value' => 'request_submitted', 'label' => 'Supervision Request Submitted'],
            ['value' => 'request_accepted', 'label' => 'Supervision Request Accepted'],
            ['value' => 'offer_received', 'label' => 'Supervision Offer Received'],
        ];
        
        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'availableTypes' => $availableTypes,
            'filters' => [
                'status' => $request->input('status'),
                'type' => $request->input('type'),
            ],
        ]);
    }
}
