import React, { useState, useEffect, useRef } from 'react';
import { 
  FaBell, FaCheck, FaSpinner, FaUserPlus, FaCheckCircle, 
  FaEnvelopeOpenText, FaTimesCircle, FaUserGraduate, FaChalkboardTeacher,
  FaCalendarAlt, FaClock, FaCalendarTimes, FaCalendarCheck,
  FaExclamationTriangle, FaUnlink, FaBan, FaInfoCircle
} from 'react-icons/fa';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { getRejectionReasonLabel } from '@/Utils/supervisionConstants';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState({ unread: [], read: [], unread_count: 0 });
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
      setNotifications(response.data);
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
      
      // Update the local state to reflect the change
      setNotifications((prev) => {
        const updatedUnread = prev.unread.filter((n) => n.id !== notificationId);
        const movedNotification = prev.unread.find((n) => n.id === notificationId);
        if (movedNotification) {
          movedNotification.read_at = new Date().toISOString();
          return {
            unread: updatedUnread,
            read: [movedNotification, ...prev.read],
            unread_count: updatedUnread.length,
          };
        }
        return prev;
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== notificationId));
    }
  };

  const markAllAsRead = async () => {
    try {
              await axios.post('/api/v1/app/notifications/mark-all-as-read');
      
      // Update the local state to reflect all notifications being read
      setNotifications((prev) => {
        const unreadWithReadAt = prev.unread.map(n => ({
          ...n,
          read_at: new Date().toISOString()
        }));
        
        return {
          unread: [],
          read: [...unreadWithReadAt, ...prev.read],
          unread_count: 0
        };
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleConnectionAction = (connectionId, action) => {
    setProcessingIds((prev) => [...prev, connectionId]);
    
    const url = route(`connections.${action}`, connectionId);
    const method = action === 'accept' ? 'patch' : 'delete';
    
    router[method](url, {}, {
      onSuccess: () => {
        fetchNotifications();
      },
      onFinish: () => {
        setProcessingIds((prev) => prev.filter((id) => id !== connectionId));
      }
    });
  };

  const renderNotificationContent = (notification) => {
    const data = notification.data;
    const isProcessing = processingIds.includes(notification.id) || 
                        (data.connection_id && processingIds.includes(data.connection_id));

    if (isProcessing) {
      return (
        <div className="flex items-center justify-center py-2">
          <FaSpinner className="animate-spin text-blue-500 mr-2" />
          <span className="text-sm text-gray-600">Processing...</span>
        </div>
      );
    }

    switch (data.type) {
      // ========== CONNECTION NOTIFICATIONS ==========
      case 'connection_request':
        return (
          <div className="py-2">
            <div className="flex items-start mb-1">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <FaUserPlus className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm">{data.message}</p>
                <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleDateString('en-GB')}</p>
              </div>
            </div>
            {!notification.read_at && (
              <div className="flex mt-2 space-x-2">
                <button
                  onClick={() => handleConnectionAction(data.connection_id, 'accept')}
                  className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 flex items-center"
                >
                  <FaCheck className="mr-1" /> Accept
                </button>
                <button
                  onClick={() => handleConnectionAction(data.connection_id, 'reject')}
                  className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        );

      case 'connection_accepted':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <FaCheckCircle className="text-green-600" />
              </div>
              <div>
                <p className="text-sm">{data.message}</p>
                <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          </div>
        );

      // ========== SUPERVISION REQUEST NOTIFICATIONS ==========
      case 'request_submitted':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-indigo-100 rounded-full p-2 mr-3">
                <FaEnvelopeOpenText className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New Supervision Request</p>
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-semibold">{data.student_name || 'Student'}</span> submitted a request
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Topic:</span> {data.proposal_title || 'No title'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('en-GB')}</p>
                {!notification.read_at && (
                  <button
                    onClick={() => router.visit(route('supervision.supervisor.index'))}
                    className="mt-2 px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    Review Request
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'request_accepted':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-emerald-100 rounded-full p-2 mr-3">
                <FaCheckCircle className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Request Accepted!</p>
                <p className="text-xs text-gray-600 mt-1">
                  Your supervision relationship is now active
                </p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('en-GB')}</p>
                <button
                  onClick={() => router.visit(route('supervision.student.index'))}
                  className="mt-2 px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        );

      case 'request_rejected':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <FaTimesCircle className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Request Declined</p>
                <p className="text-xs text-gray-600 mt-1">
                  {data.reason ? (
                    <>
                      <span className="font-semibold">Reason:</span> {getRejectionReasonLabel(data.reason)}
                    </>
                  ) : (
                    'Your request was not accepted'
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('en-GB')}</p>
                <button
                  onClick={() => router.visit(route('supervision.student.index'))}
                  className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        );

      case 'offer_received':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <FaUserGraduate className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">🎉 Supervision Offer Received!</p>
                <p className="text-xs text-gray-600 mt-1">
                  {data.supervisor_name} sent you an offer
                </p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('en-GB')}</p>
                {!notification.read_at && (
                  <button
                    onClick={() => router.visit(route('supervision.student.index'))}
                    className="mt-2 px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                  >
                    Review Offer
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'student_accepted_offer':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-emerald-100 rounded-full p-2 mr-3">
                <FaCheckCircle className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Student Accepted Your Offer!</p>
                <p className="text-xs text-gray-600 mt-1">
                  {data.student_name} accepted - supervision is active
                </p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('en-GB')}</p>
                <button
                  onClick={() => router.visit(route('supervision.supervisor.index'))}
                  className="mt-2 px-3 py-1 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700"
                >
                  View My Students
                </button>
              </div>
            </div>
          </div>
        );

      case 'student_rejected_offer':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-amber-100 rounded-full p-2 mr-3">
                <FaInfoCircle className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Offer Declined</p>
                <p className="text-xs text-gray-600 mt-1">
                  {data.student_name} declined your offer for "{data.proposal_title}"
                </p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('en-GB')}</p>
              </div>
            </div>
          </div>
        );

      case 'request_cancelled':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-gray-100 rounded-full p-2 mr-3">
                <FaBan className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Request Cancelled</p>
                <p className="text-xs text-gray-600 mt-1">
                  {data.student_name} cancelled their request for "{data.proposal_title}"
                </p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('en-GB')}</p>
              </div>
            </div>
          </div>
        );

      // ========== UNBIND NOTIFICATIONS ==========
      case 'unbind_request_initiated':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className={`${data.is_force ? 'bg-red-100' : 'bg-orange-100'} rounded-full p-2 mr-3`}>
                <FaUnlink className={`${data.is_force ? 'text-red-600' : 'text-orange-600'}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {data.is_force ? '⚠️ Relationship Terminated' : 'Termination Request'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {data.is_force 
                    ? `${data.initiator_name} has terminated the relationship (force unbind)`
                    : `${data.initiator_name} requested to terminate (Attempt ${data.attempt_count}/3)`
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('en-GB')}</p>
                {!data.is_force && !notification.read_at && (
                  <button
                    onClick={() => router.visit(route('supervision.' + (data.initiated_by === 'supervisor' ? 'student' : 'supervisor') + '.index'))}
                    className="mt-2 px-3 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"
                  >
                    Review Request
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'unbind_request_approved':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <FaUnlink className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Relationship Terminated</p>
                <p className="text-xs text-gray-600 mt-1">{data.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('en-GB')}</p>
              </div>
            </div>
          </div>
        );

      case 'unbind_request_rejected':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <FaInfoCircle className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Termination Request Declined</p>
                <p className="text-xs text-gray-600 mt-1">
                  {data.message}
                </p>
                {data.cooldown_until && (
                  <p className="text-xs text-amber-600 mt-1">
                    Cooldown until: {new Date(data.cooldown_until).toLocaleDateString('en-GB')}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString('en-GB')}</p>
              </div>
            </div>
          </div>
        );

      // ========== MEETING NOTIFICATIONS ==========
      case 'meeting_scheduled':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <FaCalendarAlt className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Meeting Scheduled</p>
                <p className="text-xs text-gray-600 mt-1">
                  "{data.title}" with {data.scheduler_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  📅 {new Date(data.scheduled_for).toLocaleString('en-GB')}
                </p>
                {data.location_link && (
                  <a
                    href={data.location_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            </div>
          </div>
        );

      case 'meeting_reminder':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-amber-100 rounded-full p-2 mr-3 animate-pulse">
                <FaClock className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  ⏰ Meeting Reminder ({data.reminder_type === '1h' ? '1 Hour' : '24 Hours'})
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  "{data.title}" with {data.other_party_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  📅 {new Date(data.scheduled_for).toLocaleString('en-GB')}
                </p>
                {data.location_link && (
                  <a
                    href={data.location_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-3 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            </div>
          </div>
        );

      case 'meeting_updated':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <FaCalendarCheck className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Meeting Updated</p>
                <p className="text-xs text-gray-600 mt-1">
                  "{data.title}" updated by {data.updater_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  📅 {new Date(data.scheduled_for).toLocaleString('en-GB')}
                </p>
                {data.location_link && (
                  <a
                    href={data.location_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            </div>
          </div>
        );

      case 'meeting_cancelled':
        return (
          <div className="py-2">
            <div className="flex items-start">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <FaCalendarTimes className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Meeting Cancelled</p>
                <p className="text-xs text-gray-600 mt-1">
                  "{data.title}" cancelled by {data.canceller_name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Was scheduled for: {new Date(data.was_scheduled_for).toLocaleString('en-GB')}
                </p>
              </div>
            </div>
          </div>
        );

      // ========== DEFAULT/FALLBACK ==========
      default:
        return (
          <div className="py-2">
            <p className="text-sm">{data.message || "Notification"}</p>
            <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 max-h-[80vh] flex flex-col"
    >
      <div className="px-4 py-3 bg-gray-100 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
        {notifications.unread_count > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-500 mr-2" />
            <span>Loading notifications...</span>
          </div>
        ) : (
          <>
            {/* Unread notifications */}
            {notifications.unread.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-b">
                <h4 className="text-xs font-semibold text-gray-500 uppercase">New</h4>
              </div>
            )}
            {notifications.unread.map((notification) => (
              <div 
                key={notification.id} 
                className="px-4 border-b hover:bg-gray-50 bg-blue-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    {renderNotificationContent(notification)}
                  </div>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                  >
                    <FaCheck title="Mark as read" />
                  </button>
                </div>
              </div>
            ))}

            {/* Read notifications */}
            {notifications.read.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-b">
                <h4 className="text-xs font-semibold text-gray-500 uppercase">Earlier</h4>
              </div>
            )}
            {notifications.read.map((notification) => (
              <div 
                key={notification.id} 
                className="px-4 border-b hover:bg-gray-50 text-gray-600"
              >
                {renderNotificationContent(notification)}
              </div>
            ))}

            {notifications.unread.length === 0 && notifications.read.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-500">
                <p>No notifications</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel; 