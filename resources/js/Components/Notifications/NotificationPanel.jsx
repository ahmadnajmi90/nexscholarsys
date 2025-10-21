import React, { useState, useEffect, useRef } from 'react';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { getRejectionReasonLabel } from '@/Utils/supervisionConstants';
import UserAvatar from './UserAvatar';
import { getRelativeTime } from '@/Utils/notificationHelpers';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState([]);
  const panelRef = useRef(null);

  useEffect(() => {
    // Click outside handler
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Fetch notifications when the panel is opened
    if (isOpen) {
      fetchNotifications();
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/app/notifications');
      // Combine unread and read into single array, sorted by date descending
      const combined = [
        ...response.data.unread.map(n => ({ ...n, read_at: null })),
        ...response.data.read
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      // Remove legacy duplicate connection-request notifications if a typed one exists
      const deduped = dedupeNotifications(combined);
      
      setAllNotifications(deduped);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    setProcessingIds((prev) => [...prev, notificationId]);
    try {
      await axios.post('/api/v1/app/notifications/mark-as-read', {
        notification_id: notificationId,
      });
      
      // Update the local state to mark as read (stays in position)
      setAllNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== notificationId));
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post('/api/v1/app/notifications/mark-all-as-read');
      
      // Mark all notifications as read in local state
      setAllNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // In-panel action buttons have been removed for a cleaner design.
  // Only "Mark as read" remains (shown on hover).

  // Extract user data from notification
  const getUserData = (notification) => {
    const data = notification.data;
    
    // Priority order for determining which user to show
    // Connection notifications
    if (data.requester_name) {
      return {
        name: data.requester_name,
        profilePicture: data.requester_profile_picture,
      };
    }
    if (data.recipient_name) {
      return {
        name: data.recipient_name,
        profilePicture: data.recipient_profile_picture,
      };
    }
    
    // Supervision notifications
    if (data.student_name) {
      return {
        name: data.student_name,
        profilePicture: data.student_profile_picture,
      };
    }
    if (data.supervisor_name) {
      return {
        name: data.supervisor_name,
        profilePicture: data.supervisor_profile_picture,
      };
    }
    
    // NexLab task notifications
    if (data.assigner_name) {
      return {
        name: data.assigner_name,
        profilePicture: data.assigner_profile_picture,
      };
    }
    
    // Workspace/Project invitations
    if (data.inviter_name) {
      return {
        name: data.inviter_name,
        profilePicture: data.inviter_profile_picture,
      };
    }
    
    // Meeting notifications
    if (data.scheduler_name) {
      return {
        name: data.scheduler_name,
        profilePicture: data.scheduler_profile_picture,
      };
    }
    if (data.other_party_name) {
      return {
        name: data.other_party_name,
        profilePicture: data.other_party_profile_picture,
      };
    }
    if (data.updater_name) {
      return {
        name: data.updater_name,
        profilePicture: data.updater_profile_picture,
      };
    }
    if (data.canceller_name) {
      return {
        name: data.canceller_name,
        profilePicture: data.canceller_profile_picture,
      };
    }
    
    // Unbind notifications
    if (data.initiator_name) {
      return {
        name: data.initiator_name,
        profilePicture: data.initiator_profile_picture,
      };
    }
    
    // Role changed / Board deleted / Workspace deleted / Task due date changed
    if (data.changed_by_profile_picture || data.deleted_by_profile_picture) {
      return {
        name: data.changed_by || data.deleted_by || 'Administrator',
        profilePicture: data.changed_by_profile_picture || data.deleted_by_profile_picture,
      };
    }
    
    // Co-supervisor notifications
    if (data.cosupervisor_name) {
      return {
        name: data.cosupervisor_name,
        profilePicture: data.cosupervisor_profile_picture,
      };
    }
    if (data.initiator) {
      return {
        name: data.initiator,
        profilePicture: data.initiator_profile_picture,
      };
    }
    if (data.approver) {
      return {
        name: data.approver,
        profilePicture: data.approver_profile_picture,
      };
    }
    
    // Default fallback
    return {
      name: 'System',
      profilePicture: null,
    };
  };

  // De-duplicate legacy connection request notifications
  const dedupeNotifications = (items) => {
    const typedConnKeys = new Set();
    items.forEach((n) => {
      const d = n.data || {};
      if (d.type === 'connection_request') {
        const key = `rqid:${d.requester_id ?? ''}|name:${(d.requester_name ?? '').toLowerCase()}`;
        typedConnKeys.add(key);
      }
    });
    return items.filter((n) => {
      const d = n.data || {};
      // keep all typed connection requests
      if (d.type === 'connection_request') return true;
      // drop legacy/plain-text connection requests if a typed one exists
      const looksLikeLegacyConnReq = !d.type && d.message && /connection request/i.test(String(d.message)) && (d.requester_id || d.requester_name);
      if (looksLikeLegacyConnReq) {
        const key = `rqid:${d.requester_id ?? ''}|name:${(d.requester_name ?? '').toLowerCase()}`;
        if (typedConnKeys.has(key)) return false;
      }
      return true;
    });
  };

  const renderNotificationContent = (notification) => {
    const data = notification.data;
    const isProcessing = processingIds.includes(notification.id) || 
                        (data.connection_id && processingIds.includes(data.connection_id));
    
    const userData = getUserData(notification);

    if (isProcessing) {
      return (
        <div className="flex items-center justify-center py-2">
          <FaSpinner className="animate-spin text-blue-500 mr-2" />
          <span className="text-sm text-gray-600">Processing...</span>
        </div>
      );
    }

    const renderBasicNotification = (title, description, actionButton = null) => (
      <div className="flex items-start gap-3 py-3">
        <UserAvatar 
          src={userData.profilePicture} 
          name={userData.name} 
          size="md"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm">
            <span className="font-semibold text-gray-900 dark:text-gray-50">{userData.name}</span>
            {' '}
            <span className="text-gray-600 dark:text-gray-300">{description}</span>
          </p>
          {title && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{title}</p>}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getRelativeTime(notification.created_at)}</p>
          {actionButton && <div className="mt-2">{actionButton}</div>}
        </div>
      </div>
    );

    switch (data.type) {
      // ========== CONNECTION NOTIFICATIONS ==========
      case 'connection_request':
        return renderBasicNotification(
          null,
          'sent you a connection request',
          <Link
            href="/connections?tab=received"
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
          >
            View
          </Link>
        );

      case 'connection_accepted':
        return (
          <div className="flex items-start gap-3 py-3">
            <UserAvatar 
              src={userData.profilePicture} 
              name={userData.name} 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold text-gray-900 dark:text-gray-50">{userData.name}</span>
                {' '}
                <span className="text-gray-600 dark:text-gray-300">accepted your connection request</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">You are friend now!</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getRelativeTime(notification.created_at)}</p>
              <div className="mt-2">
                <Link
                  href="/connections?tab=connections"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        );

      // ========== SUPERVISION REQUEST NOTIFICATIONS ==========
      case 'request_submitted':
        return renderBasicNotification(
          data.proposal_title,
          'submitted a new supervision request'
        );

      case 'request_accepted':
        return renderBasicNotification(
          null,
          'accepted your supervision request'
        );

      case 'request_rejected':
        return renderBasicNotification(
          data.reason ? `Reason: ${getRejectionReasonLabel(data.reason)}` : null,
          'declined your supervision request'
        );

      case 'offer_received':
        return renderBasicNotification(
          data.proposal_title,
          'sent you a supervision offer'
        );

      case 'student_accepted_offer':
        return renderBasicNotification(
          null,
          'accepted your supervision offer'
        );

      case 'student_rejected_offer':
        return renderBasicNotification(
          data.proposal_title && `Re: ${data.proposal_title}`,
          'declined your supervision offer'
        );

      case 'request_cancelled':
        return renderBasicNotification(
          data.proposal_title && `Re: ${data.proposal_title}`,
          'cancelled their supervision request'
        );

      // ========== UNBIND NOTIFICATIONS ==========
      case 'unbind_request_initiated':
        return renderBasicNotification(
          data.is_force ? '⚠️ Force unbind' : `Attempt ${data.attempt_count}/3`,
          data.is_force 
            ? 'terminated the supervision relationship'
            : 'requested to terminate the relationship'
        );

      case 'unbind_request_approved':
        return renderBasicNotification(
          null,
          'The supervision relationship has been terminated'
        );

      case 'unbind_request_rejected':
        return renderBasicNotification(
          data.cooldown_until && `Cooldown until: ${new Date(data.cooldown_until).toLocaleDateString('en-GB')}`,
          'declined the termination request'
        );

      // ========== MEETING NOTIFICATIONS ==========
      case 'meeting_scheduled':
        return (
          <div className="flex items-start gap-3 py-3">
            <UserAvatar 
              src={userData.profilePicture} 
              name={userData.name} 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold text-gray-900 dark:text-gray-50">{userData.name}</span>
                {' '}
                <span className="text-gray-600 dark:text-gray-300">scheduled a meeting</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">"{data.title}"</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                📅 {new Date(data.scheduled_for).toLocaleString('en-GB')}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getRelativeTime(notification.created_at)}</p>
            </div>
          </div>
        );

      case 'meeting_reminder':
        return (
          <div className="flex items-start gap-3 py-3">
            <UserAvatar 
              src={userData.profilePicture} 
              name={userData.name} 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="text-gray-600 dark:text-gray-300">⏰ Meeting with </span>
                <span className="font-semibold text-gray-900 dark:text-gray-50">{userData.name}</span>
                <span className="text-gray-600 dark:text-gray-300"> starting {data.reminder_type === '1h' ? 'in 1 hour' : 'in 24 hours'}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">"{data.title}"</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getRelativeTime(notification.created_at)}</p>
            </div>
          </div>
        );

      case 'meeting_updated':
        return renderBasicNotification(
          `"${data.title}" - ${new Date(data.scheduled_for).toLocaleString('en-GB')}`,
          'updated the meeting'
        );

      case 'meeting_cancelled':
        return renderBasicNotification(
          `"${data.title}" was scheduled for ${new Date(data.was_scheduled_for).toLocaleString('en-GB')}`,
          'cancelled the meeting'
        );

      // ========== CO-SUPERVISOR NOTIFICATIONS ==========
      case 'cosupervisor_invitation_sent':
        return renderBasicNotification(
          data.invitation_message && `"${data.invitation_message}"`,
          data.initiated_by === 'student' 
            ? 'invited you to be their co-supervisor'
            : `invited you to be co-supervisor for ${data.student_name}`
        );

      case 'cosupervisor_invitation_initiated':
        return renderBasicNotification(
          `Adding ${data.cosupervisor_name} as co-supervisor`,
          data.initiated_by === 'student' 
            ? 'initiated a co-supervisor invitation'
            : `wants to add a co-supervisor for ${data.student_name}`
        );

      case 'cosupervisor_accepted':
        return renderBasicNotification(
          null,
          'accepted the co-supervisor invitation. Waiting for approval.'
        );

      case 'cosupervisor_rejected':
        return renderBasicNotification(
          data.rejection_reason && `Reason: ${data.rejection_reason}`,
          'declined the co-supervisor invitation'
        );

      case 'cosupervisor_approval_needed':
        return renderBasicNotification(
          `${data.cosupervisor_name} accepted the invitation`,
          'Your approval is required'
        );

      case 'cosupervisor_approved':
        return renderBasicNotification(
          `${data.cosupervisor_name} has been approved`,
          'approved the co-supervisor invitation'
        );

      case 'cosupervisor_rejected_by_approver':
        return renderBasicNotification(
          data.rejection_reason && `Reason: ${data.rejection_reason}`,
          `did not approve ${data.cosupervisor_name} as co-supervisor`
        );

      case 'cosupervisor_added':
        return renderBasicNotification(
          `Now co-supervising ${data.student_name}`,
          'has been added as co-supervisor'
        );

      case 'cosupervisor_invitation_cancelled':
        return renderBasicNotification(
          null,
          'cancelled the co-supervisor invitation'
        );

      // ========== NEXLAB TASK NOTIFICATIONS ==========
      case 'task_assigned':
        return (
          <div className="flex items-start gap-3 py-3">
            <UserAvatar 
              src={userData.profilePicture} 
              name={userData.name} 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-semibold text-gray-900 dark:text-gray-50">{userData.name}</span>
                {' '}
                <span className="text-gray-600 dark:text-gray-300">assigned you to task</span>
                {' '}
                <span className="font-medium text-gray-900 dark:text-gray-50">"{data.task_title}"</span>
                {data.workspace_name && (
                  <span className="text-gray-500 dark:text-gray-400"> in {data.workspace_name}</span>
                )}
              </p>
              {data.task_due_date && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  📅 Due: {new Date(data.task_due_date).toLocaleDateString('en-GB')}
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getRelativeTime(notification.created_at)}</p>
            </div>
          </div>
        );

      case 'task_due_date_changed':
        return (
          <div className="flex items-start gap-3 py-3">
            <UserAvatar 
              src={userData.profilePicture} 
              name={userData.name} 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="text-gray-600 dark:text-gray-300">Due date changed for task</span>
                {' '}
                <span className="font-medium text-gray-900 dark:text-gray-50">"{data.task_title}"</span>
              </p>
              {data.old_due_date_formatted && data.new_due_date_formatted && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {data.old_due_date_formatted} → {data.new_due_date_formatted}
                </p>
              )}
              {data.changed_by && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Changed by {data.changed_by}
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getRelativeTime(notification.created_at)}</p>
            </div>
          </div>
        );

      // ========== WORKSPACE & PROJECT INVITATIONS ==========
      case 'workspace_invitation':
        return renderBasicNotification(
          null,
          `invited you to workspace "${data.workspace_name}"`
        );

      case 'project_invitation':
        return renderBasicNotification(
          null,
          `invited you to project "${data.project_name}"`
        );

      // ========== DELETION NOTIFICATIONS ==========
      case 'workspace_deleted':
        return (
          <div className="flex items-start gap-3 py-3">
            <UserAvatar 
              src={userData.profilePicture}
              name={userData.name} 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="text-gray-600 dark:text-gray-300">Workspace</span>
                {' '}
                <span className="font-medium text-gray-900 dark:text-gray-50">"{data.workspace_name}"</span>
                {' '}
                <span className="text-gray-600 dark:text-gray-300">was deleted</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Deleted by {data.deleted_by}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getRelativeTime(notification.created_at)}</p>
            </div>
          </div>
        );

      case 'board_deleted':
        return (
          <div className="flex items-start gap-3 py-3">
            <UserAvatar 
              src={userData.profilePicture}
              name={userData.name} 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="text-gray-600 dark:text-gray-300">Board</span>
                {' '}
                <span className="font-medium text-gray-900 dark:text-gray-50">"{data.board_name}"</span>
                {' '}
                <span className="text-gray-600 dark:text-gray-300">
                  in {data.parent_type} "{data.parent_name}" was deleted
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Deleted by {data.deleted_by}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getRelativeTime(notification.created_at)}</p>
            </div>
          </div>
        );

      // ========== ROLE CHANGE NOTIFICATION ==========
      case 'role_changed':
        return (
          <div className="flex items-start gap-3 py-3">
            <UserAvatar 
              src={userData.profilePicture} 
              name={userData.name} 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="text-gray-600 dark:text-gray-300">Your role in {data.parent_type}</span>
                {' '}
                <span className="font-medium text-gray-900 dark:text-gray-50">"{data.parent_name}"</span>
                {' '}
                <span className="text-gray-600 dark:text-gray-300">changed to</span>
                {' '}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {data.new_role}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Changed by {data.changed_by}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getRelativeTime(notification.created_at)}</p>
            </div>
          </div>
        );

      // ========== FACULTY ADMIN INVITATION ==========
      case 'faculty_admin_invitation':
        return (
          <div className="flex items-start gap-3 py-3">
            <UserAvatar 
              src={null} 
              name="Admin" 
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="text-gray-600 dark:text-gray-300">You have been invited to join as</span>
                {' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">Faculty Admin</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Please complete your setup to get started
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{getRelativeTime(notification.created_at)}</p>
            </div>
          </div>
        );

      // ========== DEFAULT/FALLBACK ==========
      default:
        return renderBasicNotification(
          null,
          data.message || 'sent you a notification'
        );
    }
  };

  // Filter notifications based on active tab
  const displayedNotifications = activeTab === 'all' 
    ? allNotifications 
    : allNotifications.filter(n => !n.read_at);

  const unreadCount = allNotifications.filter(n => !n.read_at).length;

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 mt-2 w-96 sm:w-[28rem] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-[60] max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="px-5 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Notifications</h3>
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="px-5">
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <button
              onClick={() => setActiveTab('all')}
              className={`
                py-3 border-b-2 transition-colors -mb-[1px]
                ${activeTab === 'all' 
                  ? 'border-blue-600 text-gray-900 dark:text-gray-50' 
                  : 'border-transparent hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
                }
              `}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`
                py-3 border-b-2 transition-colors -mb-[1px]
                ${activeTab === 'unread' 
                  ? 'border-blue-600 text-gray-900 dark:text-gray-50' 
                  : 'border-transparent hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
                }
              `}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>
      </div>
      
      {/* Notifications List */}
      <div className="overflow-y-auto flex-grow divide-y divide-gray-100 dark:divide-gray-700">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-blue-500 mr-2" />
            <span className="text-gray-600">Loading...</span>
          </div>
        ) : displayedNotifications.length > 0 ? (
          displayedNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`
                group px-5 transition-colors relative
                ${!notification.read_at ? 'bg-blue-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}
                hover:bg-gray-50 dark:hover:bg-gray-800/70
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  {renderNotificationContent(notification)}
                </div>
                {!notification.read_at && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-2 mt-3 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Mark as read"
                  >
                    <FaCheck className="text-xs" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-5 py-12 text-center text-gray-500">
            <p className="text-sm">
              {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
        <a 
          href={route('notifications.index')} 
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
        >
          View all notifications
        </a>
      </div>
    </div>
  );
};

export default NotificationPanel;
