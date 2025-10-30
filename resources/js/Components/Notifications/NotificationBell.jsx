import React, { useState, useEffect, useRef } from 'react';
import { LuBell } from 'react-icons/lu';
import axios from 'axios';
import NotificationPanel from './NotificationPanel';
import { usePage } from '@inertiajs/react';

const NotificationBell = ({ dropdownAlign = 'right', dropdownDirection = 'down', onPanelToggle, onUnreadCountChange }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(null);
  const { auth } = usePage().props;

  // Notify parent when panel state changes
  useEffect(() => {
    if (onPanelToggle) {
      onPanelToggle(isOpen);
    }
  }, [isOpen, onPanelToggle]);

  // Notify parent when unread count changes
  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  // Fetch unread count periodically
  useEffect(() => {
    // Fetch on mount
    fetchUnreadCount();
    
    // Set up interval to fetch every 30 seconds (fallback)
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Helper function to format notification titles
  const formatNotificationTitle = (type) => {
    const titles = {
      'connection_request': 'New Connection Request',
      'connection_accepted': 'Connection Accepted',
      'task_assigned': 'New Task Assigned',
      'workspace_invitation': 'Workspace Invitation',
      'project_invitation': 'Project Invitation',
      'meeting_scheduled': 'Meeting Scheduled',
      'request_submitted': 'New Supervision Request',
      'request_accepted': 'Supervision Request Accepted',
      'request_rejected': 'Supervision Request Declined',
      'offer_received': 'Supervision Offer Received',
      'student_accepted_offer': 'Student Accepted Offer',
      'student_rejected_offer': 'Student Declined Offer',
      'cosupervisor_invitation_sent': 'Co-supervisor Invitation',
      'cosupervisor_approved': 'Co-supervisor Approved',
      'meeting_reminder': 'Meeting Reminder',
      'unbind_request_initiated': 'Unbind Request',
      'role_changed': 'Role Changed',
      'workspace_deleted': 'Workspace Deleted',
      'board_deleted': 'Board Deleted',
      // Add more as needed
    };
    return titles[type] || 'New Notification';
  };

  // Listen to real-time notifications via Pusher
  useEffect(() => {
    if (window.Echo && auth?.user?.id) {
      const channel = window.Echo.private(`App.Models.User.${auth.user.id}`);
      
      // Listen for notification.sent events
      channel.notification((notification) => {
        console.log('Real-time notification received in bell:', notification);
        
        // Increment unread count
        setUnreadCount((prev) => prev + 1);
        
        // Optional: Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          const notifTitle = notification.data?.type 
            ? formatNotificationTitle(notification.data.type)
            : 'New Notification';
          const notifBody = notification.data?.message || 'You have a new notification';
          
          new Notification(notifTitle, {
            body: notifBody,
            icon: '/favicon.ico'
          });
        }
      });
      
      return () => {
        // Clean up: stop listening
        channel.stopListening('.notification.sent');
      };
    }
  }, [auth?.user?.id]);

  const fetchUnreadCount = async () => {
    setLoading(true);
    try {
              const response = await axios.get('/api/v1/app/notifications');
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching notifications count:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={bellRef}>
      <button 
        onClick={togglePanel}
        className="relative p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors"
      >
        <span className="sr-only">View notifications</span>
        <LuBell className="h-6 w-6" />
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      <NotificationPanel isOpen={isOpen} onClose={closePanel} align={dropdownAlign} direction={dropdownDirection} />
    </div>
  );
};

export default NotificationBell; 