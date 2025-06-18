import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCheck, FaSpinner, FaUserPlus, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { router } from '@inertiajs/react';

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
      const response = await axios.get('/api/v1/notifications');
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
      await axios.post('/api/v1/notifications/mark-as-read', {
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
      await axios.post('/api/v1/notifications/mark-all-as-read');
      
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
      case 'connection_request':
        return (
          <div className="py-2">
            <div className="flex items-start mb-1">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <FaUserPlus className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm">{data.message}</p>
                <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</p>
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
                <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        );

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