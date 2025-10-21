<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\DatabaseNotification;
use App\Models\User;
use App\Models\NotificationPreference;

class NotificationController extends Controller
{
    /**
     * Get the user's notifications
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        
        // Get unread notifications (exclude soft-deleted)
        $unreadNotifications = DatabaseNotification::where('notifiable_type', 'App\Models\User')
            ->where('notifiable_id', $user->id)
            ->whereNull('read_at')
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get read notifications (exclude soft-deleted)
        $readNotifications = DatabaseNotification::where('notifiable_type', 'App\Models\User')
            ->where('notifiable_id', $user->id)
            ->whereNotNull('read_at')
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        // Best-effort: augment legacy payloads with profile pictures for known patterns
        $this->augmentNotificationsWithAvatars([$unreadNotifications, $readNotifications]);
        
        // Removed diagnostics logs

        return response()->json([
            'unread' => $unreadNotifications,
            'read' => $readNotifications,
            'unread_count' => $unreadNotifications->count()
        ]);
    }
    
    /**
     * Add missing *_profile_picture to notification data for legacy records.
     * Only handles safe, user-id-based keys (e.g., requester_id, recipient_id).
     *
     * @param array<int, \Illuminate\Support\Collection> $collections
     */
    private function augmentNotificationsWithAvatars(array $collections): void
    {
        foreach ($collections as $col) {
            $col->transform(function (DatabaseNotification $n) {
                $data = $n->data ?? [];
                // Connection: requester
                if (isset($data['requester_name']) && empty($data['requester_profile_picture']) && !empty($data['requester_id'])) {
                    $data['requester_profile_picture'] = $this->resolveUserProfilePicture((int) $data['requester_id']);
                }
                // Connection: recipient
                if (isset($data['recipient_name']) && empty($data['recipient_profile_picture']) && !empty($data['recipient_id'])) {
                    $data['recipient_profile_picture'] = $this->resolveUserProfilePicture((int) $data['recipient_id']);
                }
                // Persist on the model instance (response only)
                $n->data = $data;
                return $n;
            });
        }
    }
    
    /**
     * Resolve a user's profile picture from their role models.
     */
    private function resolveUserProfilePicture(int $userId): ?string
    {
        $user = User::with(['academician', 'postgraduate', 'undergraduate'])->find($userId);
        if (!$user) return null;
        if ($user->academician && $user->academician->profile_picture) return $user->academician->profile_picture;
        if ($user->postgraduate && $user->postgraduate->profile_picture) return $user->postgraduate->profile_picture;
        if ($user->undergraduate && $user->undergraduate->profile_picture) return $user->undergraduate->profile_picture;
        return null;
    }
    
    /**
     * Mark a notification as read
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function markAsRead(Request $request)
    {
        $request->validate([
            'notification_id' => 'required|string'
        ]);
        
        $notification = DatabaseNotification::find($request->notification_id);
        
        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        // Ensure the notification belongs to the authenticated user
        if ($notification->notifiable_id != Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], Response::HTTP_FORBIDDEN);
        }
        
        $notification->markAsRead();
        
        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification
        ]);
    }
    
    /**
     * Mark all notifications as read
     *
     * @return \Illuminate\Http\Response
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        
        DatabaseNotification::where('notifiable_type', 'App\Models\User')
            ->where('notifiable_id', $user->id)
            ->whereNull('read_at')
            ->whereNull('deleted_at')
            ->update(['read_at' => now()]);
        
        return response()->json([
            'message' => 'All notifications marked as read'
        ]);
    }
    
    /**
     * Get all notifications with pagination
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function viewAll(Request $request)
    {
        $user = Auth::user();
        $perPage = $request->input('per_page', 20);
        
        $query = DatabaseNotification::where('notifiable_type', 'App\Models\User')
            ->where('notifiable_id', $user->id)
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc');
        
        // Filter by read status
        if ($request->has('read_status')) {
            if ($request->read_status === 'unread') {
                $query->whereNull('read_at');
            } elseif ($request->read_status === 'read') {
                $query->whereNotNull('read_at');
            }
        }
        
        // Filter by notification type
        if ($request->has('type') && !empty($request->type)) {
            $query->whereJsonContains('data->type', $request->type);
        }
        
        $notifications = $query->paginate($perPage);
        
        // Augment with profile pictures
        $this->augmentNotificationsWithAvatars([$notifications]);
        
        return response()->json($notifications);
    }
    
    /**
     * Soft delete a notification
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request, $id)
    {
        $notification = DatabaseNotification::find($id);
        
        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found'
            ], Response::HTTP_NOT_FOUND);
        }
        
        // Ensure the notification belongs to the authenticated user
        if ($notification->notifiable_id != Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], Response::HTTP_FORBIDDEN);
        }
        
        // Soft delete by setting deleted_at
        $notification->update(['deleted_at' => now()]);
        
        return response()->json([
            'message' => 'Notification deleted successfully'
        ]);
    }
    
    /**
     * Get user's notification preferences
     *
     * @return \Illuminate\Http\Response
     */
    public function preferences()
    {
        $user = Auth::user();
        
        // Get all preferences for this user
        $preferences = NotificationPreference::where('user_id', $user->id)->get();
        
        // Define all available notification types
        $allTypes = [
            'connection_request',
            'connection_accepted',
            'request_submitted',
            'request_accepted',
            'request_rejected',
            'offer_received',
            'student_accepted_offer',
            'student_rejected_offer',
            'request_cancelled',
            'unbind_request_initiated',
            'unbind_request_approved',
            'unbind_request_rejected',
            'meeting_scheduled',
            'meeting_reminder',
            'meeting_updated',
            'meeting_cancelled',
            'cosupervisor_invitation_sent',
            'cosupervisor_invitation_initiated',
            'cosupervisor_accepted',
            'cosupervisor_rejected',
            'cosupervisor_approval_needed',
            'cosupervisor_approved',
            'cosupervisor_rejected_by_approver',
            'cosupervisor_added',
            'cosupervisor_invitation_cancelled',
            'task_assigned',
            'task_due_date_changed',
            'workspace_invitation',
            'workspace_deleted',
            'board_deleted',
            'role_changed',
            'project_invitation',
            'faculty_admin_invitation',
        ];
        
        // Create a map of existing preferences
        $preferencesMap = [];
        foreach ($preferences as $pref) {
            $preferencesMap[$pref->notification_type] = [
                'email_enabled' => $pref->email_enabled,
                'database_enabled' => $pref->database_enabled,
            ];
        }
        
        // Fill in defaults for types without preferences
        $result = [];
        foreach ($allTypes as $type) {
            $result[] = [
                'notification_type' => $type,
                'email_enabled' => $preferencesMap[$type]['email_enabled'] ?? true,
                'database_enabled' => $preferencesMap[$type]['database_enabled'] ?? true,
            ];
        }
        
        return response()->json([
            'preferences' => $result
        ]);
    }
    
    /**
     * Update user's notification preferences
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updatePreferences(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'preferences' => 'required|array',
            'preferences.*.notification_type' => 'required|string',
            'preferences.*.email_enabled' => 'required|boolean',
            'preferences.*.database_enabled' => 'required|boolean',
        ]);
        
        foreach ($request->preferences as $pref) {
            NotificationPreference::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'notification_type' => $pref['notification_type'],
                ],
                [
                    'email_enabled' => $pref['email_enabled'],
                    'database_enabled' => $pref['database_enabled'],
                ]
            );
        }
        
        return response()->json([
            'message' => 'Notification preferences updated successfully'
        ]);
    }
}
