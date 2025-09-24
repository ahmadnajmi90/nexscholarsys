import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import ConversationList from '@/Components/Messaging/ConversationList';
import NewConversationModal from '@/Components/Messaging/NewConversationModal';
import ThreadPane from '@/Components/Messaging/ThreadPane';
import axios from 'axios';
import { debounce } from 'lodash';
import MainLayout from '@/Layouts/MainLayout';
import { toast } from 'react-hot-toast';

export default function Index({ auth }) {
  const { flash, url } = usePage().props;
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  
  // Extract conversation ID from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cid = urlParams.get('cid');
    if (cid) {
      setSelectedConversationId(parseInt(cid, 10));
    }
  }, []);
  
  // Update URL when selected conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set('cid', selectedConversationId);
      
      // Update URL without navigation
      window.history.replaceState(
        {}, 
        '', 
        `${window.location.pathname}?${urlParams.toString()}`
      );
    }
  }, [selectedConversationId]);
  
  // Show flash message if exists
  useEffect(() => {
    if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  
  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
    
    // Set up heartbeat interval for user presence
    const heartbeatInterval = setInterval(() => {
      axios.post('/api/v1/app/me/heartbeat')
        .catch(err => console.error('Heartbeat error:', err));
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(heartbeatInterval);
  }, []);
  
  // Fetch conversations from the API
  const fetchConversations = async (search = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/v1/app/messaging/conversations', {
        params: { q: search }
      });
      setConversations(response.data.data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Debounced search handler
  const handleSearch = debounce((term) => {
    setSearchTerm(term);
    fetchConversations(term);
  }, 300);
  
  // Create a new conversation
  const handleCreateConversation = async (data) => {
    try {
      const response = await axios.post('/api/v1/app/messaging/conversations', data);
      const newConversation = response.data.data;

      // Optimistically update conversations list by prepending the new conversation
      // This avoids race conditions where fetchConversations() might run before the new group is committed
      setConversations(prev => {
        // Check if the conversation already exists in the list (to avoid duplicates)
        const exists = prev.some(conv => conv.id === newConversation.id);
        if (!exists) {
          // Prepend the new conversation (it should appear at the top as the most recent)
          return [newConversation, ...prev];
        }
        return prev;
      });

      // Select the new conversation
      setSelectedConversationId(newConversation.id);

      return newConversation;
    } catch (err) {
      console.error('Error creating conversation:', err);
      throw err;
    }
  };
  
  // Handle conversation selection
  const handleSelectConversation = (id) => {
    setSelectedConversationId(id);
  };

  // Handle conversation read
  const handleConversationRead = (conversationId) => {
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, unread_count: 0 } : c)
    );
  };

  // Handle incrementing unread count for other conversations
  const handleConversationIncrementUnread = (conversationId) => {
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, unread_count: (c.unread_count ?? 0) + 1 } : c)
    );
  };

  // Handle updating conversation with new message and reordering
  const handleConversationMessageUpdate = (conversationId, message) => {
    setConversations(prev => {
      // Find the conversation to update
      const conversationIndex = prev.findIndex(c => c.id === conversationId);
      if (conversationIndex === -1) return prev;

      // Create updated conversation with new last message
      const updatedConversation = {
        ...prev[conversationIndex],
        last_message: message,
        updated_at: message.created_at // Update timestamp for sorting
      };

      // Remove the conversation from its current position
      const conversationsWithoutCurrent = [
        ...prev.slice(0, conversationIndex),
        ...prev.slice(conversationIndex + 1)
      ];

      // Add it to the beginning of the list (most recent)
      return [updatedConversation, ...conversationsWithoutCurrent];
    });
  };

  // Handle after send callback
  const handleAfterSend = (conversationId, sentMessage) => {
    // Clear unread badge for the current conversation (sender never sees unread)
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, unread_count: 0 } : c)
    );

    // Update the conversation's last message with the sent message
    handleConversationMessageUpdate(conversationId, sentMessage);
  };

  // Set up general Echo listener for other conversations' messages
  useEffect(() => {
    const channel = window.Echo.private(`App.Models.User.${auth.user.id}`);

    channel.listen('.MessageSent', (e) => {
      // Only increment if this is not the currently selected conversation
      if (e.conversation_id !== selectedConversationId) {
        handleConversationIncrementUnread(e.conversation_id);
      }

      // Update the conversation's last message and reorder conversations
      handleConversationMessageUpdate(e.conversation_id, e.message);
    });

    channel.listen('.MessageEdited', (e) => {
      // Update the conversation's last message if the edited message is the last one
      setConversations(prev => {
        return prev.map(c => {
          if (c.last_message && c.last_message.id === e.id) {
            // Update the last message with the edited content
            return {
              ...c,
              last_message: {
                ...c.last_message,
                body: e.body,
                edited_at: e.edited_at
              }
            };
          }
          return c;
        });
      });
    });

    channel.listen('.MessageDeleted', (e) => {
      // If the deleted message was the last one, we need to fetch the conversation
      // to get the new last message. For now, we'll refetch conversations.
      // TODO: Optimize this to only update the specific conversation
      fetchConversations(searchTerm);
    });

    // Handle conversation list deltas for sidebar updates
    channel.listen('.ConversationListDelta', (delta) => {
      handleConversationListDelta(delta);
    });

    return () => {
      channel.stopListening('.MessageSent');
      channel.stopListening('.MessageEdited');
      channel.stopListening('.MessageDeleted');
      channel.stopListening('.ConversationListDelta');
    };
  }, [auth.user.id, selectedConversationId, searchTerm]);

  // Handle conversation list delta for sidebar updates
  const handleConversationListDelta = (delta) => {
    setConversations(prev => {
      if (!prev) return prev;
      const next = [...prev];
      const idx = next.findIndex(c => String(c.id) === String(delta.conversation_id));
      if (idx === -1) {
        return prev;
      }
      const conv = { ...next[idx] };
      const senderId = delta.last_message_sender_id != null ? Number(delta.last_message_sender_id) : null;
      conv.updated_at = delta.updated_at ?? conv.updated_at;
      conv.title = delta.title ?? conv.title;
      conv.icon_path = delta.icon_path ?? conv.icon_path;
      if (senderId !== null) {
        conv.last_message_sender_id = senderId;
      }
      const prevLast = conv.last_message ?? {};
      conv.last_message = {
        ...prevLast,
        body: delta.last_message_preview ?? (prevLast.body ?? ''),
        preview: delta.last_message_preview ?? (prevLast.preview ?? ''),
        type: delta.last_message_type ?? (prevLast.type ?? 'text'),
        sender: senderId !== null
          ? { ...(prevLast.sender ?? {}), id: senderId }
          : (prevLast.sender ?? null),
      };

      if (typeof delta.unread_delta === 'number') {
        const currentUnread = conv.unread_count ?? 0;
        conv.unread_count = Math.max(0, currentUnread + delta.unread_delta);
      }

      next.splice(idx, 1);
      next.unshift(conv);
      return next;
    });
  };

  // Helper to fetch a single conversation if not in local state
  const fetchConversationById = async (conversationId) => {
    try {
      const response = await axios.get(`/api/v1/app/messaging/conversations/${conversationId}`);
      const conversation = response.data.data;

      setConversations(prev => {
        const exists = prev.some(c => c.id === conversation.id);
        if (!exists) {
          return [conversation, ...prev];
        }
        return prev;
      });
    } catch (err) {
      console.error('Error fetching conversation:', err);
    }
  };
  
  return (
    <MainLayout
      auth={auth}
      title={"Messages"}
    >
      <Head title="Messages" />
      
      <div className="py-6 lg:py-0">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-0">
          <Card className="overflow-hidden">
            <div className="flex h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] overflow-hidden">
              {/* Left sidebar */}
              <div className="w-full md:w-80 md:flex-none md:max-w-80 border-r flex flex-col min-w-0 overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-medium truncate">Chats</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-full w-8 h-8 p-0 flex items-center justify-center bg-primary text-white hover:bg-primary/90 transition-colors shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="sr-only">New conversation</span>
                  </button>
                </div>
                
                <ConversationList
                  conversations={conversations}
                  activeConversationId={selectedConversationId}
                  onSearchChange={handleSearch}
                  onSelectConversation={handleSelectConversation}
                />
              </div>
              
              {/* Main content area */}
              <div className="hidden md:flex flex-1 min-w-0 overflow-hidden">
                {selectedConversationId ? (
                  <ThreadPane
                    conversationId={selectedConversationId}
                    auth={auth}
                    onConversationRead={handleConversationRead}
                    onConversationIncrementUnread={handleConversationIncrementUnread}
                    onAfterSend={handleAfterSend}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-muted/10">
                    <div className="text-center max-w-md p-6">
                      <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-medium mb-2">Your Messages</h3>
                      <p className="text-muted-foreground mb-4">
                        Select a conversation to view messages or start a new one.
                      </p>
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Start a Conversation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* New conversation modal */}
      <NewConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateConversation={handleCreateConversation}
      />
    </MainLayout>
  );
}
