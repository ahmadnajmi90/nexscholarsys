import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import ConversationListItem from './ConversationListItem';
import ThreadPane from './ThreadPane';

const MessagingPanel = ({ isOpen, onClose, onUnreadCountChange }) => {
  const [view, setView] = useState('list'); // 'list' or 'thread'
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const panelRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fetch conversations when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen]);

  const fetchConversations = async (search = '') => {
    setLoading(true);
    try {
      const response = await axios.get('/api/v1/app/messaging/conversations', {
        params: { q: search }
      });
      setConversations(response.data.data || []);
      
      // Update unread count
      const unreadCount = (response.data.data || []).reduce((count, conv) => {
        return count + (conv.unread_count || 0);
      }, 0);
      onUnreadCountChange(unreadCount);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Simple debounce - in production, use lodash debounce
    const timeoutId = setTimeout(() => {
      fetchConversations(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleConversationSelect = async (conversation) => {
    setSelectedConversation(conversation);
    setView('thread');
    
    // Mark as read
    try {
      await axios.post(`/api/v1/app/messaging/conversations/${conversation.id}/mark-read`);
      fetchConversations(); // Refresh to update unread counts
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  const handleBack = () => {
    setView('list');
    setSelectedConversation(null);
    fetchConversations(); // Refresh list
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 mt-2 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-[60] flex flex-col border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="px-5 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {view === 'thread' && (
            <button
              onClick={handleBack}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors mr-2"
              title="Back to conversations"
            >
              <FaArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {view === 'list' ? 'Messages' : (selectedConversation?.name || 'Chat')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'list' ? (
          // Conversation List View
          <div className="h-full flex flex-col">
            {/* Search */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full p-2 pl-8 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-100"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <FaSpinner className="animate-spin h-6 w-6 text-gray-400" />
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'No conversations found' : 'No conversations yet'}
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation)}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <ConversationListItem
                        conversation={conversation}
                        isActive={false}
                        onSelect={() => {}} // Handle click in parent div
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Thread View
          <div className="h-full">
            {selectedConversation && (
              <ThreadPane
                conversationId={selectedConversation.id}
                conversation={selectedConversation}
                isPanel={true}
              />
            )}
          </div>
        )}
      </div>

      {/* Footer - Only show in list view */}
      {view === 'list' && (
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/messaging"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            View all messages →
          </Link>
        </div>
      )}
    </div>
  );
};

export default MessagingPanel;

