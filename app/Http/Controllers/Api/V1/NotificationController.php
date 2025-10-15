<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\DatabaseNotification;
use App\Models\User;

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
        
        // Get unread notifications
        $unreadNotifications = DatabaseNotification::where('notifiable_type', 'App\Models\User')
            ->where('notifiable_id', $user->id)
            ->whereNull('read_at')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get read notifications
        $readNotifications = DatabaseNotification::where('notifiable_type', 'App\Models\User')
            ->where('notifiable_id', $user->id)
            ->whereNotNull('read_at')
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
            ->update(['read_at' => now()]);
        
        return response()->json([
            'message' => 'All notifications marked as read'
        ]);
    }
}
