import React, { useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaCheck, FaTimes, FaSpinner, FaClock, FaUserCheck } from 'react-icons/fa';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Reusable connection button component that changes based on connection status
 * 
 * @param {Object} user - The user object that contains connection_status_with_auth_user
 * @param {Function} onRemoveConnection - Optional callback when user wants to remove a connection
 */
const ConnectionButton = ({ user, onRemoveConnection }) => {
  // --- START DIAGNOSTIC LOGGING ---
  // console.log("ConnectionButton rendered for user:", user?.name, user);
  if (user && !user.connection_status_with_auth_user) {
    console.warn("DATA MISSING: 'connection_status_with_auth_user' not found for user:", user.name || user.id);
  }
  // --- END DIAGNOSTIC LOGGING ---
  
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(
    user?.connection_status_with_auth_user?.status || 'not_connected'
  );
  const [connectionId, setConnectionId] = useState(
    user?.connection_status_with_auth_user?.connection_id || null
  );
  
  if (!user || !user.connection_status_with_auth_user) {
    return null;
  }
  
  const connect = async () => {
    setIsLoading(true);
    try {
              const response = await axios.post(route('api.app.connections.store', user.id));
      if (response.data && response.data.connection) {
        setConnectionStatus('pending_sent');
        setConnectionId(response.data.connection.id);
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const acceptRequest = async () => {
    setIsLoading(true);
    try {
              await axios.patch(route('api.app.connections.accept', connectionId));
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error accepting connection request:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const rejectRequest = async () => {
    setIsLoading(true);
    try {
              await axios.delete(route('api.app.connections.reject', connectionId));
      setConnectionStatus('not_connected');
      setConnectionId(null);
    } catch (error) {
      console.error('Error rejecting connection request:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeConnection = async () => {
    // If onRemoveConnection prop is provided, use it instead of direct deletion
    if (onRemoveConnection) {
      onRemoveConnection(user.connection_status_with_auth_user);
      return;
    }
    
    // Otherwise, use the direct deletion method
    setIsLoading(true);
    try {
              await axios.delete(route('api.app.connections.destroy', connectionId));
      setConnectionStatus('not_connected');
      setConnectionId(null);
    } catch (error) {
      console.error('Error removing connection:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-gray-500 text-lg cursor-wait">
              <FaSpinner className="animate-spin" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Processing...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Use the state variable instead of the prop directly
  switch (connectionStatus) {
    case 'not_connected':
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={connect}
                className="text-gray-500 text-lg cursor-pointer hover:text-blue-700"
              >
                <FaUserPlus />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connect</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'pending_sent':
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={removeConnection}
                className="text-yellow-500 text-lg cursor-pointer hover:text-red-500"
              >
                <FaClock />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Request Sent (Click to withdraw)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'pending_received':
      return (
        <TooltipProvider delayDuration={0}>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={acceptRequest}
                  className="text-green-500 text-lg cursor-pointer hover:text-green-700"
                >
                  <FaCheck />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Accept Request</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={rejectRequest}
                  className="text-red-500 text-lg cursor-pointer hover:text-red-700"
                >
                  <FaTimes />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reject Request</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    case 'connected':
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={removeConnection}
                className="text-green-600 text-lg cursor-pointer hover:text-red-600"
              >
                <FaUserCheck />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connected (Click to remove)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    case 'is_self':
      return null;
    default:
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={connect}
                className="text-gray-500 text-lg cursor-pointer hover:text-blue-700"
              >
                <FaUserPlus />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Connect</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
  }
};

export default ConnectionButton; 