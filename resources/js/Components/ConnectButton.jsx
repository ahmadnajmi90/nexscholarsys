import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserCheck, FaUserClock, FaUserTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConnectionHandler from '@/Utils/ConnectionHandler';

const ConnectButton = ({ 
  userId,
  className = '',
  iconSize = 'text-lg',
  showText = false,
  tooltipPosition = 'bottom',
  onStatusChange = () => {}
}) => {
  const [connectionStatus, setConnectionStatus] = useState({
    is_friend: false,
    request_sent: false,
    request_received: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check connection status when component mounts
    checkConnectionStatus();
  }, [userId]);

  const checkConnectionStatus = async () => {
    setIsLoading(true);
    try {
      const response = await ConnectionHandler.checkConnectionStatus(userId);
      setConnectionStatus({
        is_friend: response.is_friend,
        request_sent: response.request_sent,
        request_received: response.request_received
      });
      onStatusChange(response);
    } catch (error) {
      console.error('Error checking connection status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await ConnectionHandler.sendFriendRequest(userId);
      
      // Update local state based on response
      if (response.status === 'pending') {
        setConnectionStatus(prev => ({ ...prev, request_sent: true }));
      } else if (response.status === 'accepted') {
        setConnectionStatus(prev => ({ ...prev, is_friend: true, request_sent: false }));
      }
      
      // Show success message
      toast.success(
        response.message,
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      
      onStatusChange({
        is_friend: response.status === 'accepted',
        request_sent: response.status === 'pending',
        request_received: false
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send request. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeConnection = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await ConnectionHandler.removeConnection(userId);
      
      setConnectionStatus({
        is_friend: false,
        request_sent: false,
        request_received: false
      });
      
      // Show success message
      toast.success(
        'Connection removed successfully',
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      
      onStatusChange({
        is_friend: false,
        request_sent: false,
        request_received: false
      });
    } catch (error) {
      console.error('Error removing connection:', error);
      toast.error('Failed to remove connection. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the appropriate button content based on connection status
  const getButtonContent = () => {
    if (connectionStatus.is_friend) {
      return {
        icon: <FaUserCheck className={iconSize} />,
        text: 'Connected',
        action: removeConnection,
        className: 'text-green-600 hover:text-red-500',
        tooltip: 'Remove Connection'
      };
    } else if (connectionStatus.request_sent) {
      return {
        icon: <FaUserClock className={iconSize} />,
        text: 'Request Sent',
        action: null, // No action when request is pending
        className: 'text-blue-500 cursor-default',
        tooltip: 'Request Pending'
      };
    } else if (connectionStatus.request_received) {
      return {
        icon: <FaUserClock className={iconSize} />,
        text: 'Respond to Request',
        action: () => window.location.href = route('connections.index'),
        className: 'text-purple-500 hover:text-purple-700',
        tooltip: 'View Request'
      };
    } else {
      return {
        icon: <FaUserPlus className={iconSize} />,
        text: 'Connect',
        action: sendFriendRequest,
        className: 'text-gray-500 hover:text-blue-700',
        tooltip: 'Send Connection Request'
      };
    }
  };

  const buttonContent = getButtonContent();

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={buttonContent.action}
        className={`flex items-center focus:outline-none transition duration-200 ${buttonContent.className}`}
        disabled={isLoading || !buttonContent.action}
        aria-label={buttonContent.tooltip}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        ) : (
          buttonContent.icon
        )}
        
        {showText && (
          <span className="ml-1">
            {buttonContent.text}
          </span>
        )}
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className={`
          absolute z-50 w-max 
          ${tooltipPosition === 'bottom' ? 'top-full mt-2 left-1/2 transform -translate-x-1/2' : 
            tooltipPosition === 'top' ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2' : 
            tooltipPosition === 'right' ? 'left-full ml-2 top-1/2 transform -translate-y-1/2' : 
            'right-full mr-2 top-1/2 transform -translate-y-1/2'} 
          px-3 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-lg shadow-lg whitespace-nowrap
        `}>
          <div className={`
            absolute w-3 h-3 bg-white transform rotate-45 border-gray-200
            ${tooltipPosition === 'bottom' ? 'top-0 -translate-y-1/2 border-t border-l left-1/2 -translate-x-1/2' : 
              tooltipPosition === 'top' ? 'bottom-0 translate-y-1/2 border-b border-r left-1/2 -translate-x-1/2' : 
              tooltipPosition === 'right' ? 'left-0 -translate-x-1/2 border-l border-t top-1/2 -translate-y-1/2' : 
              'right-0 translate-x-1/2 border-r border-b top-1/2 -translate-y-1/2'}
          `}></div>
          <div className="relative z-10">
            {buttonContent.tooltip}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectButton; 