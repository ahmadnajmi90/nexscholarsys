import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import NotificationPanel from './NotificationPanel';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(null);

  // Fetch unread count periodically
  useEffect(() => {
    // Fetch on mount
    fetchUnreadCount();
    
    // Set up interval to fetch every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

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