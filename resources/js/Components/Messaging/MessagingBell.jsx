import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import MessagingPanel from './MessagingPanel';
import axios from 'axios';

const MessagingBell = ({ dropdownAlign = 'right', dropdownDirection = 'down', onPanelToggle, onUnreadCountChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bellRef = useRef(null);

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

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('/api/v1/app/messaging/unread-count');
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={bellRef}>
      <button 
        onClick={togglePanel}
        className="relative p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors"
      >
        <span className="sr-only">View messages</span>
        <MessageSquare className="h-6 w-6" />
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <MessagingPanel 
        isOpen={isOpen} 
        onClose={handleClose}
        onUnreadCountChange={setUnreadCount}
        align={dropdownAlign}
        direction={dropdownDirection}
      />
    </div>
  );
};

export default MessagingBell;

