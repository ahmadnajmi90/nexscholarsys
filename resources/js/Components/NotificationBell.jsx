import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import ConnectionHandler from '@/Utils/ConnectionHandler';
import NotificationPanel from '@/Components/NotificationPanel';

const NotificationBell = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingRequests = async () => {
    setIsLoading(true);
    try {
      const response = await ConnectionHandler.getConnections('friendship', 'pending');
      if (response && response.connections) {
        setPendingRequests(response.connections);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    
    // Poll for new requests every 60 seconds
    const interval = setInterval(() => {
      fetchPendingRequests();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAcceptRequest = async (connectionId) => {
    try {
      await ConnectionHandler.acceptFriendRequest(connectionId);
      
      // Update the pending requests list
      setPendingRequests(prev => prev.filter(req => req.connection_id !== connectionId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (connectionId) => {
    try {
      await ConnectionHandler.rejectFriendRequest(connectionId);
      
      // Update the pending requests list
      setPendingRequests(prev => prev.filter(req => req.connection_id !== connectionId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={togglePanel}
        aria-label="Notifications"
      >
        <FaBell className="text-2xl" />
        {pendingRequests.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {pendingRequests.length}
          </span>
        )}
      </button>

      <NotificationPanel
        isOpen={isOpen}
        closePanel={closePanel}
        pendingRequests={pendingRequests}
        handleAcceptRequest={handleAcceptRequest}
        handleRejectRequest={handleRejectRequest}
        isLoading={isLoading}
      />
    </>
  );
};

export default NotificationBell; 