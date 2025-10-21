import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import NotificationPanel from './NotificationPanel';
import { usePage } from '@inertiajs/react';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(null);
  const { auth } = usePage().props;

  // Fetch unread count periodically
  useEffect(() => {
    // Fetch on mount
    fetchUnreadCount();
    
    // Set up interval to fetch every 30 seconds (fallback)
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Listen to real-time notifications via Pusher
  useEffect(() => {
    if (window.Echo && auth?.user?.id) {
      const channel = window.Echo.private(`App.Models.User.${auth.user.id}`);
      
      // Listen for notification.sent events
      channel.notification((notification) => {
        console.log('Real-time notification received:', notification);
        
        // Increment unread count
        setUnreadCount((prev) => prev + 1);
        
        // If panel is open, we could refresh it here
        // For now, the panel will refresh when opened next time
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
        className="relative p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      >
        <span className="sr-only">View notifications</span>
        <FaBell className="h-6 w-6" />
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      <NotificationPanel isOpen={isOpen} onClose={closePanel} />
    </div>
  );
};

export default NotificationBell; 